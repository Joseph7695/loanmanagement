import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customers/customer.entity';
import { CustomersModule } from './customers/customers.module';
import { LoansModule } from './loans/loans.module';
import { RepaymentsModule } from './repayment/repayments.module';
import { Loan } from './loans/loan.entity';
import { Repayment } from './repayment/repayment.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';

@Module({
  imports: [
    CustomersModule,
    LoansModule,
    RepaymentsModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      // local db
      username: 'root',
      password: 'root_password',
      database: 'redactedclientname',

      // production db
      // username: 'redacted',
      // password: 'redacted',
      // database: 'redacted',
      entities: [Customer, Loan, Repayment, User],
      synchronize: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
