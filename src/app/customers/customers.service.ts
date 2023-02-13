import { Injectable } from '@nestjs/common';
import { Customers } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDTO } from './dtos/create-customer-dto';
import { UpdateCustomerDTO } from './dtos/update-customer-dto';

export interface ICustomersService {
    getAll(): Promise<Customers[]>
    getFirstOrDefaultById(id: string): Promise<Customers>
    getFirstOrDefaultByCNPJ(cnpj: string): Promise<Customers>
    create(createCustomerDTO: CreateCustomerDTO): Promise<Customers>
    update(id: string, updateCustomerDTO: UpdateCustomerDTO): Promise<Customers>
    delete(id: string): Promise<boolean>
    deleteRange(ids: string[]): Promise<boolean>
}

@Injectable()
export class CustomersService implements ICustomersService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async getAll(): Promise<Customers[]> {
        return await this.prismaService.customers.findMany();
    }

    async getFirstOrDefaultById(id: string): Promise<Customers> {
        return await this.prismaService.customers.findFirst({
            where: { id: id }
        });
    }

    async getFirstOrDefaultByCNPJ(cnpj: string): Promise<Customers> {
        return await this.prismaService.customers.findFirst({
            where: { cnpj: cnpj }
        });
    }

    async create(createCustomerDTO: CreateCustomerDTO): Promise<Customers> {
        const savedCustomer = await this.getFirstOrDefaultByCNPJ(createCustomerDTO.cnpj);

        if (savedCustomer) {
            throw new Error("CNPJ já está em uso com outro cliente.");
        }

        return await this.prismaService.customers.create({
            data: {
                name: createCustomerDTO.name,
                cnpj: createCustomerDTO.cnpj,
                initials: createCustomerDTO.initials
            }
        });
    }

    async update(id: string, updateCustomerDTO: UpdateCustomerDTO): Promise<Customers> {
        const savedCustomer = await this.getFirstOrDefaultById(id);

        if (!savedCustomer)
            throw new Error("Cliente não foi localizado, tente um identificador válido.");

        const savedCustomerWithCNPJ = await this.getFirstOrDefaultByCNPJ(updateCustomerDTO.cnpj);
        
        if (savedCustomerWithCNPJ && savedCustomerWithCNPJ.id != id)
            throw new Error("CNPJ já está em uso com outro cliente.");

        return await this.prismaService.customers.update({
            where: { id: id },
            data: {
                name: updateCustomerDTO.name,
                cnpj: updateCustomerDTO.cnpj,
                initials: updateCustomerDTO.initials
            }
        });
    }

    async delete(id: string): Promise<boolean> {
        await this.prismaService.customers.delete({
            where: { id: id }
        });
        return true;
    }

    async deleteRange(ids: string[]): Promise<boolean> {
        await this.prismaService.customers.deleteMany({
            where: { id: { in: ids } }
        });
        return true;
    }
}
