/* eslint-disable @typescript-eslint/no-unused-vars */
import { Loan } from '..//loans/loan.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';

export enum UserRole {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN2 = 'ADMIN2',
  ADMIN3 = 'ADMIN3',
  COLLECTOR = 'COLLECTOR',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ select: false })
  password: string;
  @Column()
  @Index({ unique: true })
  username: string;
  @Column({
    type: 'enum',
    enum: UserRole,
    nullable: false,
  })
  role: UserRole;
  @Column()
  @Index()
  name: string;
  @Column({ default: true })
  isStillWorking: boolean;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany((type) => Loan, (loan) => loan.user, {
    nullable: false,
    cascade: ['soft-remove'],
  })
  loans: Loan[];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany((type) => Customer, (customer) => customer.user, {
    nullable: false,
    cascade: ['soft-remove'],
  })
  customers: Customer[];
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
import { SetMetadata } from '@nestjs/common';
import { Customer } from '../customers/customer.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
