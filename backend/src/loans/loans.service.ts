import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Like, Repository } from 'typeorm';
import { Loan } from './loan.entity';
import { RepaymentsService } from '../repayment/repayments.service';
import { Repayment } from '../repayment/repayment.entity';
import { UserRole } from '../users/user.entity';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan)
    private loansRepository: Repository<Loan>,
    private readonly repaymentService: RepaymentsService,
  ) {}

  searchLoans(
    searchTerm: string,
    itemsPerPage: number,
    pageNumber: number,
    userRole: UserRole,
    userId: number,
  ): [Loan[], number] | PromiseLike<[Loan[], number]> {
    itemsPerPage = itemsPerPage || 10;
    const skip = pageNumber * itemsPerPage || 0;

    console.log(
      'searchLoan(): ',
      searchTerm,
      itemsPerPage,
      pageNumber,
      userRole,
      userId,
    );
    if (searchTerm.length) {
      // if (userRole != UserRole.SUPERADMIN) {
      //   return this.loansRepository.findAndCount({
      //     where: [
      //       {
      //         customer: { name: Like(`%${searchTerm}%`), user: { id: userId } },
      //       },
      //       { customer: { ic: Like(`%${searchTerm}%`) }, user: { id: userId } },
      //     ],
      //     order: { id: 'DESC' },
      //     take: itemsPerPage,
      //     skip: skip,
      //     relations: ['customer', 'user'],
      //   });
      // }
      return this.loansRepository.findAndCount({
        where: [
          { customer: { name: Like(`%${searchTerm}%`) } },
          { customer: { ic: Like(`%${searchTerm}%`) } },
        ],
        order: { id: 'DESC' },
        take: itemsPerPage,
        skip: skip,
        relations: ['customer', 'user'],
      });
    } else {
      // if (userRole != UserRole.SUPERADMIN) {
      //   return this.loansRepository.findAndCount({
      //     where: { user: { id: userId } },
      //     order: { id: 'DESC' },
      //     take: itemsPerPage,
      //     skip: skip,
      //     relations: ['customer', 'user'],
      //   });
      // }
      return this.loansRepository.findAndCount({
        where: [],
        order: { id: 'DESC' },
        take: itemsPerPage,
        skip: skip,
        relations: ['customer', 'user'],
      });
    }
  }
  async findAllDueLoan(
    startDate: Date,
    endDate: Date,
    itemsPerPage: number,
    pageNumber: number,
    userRole: UserRole,
    userId: number,
  ) {
    itemsPerPage = itemsPerPage || 10;
    const skip = pageNumber * itemsPerPage || 0;
    const loanIds = await this.loansRepository.findAndCount({
      where: {
        // ...(userRole != UserRole.SUPERADMIN && { user: { id: userId } }),
        repayments: [
          {
            isPaid: false,
            targetRepaymentDate: Between(startDate, endDate),
          },
          {
            isPaid: false,
            extendedRepaymentDate: Between(startDate, endDate),
          },
        ],
      },
      order: { id: 'DESC' },

      select: {
        id: true,
      },
    });
    console.log(loanIds);
    if (loanIds[0]) {
      return await this.loansRepository.findAndCount({
        where: { id: In(loanIds[0].map((x) => x.id)) },
        take: itemsPerPage,
        skip: skip,
        relations: ['customer', 'user', 'repayments'],
      });
    } else {
      return [[], 0] as [Loan[], number];
    }
  }
  async findAll(
    itemsPerPage: number,
    pageNumber: number,
    userRole: UserRole,
    userId: number,
  ): Promise<[Loan[], number]> {
    itemsPerPage = itemsPerPage || 10;
    const skip = pageNumber * itemsPerPage || 0;
    console.log('print paeg & skip', itemsPerPage, skip);
    // return this.loansRepository.findAndCount({
    //   // order: { name: 'DESC' },
    //   order: { id: 'DESC' },
    //   take: itemsPerPage,
    //   skip: skip,
    //   relations: ['customer'],
    // });

    let sql = this.loansRepository
      .createQueryBuilder('loan')
      .innerJoinAndSelect('loan.customer', 'customer')
      .innerJoinAndSelect('loan.user', 'user')
      .leftJoinAndSelect(
        'loan.repayments',
        'repayments',
        'repayments.isPaid=false',
      )

      // .leftJoinAndSelect(
      //   (subQuery) =>
      //     subQuery
      //       .from(Repayment, 'repayments')
      //       .select('repayments.loanId')
      //       .addSelect(
      //         'MIN(COALESCE(repayments.targetRepaymentDate, repayments.extendedRepaymentDate))',
      //         'targetRepaymentDate',
      //       )
      //       .where('repayments.isPaid = false')
      //       .groupBy('repayments.loanId'),
      //   'repayments',
      //   'repayments.loanId = loan.id',
      // )

      // .groupBy('loan.id')
      // .innerJoinAndSelect(
      //   (subQuery) =>
      //     subQuery
      //       .from(Repayment, 'repayment')
      //       .select('repayment.loanId')
      //       .addSelect(
      //         'MIN(COALESCE(repayment.targetRepaymentDate, repayment.extendedRepaymentDate))',
      //         'targetRepaymentDate',
      //       )
      //       .where('repayment.isPaid = false')
      //       .groupBy('repayment.loanId'),
      //   'repayments',
      //   'repayments.loanId = loan.id',
      // )

      .orderBy('loan.id', 'DESC')
      .take(itemsPerPage)
      .skip(skip);

    // if (userRole != UserRole.SUPERADMIN) {
    //   sql = sql.where('user.id=' + userId);
    // }
    // .addSelect(
    //   'MIN(COALESCE(repayments.targetRepaymentDate, repayments.extendedRepaymentDate)) as targetRepaymentDate',
    //   'targetRepaymentDate'
    // )
    // console.log(sql.getQuery());
    const results = await sql.getManyAndCount();
    console.log(results[0].length);
    results[0].forEach((element: Loan) => {
      element.repayments = [
        element.repayments.reduce((prev, current, _index): Repayment => {
          if (current.extendedRepaymentDate) {
            current.targetRepaymentDate = current.extendedRepaymentDate;
          }
          if (!prev || current.targetRepaymentDate < prev.targetRepaymentDate) {
            return current;
          } else {
            return prev;
          }
        }, undefined),
      ];
    });
    console.log(results[0].length);
    return results;
  }

  findAllLoansOfCustomer(
    customerid: number,
    userRole: UserRole,
    userId: number,
  ): Promise<Loan[]> {
    return this.loansRepository.find({
      where: {
        customer: {
          id: customerid,
          // ...(userRole != UserRole.SUPERADMIN && { user: { id: userId } }),
        },
      },
      order: { id: 'DESC' },
    });
  }
  findOne(
    id: number,
    userRole: UserRole,
    userId: number,
  ): Promise<Loan | null> {
    return this.loansRepository.findOne({
      where: {
        id,
        // ...(userRole != UserRole.SUPERADMIN && { user: { id: userId } }),
      },
      relations: ['customer', 'repayments'],
    });
  }
  payPrincipal(loan: Loan, repaymentAmount: number): Promise<Repayment> {
    return this.repaymentService.payPrincipal(loan, repaymentAmount);
  }
  updateOne(loan: Loan) {
    return this.loansRepository.update(loan.id, loan);
  }
  addOne(loan: Loan) {
    return this.loansRepository.insert(loan);
  }
  deleteOne(loan: Loan) {
    this.repaymentService.deleteLoanRepayments(loan.id);
    return this.loansRepository.softDelete(loan.id);
  }
  async finishLoan(loan: Loan) {
    await this.repaymentService.deleteLastRepayment(loan.id);
    return;
  }
}
