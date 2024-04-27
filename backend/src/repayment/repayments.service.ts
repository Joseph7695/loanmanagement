import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Repayment } from './repayment.entity';
import { Loan, LoanRepaymentFrequency } from '..//loans/loan.entity';
import { UserRole } from '../users/user.entity';

@Injectable()
export class RepaymentsService {
  deleteLoanRepayments(id: number) {
    this.repaymentRepository.softDelete({ loan: { id: id } });
  }
  constructor(
    @InjectRepository(Repayment)
    private repaymentRepository: Repository<Repayment>,
  ) {}

  findAll(): Promise<Repayment[]> {
    return this.repaymentRepository.find();
  }

  findOne(id: number): Promise<Repayment | null> {
    return this.repaymentRepository.findOneBy({ id });
  }
  findByLoanId(
    loanId: number,
    userRole: UserRole,
    userId: number,
  ): Promise<Repayment[]> {
    return this.repaymentRepository.findBy({
      loan: {
        id: loanId,
        ...(userRole != UserRole.SUPERADMIN && { user: { id: userId } }),
      },
    });
  }
  async extend(repayment: Repayment): Promise<UpdateResult> {
    const original = await this.repaymentRepository.findOneBy({
      id: repayment.id,
    });

    repayment.receivedAmountHistory = (
      original.receivedAmountHistory ? original.receivedAmountHistory : ''
    ).concat(',', original.receivedAmount.toString());

    repayment.repaymentAmountHistory = (
      original.repaymentAmountHistory ? original.repaymentAmountHistory : ''
    ).concat(',', original.repaymentAmount.toString());
    repayment.extendedRepaymentDateHistory = (
      original.extendedRepaymentDateHistory
        ? original.extendedRepaymentDateHistory
        : ''
    ).concat(',', original.extendedRepaymentDate?.toISOString());
    return this.repaymentRepository.update(repayment.id, repayment);
  }
  async payPrincipal(loan: Loan, repaymentAmount: number): Promise<Repayment> {
    const repayment: Repayment = {
      id: undefined,
      repaymentAmount: repaymentAmount,
      receivedAmount: repaymentAmount,
      targetRepaymentDate: new Date(),
      extendedRepaymentDate: undefined,
      extendedRepaymentDateHistory: '',
      isUnlimitedRepayment: loan.isUnlimited,
      isPaid: true,
      loan: loan,
      repaymentAmountHistory: '',
      receivedAmountHistory: '',
      createdDate: undefined,
      updatedDate: undefined,
      deletedDate: undefined,
      isPrincipalRepayment: true,
    };
    return await this.repaymentRepository.save(repayment);
  }
  async repay(repayment: Repayment): Promise<UpdateResult> {
    const original = await this.repaymentRepository.update(
      repayment.id,
      repayment,
    );
    console.log(repayment.isUnlimitedRepayment);
    if (repayment.isUnlimitedRepayment) {
      const nextRepayment = await this.repaymentRepository.findOne({
        select: {
          repaymentAmount: true,
          id: true,
          extendedRepaymentDate: false,
          extendedRepaymentDateHistory: false,
          isPaid: false,
          isUnlimitedRepayment: true,
          receivedAmount: false,
          receivedAmountHistory: false,
          repaymentAmountHistory: false,
          targetRepaymentDate: true,
        },
        where: { id: repayment.id },
        relations: ['loan'],
      });
      nextRepayment.targetRepaymentDate = new Date(
        new Date(repayment.targetRepaymentDate).valueOf() + 864e5 * 7,
      );
      nextRepayment.id = undefined;
      console.log(nextRepayment);
      await this.repaymentRepository.insert(nextRepayment);
    }
    return original;
  }
  async repayInList(repayments: Repayment[]): Promise<Repayment[]> {
    repayments = repayments.filter((x) => x); // remove null values
    const original = await this.repaymentRepository.save(repayments);
    repayments.forEach(async (repayment) => {
      if (repayment.isUnlimitedRepayment) {
        const nextRepayment = await this.repaymentRepository.findOne({
          select: {
            repaymentAmount: true,
            id: true,
            extendedRepaymentDate: false,
            extendedRepaymentDateHistory: false,
            isPaid: false,
            isUnlimitedRepayment: true,
            receivedAmount: false,
            receivedAmountHistory: false,
            repaymentAmountHistory: false,
            targetRepaymentDate: true,
            isPrincipalRepayment: true,
          },
          where: { id: repayment.id },
          relations: ['loan'],
        });
        nextRepayment.targetRepaymentDate = new Date(
          new Date(repayment.targetRepaymentDate).valueOf() + 864e5 * 7,
        );
        nextRepayment.id = undefined;
        console.log(nextRepayment);
        await this.repaymentRepository.insert(nextRepayment);
      }
    });

    return original;
  }

