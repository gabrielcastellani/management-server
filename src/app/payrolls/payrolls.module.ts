import { Module } from '@nestjs/common';
import { PayrollsService } from './payrolls.service';
import { PayrollsController } from './payrolls.controller';
import { EmployeesModule } from '../employees/employees.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [EmployeesModule, PrismaModule],
  providers: [PayrollsService],
  controllers: [PayrollsController],
  exports: [PayrollsService]
})
export class PayrollsModule {}
