/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Loan } from '../loans/loan.entity';

@Entity()
export class Repayment {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  repaymentAmount: number;
  @Column({ default: 0 })
  receivedAmount: number;
  @Column()
  @Index()
  targetRepaymentDate: Date;
  @Column({ nullable: true })
  @Index()
  extendedRepaymentDate: Date | null;
  @Column({ nullable: true, type: 'text' })
  extendedRepaymentDateHistory: string | null;
  @Column({ nullable: true, type: 'text' })
  repaymentAmountHistory: string | null;
  @Column({ nullable: true, type: 'text' })
  receivedAmountHistory: string | null;
  @Column()
  isUnlimitedRepayment: boolean;
  @Column()
  isPrincipalRepayment: boolean;
  @Column({ default: false })
  @Index()
  isPaid: boolean;

  @ManyToOne((type) => Loan, (loan) => loan.repayments, { nullable: false })
  loan: Loan;

  // typeorm will make sure this is populated
  @CreateDateColumn()
  createdDate: Date;
  // and this!
  @UpdateDateColumn()
  updatedDate: Date;
  // typeorm will use this to do soft deleting
  // be careful using soft-delete everywhere. sometimes you might want a deletion to really be a deletion
  @DeleteDateColumn()
  deletedDate: Date;
}