  // findAllTodayDueLoan(
  //   itemsPerPage: number,
  //   pageNumber: number,
  // ): Promise<[Repayment[], number]> {
  //   const endOfToday = new Date();
  //   const startOfToday = new Date();
  //   itemsPerPage = itemsPerPage || 10;
  //   const skip = pageNumber * itemsPerPage || 0;
  //   endOfToday.setHours(23, 59, 59, 999);
  //   startOfToday.setHours(0, 0, 0, 0);

  //   const sql = this.repaymentRepository
  //     .createQueryBuilder('repayment')
  //     .where(
  //       '(repayment.extendedRepaymentDate IS NULL AND repayment.targetRepaymentDate <= :end AND repayment.targetRepaymentDate >= :start)' +
  //         'OR (repayment.extendedRepaymentDate <= :end AND repayment.extendedRepaymentDate >= :start)',
  //       {
  //         end: endOfToday,
  //         start: startOfToday,
  //       },
  //     )
  //     .innerJoinAndSelect('repayment.loan', 'loan')
  //     .innerJoinAndSelect('loan.customer', 'customer')
  //     .innerJoinAndSelect('loan.user', 'user')
  //     .orderBy('repayment_id', 'DESC')
  //     .take(itemsPerPage)
  //     .skip(skip);
  //   // const sql = this.loansRepository
  //   //   .createQueryBuilder('loan')
  //   //   .innerJoinAndSelect(
  //   //     (subQuery) =>
  //   //       subQuery
  //   //         .from(Repayment, 'repayment')
  //   //         .select('repayment.loanId')
  //   //         .addSelect(
  //   //           'MIN(repayment.targetRepaymentDate)',
  //   //           'targetRepaymentDate',
  //   //         )
  //   //         .where('repayment.isPaid = false')
  //   //         .groupBy('repayment.loanId'),
  //   //     'repayment',
  //   //     'repayment.loanId = loan.id',
  //   //   )
  //   //   .where(
  //   //     'repayment.targetRepaymentDate <= :today AND repayment.targetRepaymentDate >= :tomorrow',
  //   //     {
  //   //       today,
  //   //       tomorrow,
  //   //     },
  //   //   );
  //   console.log(endOfToday, startOfToday, sql.getQuery());
  //   return sql.getManyAndCount();
  //   // return this.loansRepository
  //   //   .createQueryBuilder('loan')
  //   //   .innerJoinAndSelect('loan.repayments', 'repayment')
  //   //   .where(
  //   //     'repayment.targetRepaymentDate <= :today OR repayment.targetRepaymentDate >= :tomorrow',
  //   //     {
  //   //       today,
  //   //       tomorrow,
  //   //     },
  //   //   )
  //   //   .getMany();
  // }
  // findAllTomorrowDueLoan(
  //   itemsPerPage: number,
  //   pageNumber: number,
  // ): Promise<[Repayment[], number]> {
  //   const endOfTomorrow = new Date(
  //     new Date().setDate(new Date().getDate() + 1),
  //   );
  //   const startOfTomorrow = new Date(
  //     new Date().setDate(new Date().getDate() + 1),
  //   );
  //   itemsPerPage = itemsPerPage || 10;
  //   const skip = pageNumber * itemsPerPage || 0;
  //   endOfTomorrow.setHours(23, 59, 59, 999);
  //   startOfTomorrow.setHours(0, 0, 0, 0);

