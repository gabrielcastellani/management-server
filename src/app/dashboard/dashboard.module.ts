import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ExpensesModule } from '../expenses/expenses.module';
import { PayrollsModule } from '../payrolls/payrolls.module';
import { ProductsModule } from '../products/products.module';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [PrismaModule, ExpensesModule, PayrollsModule, ProductsModule, CustomersModule],
  exports: [DashboardService],
  providers: [DashboardService],
  controllers: [DashboardController]
})
export class DashboardModule {}
