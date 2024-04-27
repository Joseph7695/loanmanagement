import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepaymentsService } from './repayments.service';
import { RepaymentsController } from './repayments.controller';
import { Repayment } from './repayment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Repayment])],
  providers: [RepaymentsService],
  controllers: [RepaymentsController],
  exports: [RepaymentsService],
})
export class RepaymentsModule {}
