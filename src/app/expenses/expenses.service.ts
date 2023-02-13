import { Injectable } from '@nestjs/common';
import { Expenses } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDTO } from './dtos/create-expense-dto';
import { UpdateExpenseDTO } from './dtos/update-expense-dto';

export interface IExpensesService {
    getAll(): Promise<Expenses[]>
    getFirstOrDefault(id: string): Promise<Expenses>
    create(createExpenseDTO: CreateExpenseDTO): Promise<Expenses>
    update(id: string, updateExpenseDTO: UpdateExpenseDTO): Promise<Expenses>
    delete(id: string): Promise<boolean>
    deleteMany(ids: string[]): Promise<boolean>
}

@Injectable()
export class ExpensesService implements IExpensesService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async getAll(): Promise<Expenses[]> {
        return this.prismaService.expenses.findMany();
    }

    async getFirstOrDefault(id: string): Promise<Expenses> {
        return this.prismaService.expenses.findFirst({
            where: { id }
        });
    }

    async create(createExpenseDTO: CreateExpenseDTO): Promise<Expenses> {
        return await this.prismaService.expenses.create({
            data: {
                name: createExpenseDTO.name,
                description: createExpenseDTO.description,
                value: createExpenseDTO.value,
                date: createExpenseDTO.date,
            }
        });
    }

    async update(id: string, updateExpenseDTO: UpdateExpenseDTO): Promise<Expenses> {
        return await this.prismaService.expenses.update({
            where: { id },
            data: {
                name: updateExpenseDTO.name,
                description: updateExpenseDTO.description,
                value: updateExpenseDTO.value,
                date: updateExpenseDTO.date,
            }
        });
    }

    async delete(id: string): Promise<boolean> {
        await this.prismaService.expenses.delete({
            where: { id }
        });
        return true;
    }

    async deleteMany(ids: string[]): Promise<boolean> {
        await this.prismaService.expenses.deleteMany({
            where: { id: { in: ids }}
        });
        return true;
    }
}
