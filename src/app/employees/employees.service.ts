import { Injectable } from '@nestjs/common';
import { Employees } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDTO } from './dtos/create-employee-dto';
import { UpdateEmployeeDTO } from './dtos/update-employee-dto';

export interface IEmployeesService {
    getAll(): Promise<Employees[]>
    getFirstOrDefaultById(id: string): Promise<Employees>
    getFirstOrDefaultByCPF(cpf: string): Promise<Employees>
    create(createEmployeeDTO: CreateEmployeeDTO): Promise<Employees>
    update(id: string, updateEmployeeDTO: UpdateEmployeeDTO): Promise<Employees>
    delete(id: string): Promise<boolean>
    deleteMany(ids: string[]): Promise<boolean>
}

@Injectable()
export class EmployeesService implements IEmployeesService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async getAll(): Promise<Employees[]> {
        return await this.prismaService.employees.findMany();
    }

    async getFirstOrDefaultById(id: string): Promise<Employees> {
        return await this.prismaService.employees.findFirst({
            where: { id: id }
        });
    }

    async getFirstOrDefaultByCPF(cpf: string): Promise<Employees> {
        return await this.prismaService.employees.findFirst({
            where: { cpf: cpf }
        });
    }

    async create(createEmployeeDTO: CreateEmployeeDTO): Promise<Employees> {
        const savedEmployee = await this.getFirstOrDefaultByCPF(createEmployeeDTO.cpf);

        if (savedEmployee)
            throw new Error("O CPF informado já está em uso com outro funcionário.");

        return await this.prismaService.employees.create({
            data: {
                name: createEmployeeDTO.name,
                cpf: createEmployeeDTO.cpf,
                birthDate: createEmployeeDTO.birthDate,
                active: true,
            }
        });
    }

    async update(id: string, updateEmployeeDTO: UpdateEmployeeDTO): Promise<Employees> {
        const savedEmployee = await this.getFirstOrDefaultById(id);

        if (!savedEmployee) {
            throw new Error("Funcionário não foi localizado, tente um identificador válido.");
        }

        const savedEmployeeWithCPF = await this.getFirstOrDefaultByCPF(updateEmployeeDTO.cpf);

        if (savedEmployeeWithCPF && savedEmployeeWithCPF.id != id)
            throw new Error("O CPF informado já está em uso com outro funcionário.");

        return await this.prismaService.employees.update({
            where: { id: id },
            data: {
                name: updateEmployeeDTO.name,
                cpf: updateEmployeeDTO.cpf,
                birthDate: updateEmployeeDTO.birthDate,
                active: updateEmployeeDTO.active,
            }
        })
    }

    async delete(id: string): Promise<boolean> {
        await this.prismaService.employees.delete({
            where: { id: id }
        });
        return true;
    }

    async deleteMany(ids: string[]): Promise<boolean> {
        await this.prismaService.employees.deleteMany({
            where: { id: { in: ids } }
        });
        return true;
    }
}
