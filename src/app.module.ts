import { Module } from '@nestjs/common'
import { PrismaModule } from './app/prisma/prisma.module';
import { UsersModule } from './app/users/users.module';
import { AuthModule } from './app/auth/auth.module';
import { CustomersModule } from './app/customers/customers.module';
import { EmployeesModule } from './app/employees/employees.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, CustomersModule, EmployeesModule],
})
export class AppModule {}
