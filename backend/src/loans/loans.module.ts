import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { Loan } from './loan.entity';
import { RepaymentsModule } from '..//repayment/repayments.module';

@Module({
  imports: [TypeOrmModule.forFeature([Loan]), RepaymentsModule],
  providers: [LoansService],
  controllers: [LoansController],
})
export class LoansModule {}
