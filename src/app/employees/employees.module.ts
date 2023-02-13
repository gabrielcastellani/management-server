import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [EmployeesService, PrismaService],
  controllers: [EmployeesController],
  exports: [EmployeesService]
})
export class EmployeesModule {}
