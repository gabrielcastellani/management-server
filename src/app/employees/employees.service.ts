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
    deleteMany(ids: string[]): Promise<any>
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
        const payroll = await this.prismaService.payrolls.findFirst({
            where: { idEmployee: id }
        });

        if(payroll) {
            throw new Error("O funcionário está vinculado com uma folha de pagamento, a sua remoção não é permitida!");
        }

        await this.prismaService.employees.delete({
            where: { id: id }
        });

        return true;
    }

    async deleteMany(ids: string[]): Promise<any> {
        const idsWithError = [];

        for(const id in ids) {
            try {
                await this.delete(ids[id]);
            } catch(error) {
                idsWithError.push(ids[id]);
            }
        }
        
        return {
            success: idsWithError.length == 0,
            error: "Ação finalizada com erro, existe funcionários selecionados que possuem folha de pagamento e a sua remoção não é permitida!",
            idsWithError: idsWithError,
        };
    }
}
