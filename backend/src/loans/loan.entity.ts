/* eslint-disable @typescript-eslint/no-unused-vars */
import { Customer } from '..//customers/customer.entity';
import { Repayment } from '..//repayment/repayment.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
// import { Transform } from 'class-transformer';
export enum LoanRepaymentFrequency {
  NONE = 'NONE',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

@Entity()
export class Loan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  @Column()
  loanedAmount: number;
  @Column()
  loanApplicationDate: Date;
  @Column({
    type: 'enum',
    enum: LoanRepaymentFrequency,
    default: LoanRepaymentFrequency.NONE,
  })
  loanRepaymentFrequency: LoanRepaymentFrequency;

  @Column({ nullable: true })
  loanRepaymentTotalCount: number | null;
  @Column()
  loanSingleRepaymentAmount: number;
  @Column({ nullable: true })
  loanTotalPrincipal: number | null;
  @Column()
  isUnlimited: boolean;
  @Column({ nullable: true })
  hardcopyImagePath: string | null;
  @Column({ nullable: true })
  hardcopyImagePath2: string | null;
  @Column({ nullable: true })
  hardcopyImagePath3: string | null;
  @Column({ nullable: true })
  hardcopyImagePath4: string | null;
  @Column({ nullable: true })
  hardcopyImagePath5: string | null;
  @Column({ nullable: true })
  hardcopyImagePath6: string | null;

  @ManyToOne((type) => Customer, (customer) => customer.loans, {
    nullable: false,
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  customer: Customer;
  @ManyToOne((type) => User, (user) => user.loans, {
    nullable: false,
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  user: User;
  @OneToMany((type) => Repayment, (repayment) => repayment.loan, {
    nullable: false,
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  repayments: Repayment[];

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
