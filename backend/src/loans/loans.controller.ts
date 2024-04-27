import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFiles,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { LoansService } from './loans.service';
import { Loan } from './loan.entity';
import { RepaymentsService } from '..//repayment/repayments.service';
import { Repayment } from '..//repayment/repayment.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { createReadStream } from 'fs';
import { join } from 'path';
import type { Response } from 'express';
import * as mime from 'mime-types';
import * as fs from 'node:fs';
import { Public } from '../auth/constants';
import { UserRole } from '../users/user.entity';

@Controller('loans')
export class LoansController {
  constructor(
    private readonly loansService: LoansService,
    private readonly repaymentService: RepaymentsService,
  ) {}

  @Get('/todaylist')
  async getTodayDueLoans(
    @Request() req,
    @Query('itemsPerPage') itemsPerPage: number,
    @Query('pageNumber') pageNumber: number,
  ): Promise<[Loan[], number]> {
    const endOfToday = new Date();
    const startOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    startOfToday.setHours(0, 0, 0, 0);
    return await this.loansService.findAllDueLoan(
      startOfToday,
      endOfToday,
      itemsPerPage,
      pageNumber,
      UserRole[req['user'].role],
      req['user'].sub,
    );
  }
  @Get('/tomorrowlist')
  async getTomorrowDueLoans(
    @Request() req,
    @Query('itemsPerPage') itemsPerPage: number,
    @Query('pageNumber') pageNumber: number,
  ): Promise<[Loan[], number]> {
    const endOfTomorrow = new Date(
      new Date().setDate(new Date().getDate() + 1),
    );
    const startOfTomorrow = new Date(
      new Date().setDate(new Date().getDate() + 1),
    );
    endOfTomorrow.setHours(23, 59, 59, 999);
    startOfTomorrow.setHours(0, 0, 0, 0);
    return await this.loansService.findAllDueLoan(
      startOfTomorrow,
      endOfTomorrow,
      itemsPerPage,
      pageNumber,
      UserRole[req['user'].role],
      req['user'].sub,
    );
  }

