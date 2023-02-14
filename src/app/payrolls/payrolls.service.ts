import { Injectable } from '@nestjs/common';
import { Payrolls } from '@prisma/client';
import { EmployeesService } from '../employees/employees.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePayrollDTO } from './dtos/create-payroll-dto';
import { UpdatePayrollDTO } from './dtos/update-payroll-dto';

export interface IPayrollsService {
    getAll(): Promise<Payrolls[]>
    getFirstOrDefault(id: string): Promise<Payrolls>
    create(createPayrollDTO: CreatePayrollDTO): Promise<Payrolls>
    update(id: string, updatePayrollDTO: UpdatePayrollDTO): Promise<Payrolls>
    delete(id: string): Promise<boolean>
    deleteMany(ids: string[]): Promise<boolean>
}

@Injectable()
export class PayrollsService implements IPayrollsService {
    employeeNotFound: string;
    employeeNotActive: string;
    createPayrollError: string;
    updatePayrollError: string;

    constructor(
        private readonly prismaService: PrismaService,
        private readonly employeesService: EmployeesService
    ) {
        this.employeeNotFound = "Funcionário selecionado não existe.";
        this.employeeNotActive = "Funcionário selecionado precisa estar ativo.";
        this.createPayrollError = "Não foi possível criar a folha de pagamento.";
        this.updatePayrollError = "Não foi possível atualizar a folha de pagamento.";
    }

    async getAll(): Promise<Payrolls[]> {
        return await this.prismaService.payrolls.findMany();
    }

    async getFirstOrDefault(id: string): Promise<Payrolls> {
        return await this.prismaService.payrolls.findFirst({
            where: { id }
        });
    }

    async create(createPayrollDTO: CreatePayrollDTO): Promise<Payrolls> {
        const employee = await this.employeesService.getFirstOrDefaultById(createPayrollDTO.idEmployee);

        if (!employee)
            throw new Error(`${this.createPayrollError} ${this.employeeNotFound}`);
        if (!employee?.active)
            throw new Error(`${this.createPayrollError} ${this.employeeNotActive}`);

        return await this.prismaService.payrolls.create({
            data: {
                salary: createPayrollDTO.salary,
                attendanceAward: createPayrollDTO.attendanceAward,
                productionAward: createPayrollDTO.productionAward,
                overtime: createPayrollDTO.overtime,
                date: createPayrollDTO.date,
                idEmployee: createPayrollDTO.idEmployee,
                salaryToBePaid: this.calcSalaryToBePaid(createPayrollDTO)
            }
        });
    }

    async update(id: string, updatePayrollDTO: UpdatePayrollDTO): Promise<Payrolls> {
        const employee = await this.employeesService.getFirstOrDefaultById(updatePayrollDTO.idEmployee);

        if (!employee)
            throw new Error(`${this.updatePayrollError} ${this.employeeNotFound}`);
        if (!employee?.active)
            throw new Error(`${this.updatePayrollError} ${this.employeeNotActive}`);

        return await this.prismaService.payrolls.update({
            where: { id },
            data: {
                salary: updatePayrollDTO.salary,
                attendanceAward: updatePayrollDTO.attendanceAward,
                productionAward: updatePayrollDTO.productionAward,
                overtime: updatePayrollDTO.overtime,
                date: updatePayrollDTO.date,
                idEmployee: updatePayrollDTO.idEmployee,
                salaryToBePaid: this.calcSalaryToBePaid(updatePayrollDTO)
            }
        });
    }

    async delete(id: string): Promise<boolean> {
        await this.prismaService.payrolls.delete({
            where: { id }
        });
        return true;
    }

    async deleteMany(ids: string[]): Promise<boolean> {
        await this.prismaService.payrolls.deleteMany({
            where: { id: { in: ids } }
        });
        return true;
    }

    private calcSalaryToBePaid(payroll: CreatePayrollDTO | UpdatePayrollDTO): number {
        return (payroll.salary + payroll.attendanceAward + payroll.productionAward);
    }
}
