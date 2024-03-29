import { Module } from '@nestjs/common'
import { PrismaModule } from './app/prisma/prisma.module';
import { UsersModule } from './app/users/users.module';
import { AuthModule } from './app/auth/auth.module';
import { CustomersModule } from './app/customers/customers.module';
import { EmployeesModule } from './app/employees/employees.module';
import { ExpensesModule } from './app/expenses/expenses.module';
import { PayrollsModule } from './app/payrolls/payrolls.module';
import { ProductsModule } from './app/products/products.module';
import { ProductOrdersModule } from './app/product-orders/product-orders.module';
import { GoalsModule } from './app/goals/goals.module';
import { DashboardModule } from './app/dashboard/dashboard.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, CustomersModule, EmployeesModule, ExpensesModule, PayrollsModule, ProductsModule, ProductOrdersModule, GoalsModule, DashboardModule],
})
export class AppModule {}