  @Get('/search')
  async searchLoans(
    @Request() req,
    @Query('searchTerm') searchTerm: string,
    @Query('itemsPerPage') itemsPerPage: number,
    @Query('pageNumber') pageNumber: number,
  ): Promise<[Loan[], number]> {
    // pagination
    return await this.loansService.searchLoans(
      searchTerm,
      itemsPerPage,
      pageNumber,
      UserRole[req['user'].role],
      req['user'].sub,
    );
  }
  @Get('/')
  async getAllLoans(
    @Request() req,
    @Query('itemsPerPage') itemsPerPage: number,
    @Query('pageNumber') pageNumber: number,
  ): Promise<[Loan[], number]> {
    // pagination
    console.log('printing request', itemsPerPage, pageNumber);
    return await this.loansService.findAll(
      itemsPerPage,
      pageNumber,
      UserRole[req['user'].role],
      req['user'].sub,
    );
  }
  @Get('/ofuser')
  async getAllLoansOfUser(
    @Request() req,
    @Query('customerid') customerid: number,
  ): Promise<Loan[]> {
    // pagination
    return await this.loansService.findAllLoansOfCustomer(
      customerid,
      UserRole[req['user'].role],
      req['user'].sub,
    );
  }
  @Get('/detail')
  async getLoan(@Request() req, @Query('id') id: number): Promise<Loan> {
    // pagination
    return await this.loansService.findOne(
      id,
      UserRole[req['user'].role],
      req['user'].sub,
    );
  }
  @Post('/payPrincipal')
  async payPrincipal(
    @Request() req,
    @Query('repaymentAmount') repaymentAmount: number,
    @Body() loan: Loan,
  ): Promise<Repayment> {
    // "complete" unlimited loan
    if (UserRole[req['user'].role] != UserRole.SUPERADMIN) {
      return;
    }
    loan.isUnlimited = JSON.parse(`${loan.isUnlimited}`);
    repaymentAmount = JSON.parse(`${repaymentAmount}`);
    return await this.loansService.payPrincipal(loan, repaymentAmount);
  }
  @Post('/add')
  async addLoan(@Request() req, @Body() loan: Loan): Promise<Loan> {
    // add new loan
    if (UserRole[req['user'].role] != UserRole.SUPERADMIN) {
      return;
    }
    console.log(loan);
    loan.isUnlimited = JSON.parse(`${loan.isUnlimited}`);
    await this.loansService.addOne(loan);
    await this.repaymentService.generateLoanRepayments(loan);
    return loan;
  }
  @Post('/update')
  async updateLoan(@Request() req, @Body() loan: Loan): Promise<Loan> {
    // "complete" unlimited loan
    if (UserRole[req['user'].role] != UserRole.SUPERADMIN) {
      return;
    }
    loan.isUnlimited = JSON.parse(`${loan.isUnlimited}`);
    await this.loansService.updateOne(loan);
    return loan;
  }
  @Post('/finish')
  async finishLoan(@Request() req, @Body() loan: Loan): Promise<Loan> {
    // "complete" unlimited loan
    if (UserRole[req['user'].role] != UserRole.SUPERADMIN) {
      return;
    }
    await this.loansService.finishLoan(loan);
    return loan;
  }
  @Post('/delete')
  async deleteLoan(@Request() req, @Body() loan: Loan): Promise<Loan> {
    // "complete" unlimited loan
    if (UserRole[req['user'].role] != UserRole.SUPERADMIN) {
      return;
    }
    await this.loansService.deleteOne(loan);
    return loan;
  }

  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'icImagePath', maxCount: 1 },
        { name: 'homeAddressImagePath', maxCount: 1 },
        { name: 'officeLocationImagePath', maxCount: 1 },
        { name: 'waterUtilityBillImagePath', maxCount: 1 },
        { name: 'electricUtilityBillImagePath', maxCount: 1 },
        { name: 'salarySlipImagePath', maxCount: 1 },
        { name: 'hardcopyImagePath', maxCount: 1 },
        { name: 'hardcopyImagePath2', maxCount: 1 },
        { name: 'hardcopyImagePath3', maxCount: 1 },
        { name: 'hardcopyImagePath4', maxCount: 1 },
        { name: 'hardcopyImagePath5', maxCount: 1 },
        { name: 'hardcopyImagePath6', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/',
          filename: (req, file, cb) => {
            const extArray = file.mimetype.split('/');
            const extension = extArray[extArray.length - 1];
            fs.mkdirSync('./uploads/' + file.fieldname, { recursive: true });
            cb(
              null,
              file.fieldname +
                '/' +
                file.fieldname +
                '-' +
                Date.now() +
                '.' +
                extension,
            );
          },
        }),
      },
    ),
  )
  uploadFile(
    @UploadedFiles()
    files: {
      icImagePath?: Express.Multer.File[];
      homeAddressImagePath?: Express.Multer.File[];
      officeLocationImagePath?: Express.Multer.File[];
      waterUtilityBillImagePath?: Express.Multer.File[];
      electricUtilityBillImagePath?: Express.Multer.File[];
      salarySlipImagePath?: Express.Multer.File[];
      hardcopyImagePath: Express.Multer.File[];
      hardcopyImagePath2?: Express.Multer.File[];
      hardcopyImagePath3?: Express.Multer.File[];
      hardcopyImagePath4?: Express.Multer.File[];
      hardcopyImagePath5?: Express.Multer.File[];
      hardcopyImagePath6?: Express.Multer.File[];
    },
  ) {
    console.log(files);
    const response = [];
    Object.keys(files).forEach((key) => {
      files[key]?.forEach((file) => {
        const fileReponse = {
          fileType: key,
          filePath: file.filename,
        };
        response.push(fileReponse);
      });
    });
    return response;
  }

  // @Post('uploadsample')
  // @UseInterceptors(
  //   FilesInterceptor('files', 20, {
  //     storage: diskStorage({
  //       destination: './uploads/',
  //       filename: (req, file, cb) => {
  //         const extArray = file.mimetype.split('/');
  //         const extension = extArray[extArray.length - 1];
  //         cb(null, file.fieldname + '-' + Date.now() + '.' + extension);
  //       },
  //     }),
  //     //   fileFilter: imageFileFilter,
  //   }),
  // )
  // uploadMultipleFiles(@UploadedFiles() files) {
  //   const response = [];
  //   files.forEach((file) => {
  //     const fileReponse = {
  //       filename: file.filename,
  //     };
  //     response.push(fileReponse);
  //   });
  //   return response;
  // }

  @Get('file')
  @Public()
  getFile(
    @Res({ passthrough: true }) res: Response,
    @Query('filename') filename: string,
  ): StreamableFile | null {
    try {
      if (!filename) {
        return;
      }
      const file = createReadStream(join(process.cwd(), 'uploads/' + filename));
      res.set({
        'Content-Type': mime.lookup(filename),
        'Content-Disposition': `attachment; filename="${filename}"`,
      });
      console.log('readfile: ' + filename);

      return new StreamableFile(file);
    } catch (error) {
      console.log(error);
      return;
    }
  }

  // Or even:
  @Get('staticfile')
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="package.json"')
  getStaticFile(): StreamableFile {
    const file = createReadStream(join(process.cwd(), 'package.json'));
    return new StreamableFile(file);
  }
}