  //   const sql = this.repaymentRepository
  //     .createQueryBuilder('repayment')
  //     .where(
  //       '(repayment.extendedRepaymentDate IS NULL AND repayment.targetRepaymentDate <= :end AND repayment.targetRepaymentDate >= :start)' +
  //         'OR (repayment.extendedRepaymentDate <= :end AND repayment.extendedRepaymentDate >= :start)',
  //       {
  //         end: endOfTomorrow,
  //         start: startOfTomorrow,
  //       },
  //     )
  //     .innerJoinAndSelect('repayment.loan', 'loan')
  //     .innerJoinAndSelect('loan.customer', 'customer')
  //     .innerJoinAndSelect('loan.user', 'user')
  //     .orderBy('repayment_id', 'DESC')
  //     .take(itemsPerPage)
  //     .skip(skip);
  //   // const sql = this.loansRepository
  //   //   .createQueryBuilder('loan')
  //   //   .innerJoinAndSelect(
  //   //     (subQuery) =>
  //   //       subQuery
  //   //         .from(Repayment, 'repayment')
  //   //         .select('repayment.loanId')
  //   //         .addSelect(
  //   //           'MIN(repayment.targetRepaymentDate)',
  //   //           'targetRepaymentDate',
  //   //         )
  //   //         .where('repayment.isPaid = false')
  //   //         .groupBy('repayment.loanId'),
  //   //     'repayment',
  //   //     'repayment.loanId = loan.id',
  //   //   )
  //   //   .where(
  //   //     'repayment.targetRepaymentDate <= :today AND repayment.targetRepaymentDate >= :tomorrow',
  //   //     {
  //   //       today,
  //   //       tomorrow,
  //   //     },
  //   //   );
  //   console.log(endOfTomorrow, startOfTomorrow, sql.getQuery());
  //   return sql.getManyAndCount();
  //   // return this.loansRepository
  //   //   .createQueryBuilder('loan')
  //   //   .innerJoinAndSelect('loan.repayments', 'repayment')
  //   //   .where(
  //   //     'repayment.targetRepaymentDate <= :today OR repayment.targetRepaymentDate >= :tomorrow',
  //   //     {
  //   //       today,
  //   //       tomorrow,
  //   //     },
  //   //   )
  //   //   .getMany();
  // }
  async deleteLastRepayment(loanId: number) {
    console.log('Finishing loan: ', loanId);
    const repayment = await this.repaymentRepository.findOne({
      where: {
        isPaid: false,
        loan: { id: loanId },
      },
      order: { id: 'DESC' },
    });
    console.log('last repayment', repayment);
    if (repayment) {
      await this.repaymentRepository.remove(repayment);
    }
  }
  generateLoanRepayments(loan: Loan) {
    const repayments = [];
    let targetRepaymentDate = new Date(loan.loanApplicationDate);
    let repaymentCounts = loan.loanRepaymentTotalCount;
    console.log(
      typeof loan.isUnlimited,
      loan.loanRepaymentTotalCount,
      loan.isUnlimited,
      loan.isUnlimited == true,
      loan.isUnlimited === true,
      // loan.isUnlimited == 'true',
    );
    if (loan.isUnlimited) {
      repaymentCounts = 1;
    }
    // if (loan.isUnlimited == 'true') {
    //   repaymentCounts = 1;
    // }
    for (let index = 0; index < repaymentCounts; index++) {
      console.log('creating repayment:', index, repaymentCounts);
      switch (loan.loanRepaymentFrequency) {
        case LoanRepaymentFrequency.WEEKLY:
          targetRepaymentDate = new Date(
            targetRepaymentDate.valueOf() + 864e5 * 7,
          );
          break;
        case LoanRepaymentFrequency.MONTHLY:
          targetRepaymentDate = new Date(
            targetRepaymentDate.setMonth(targetRepaymentDate.getMonth() + 1),
          );
          break;
        case LoanRepaymentFrequency.NONE:
        default:
          throw new Error('unknown loan repayment frequency');
      }

      const repayment: Repayment = {
        id: undefined,
        repaymentAmount: loan.loanSingleRepaymentAmount,
        receivedAmount: 0,
        targetRepaymentDate: new Date(targetRepaymentDate),
        extendedRepaymentDate: undefined,
        extendedRepaymentDateHistory: '',
        isUnlimitedRepayment: loan.isUnlimited,
        isPaid: false,
        loan: loan,
        repaymentAmountHistory: '',
        receivedAmountHistory: '',
        createdDate: undefined,
        updatedDate: undefined,
        deletedDate: undefined,
        isPrincipalRepayment: false,
      };
      console.log(repayment);

      repayments.push(repayment);
    }
    return this.repaymentRepository.save(repayments);
  }
}
