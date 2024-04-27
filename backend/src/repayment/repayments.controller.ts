import { Request, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RepaymentsService } from './repayments.service';
import { Repayment } from './repayment.entity';
import { UserRole } from '../users/user.entity';

@Controller('repayment')
export class RepaymentsController {
  constructor(private readonly repaymentService: RepaymentsService) {}

  // repayment done
  @Post('payment')
  async payRepayment(
    @Request() req,
    @Body() repayment: Repayment,
  ): Promise<number> {
    if (UserRole[req['user'].role] != UserRole.SUPERADMIN) {
      return;
    }
    if (repayment.isPaid) {
      return 0;
    }
    const result = await this.repaymentService.repay(repayment);
    return result.affected;
  }
  @Post('paymentsInList')
  async payRepaymentInList(
    @Request() req,
    @Body() repayments: Repayment[],
  ): Promise<Repayment[]> {
    if (UserRole[req['user'].role] != UserRole.SUPERADMIN) {
      return;
    }
    repayments = repayments.filter((x) => x.isPaid);
    const result = await this.repaymentService.repayInList(repayments);
    return result;
  }
  // repayment extend
  @Post('extend')
  async extendRepayment(
    @Request() req,
    @Body() repayment: Repayment,
  ): Promise<number> {
    if (UserRole[req['user'].role] != UserRole.SUPERADMIN) {
      return;
    }
    const result = await this.repaymentService.extend(repayment);
    return result.affected;
  }

  // get list of repayments for specific loan@Get('/repayment')
  @Get()
  async getLoanRepayments(
    @Request() req,
    @Query('loanId') loanId: number,
  ): Promise<Repayment[]> {
    return await this.repaymentService.findByLoanId(
      loanId,
      UserRole[req['user'].role],
      req['user'].sub,
    );
  }
}
