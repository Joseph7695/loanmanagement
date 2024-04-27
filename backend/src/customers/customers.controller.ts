import { Body, Controller, Get, Post, Query, Request } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Customer } from './customer.entity';
import { UserRole } from '../users/user.entity';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('/')
  async getAllCustomers(
    @Query('itemsPerPage') itemsPerPage: number,
    @Query('pageNumber') pageNumber: number,
    @Request() req,
  ): Promise<[Customer[], number]> {
    // pagination
    console.log(UserRole[req['user']]);
    console.log({ pageNumber, itemsPerPage });
    return await this.customersService.findAll(
      itemsPerPage,
      pageNumber,
      UserRole[req['user'].role],
      req['user'].sub,
    );
  }
  @Get('/detail')
  async getCustomer(
    @Request() req,
    @Query('id') id: number,
  ): Promise<Customer> {
    // pagination
    return await this.customersService.findOne(
      id,
      UserRole[req['user'].role],
      req['user'].sub,
    );
  }
  @Get('/blacklist')
  async getAllBlacklistCustomers(
    @Request() req,
    @Query('itemsPerPage') itemsPerPage: number,
    @Query('pageNumber') pageNumber: number,
  ): Promise<[Customer[], number]> {
    // pagination
    return await this.customersService.findAllBlacklist(
      itemsPerPage,
      pageNumber,
      UserRole[req['user'].role],
      req['user'].sub,
    );
  }

  @Get('/noblacklist')
  async getAllNoBlacklistCustomers(
    @Request() req,
    @Query('itemsPerPage') itemsPerPage: number,
    @Query('pageNumber') pageNumber: number,
  ): Promise<[Customer[], number]> {
    // pagination
    return await this.customersService.findAllNoBlacklist(
      itemsPerPage,
      pageNumber,
      UserRole[req['user'].role],
      req['user'].sub,
    );
  }
  @Get('/searchCustomer')
  async searchCustomer(
    @Request() req,
    @Query('itemsPerPage') itemsPerPage: number,
    @Query('pageNumber') pageNumber: number,
    @Query('blackListMode') blackListMode: string,
    @Query('searchTerm') name: string,
  ): Promise<[Customer[], number]> {
    console.log(req['user']);
    return await this.customersService.searchCustomer(
      name,
      blackListMode,
      itemsPerPage,
      pageNumber,
      UserRole[req['user'].role],
      req['user'].sub,
    );
  }
  @Post('/add')
  async addCustomer(
    @Request() req,
    @Body() customer: Customer,
  ): Promise<Customer> {
    if (UserRole[req['user'].role] != UserRole.SUPERADMIN) {
      return;
    }
    await this.customersService.addOne(customer);
    return customer;
  }
  @Post('/update')
  async updateCustomer(
    @Request() req,
    @Body() customer: Customer,
  ): Promise<Customer> {
    if (UserRole[req['user'].role] != UserRole.SUPERADMIN) {
      return;
    }
    await this.customersService.updateOne(customer);
    return customer;
  }
  @Post('/delete')
  async deleteCustomer(
    @Request() req,
    @Body() customer: Customer,
  ): Promise<number> {
    if (UserRole[req['user'].role] != UserRole.SUPERADMIN) {
      return;
    }
    const deleteResult = await this.customersService.softdelete(customer.id);
    return deleteResult.affected;
  }
}
