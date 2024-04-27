import { Loan } from '..//loans/loan.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Index,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  name: string;

  @Column()
  ic: string;
  @Column()
  icImagePath: string;
  @Column({ nullable: true })
  homeAddressImagePath: string | null;
  @Column()
  homeAddressGoogleMapsUrl: string;
  @Column()
  phoneNumber: string;
  @Column()
  occupation: string;
  @Column()
  companyName: string;
  @Column({ nullable: true })
  officeLocationImagePath: string | null;
  @Column({ nullable: true })
  officeLocationGoogleMapsUrl: string | null;
  @Column()
  salary: number;
  @Column()
  carPlateNumber: string;
  @Column({ nullable: true })
  emergencyContactName: string | null;
  @Column({ nullable: true })
  emergencyContactNumber: string | null;
  @Column({ nullable: true })
  emergencyContactName2: string | null;
  @Column({ nullable: true })
  emergencyContactNumber2: string | null;
  @Column({ nullable: true })
  emergencyContactName3: string | null;
  @Column({ nullable: true })
  emergencyContactNumber3: string | null;
  @Column({ nullable: true })
  emergencyContactName4: string | null;
  @Column({ nullable: true })
  emergencyContactNumber4: string | null;
  @Column({ nullable: true })
  emergencyContactName5: string | null;
  @Column({ nullable: true })
  emergencyContactNumber5: string | null;
  @Column({ nullable: true })
  waterUtilityBillImagePath: string | null;
  @Column({ nullable: true })
  electricUtilityBillImagePath: string | null;
  @Column({ nullable: true })
  salarySlipImagePath: string | null;

  @Column({ default: false })
  isBlacklist: boolean;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany((type) => Loan, (loan) => loan.customer, {
    cascade: ['soft-remove'],
  })
  loans: Loan[];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne((type) => User, (user) => user.loans, {
    nullable: false,
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  user: User;
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
