import { Injectable } from '@nestjs/common';
import { Customers, Products } from '@prisma/client';
import { CustomersService } from '../customers/customers.service';
import { PrismaService } from '../prisma/prisma.service';
import { ChangeStatusDTO } from './dtos/change-status-dto';
import { CreateProductDTO } from './dtos/create-product-dto';
import { ProductStatus } from './dtos/product-status';
import { UpdateProductDTO } from './dtos/update-product-dto';

export interface IProductsService {
    getAll(): Promise<Products[]>
    getFirstOrDefault(id: string): Promise<Products>
    getAllFromCustomer(idCustomer: string): Promise<Products[]>
    create(createProductDTO: CreateProductDTO): Promise<Products>
    update(id: string, updateProductDTO: UpdateProductDTO): Promise<Products>
    delete(id: string): Promise<boolean>
    deleteMany(ids: string[]): Promise<boolean>
    changeProductStatus(id: string, changeStatusDTO: ChangeStatusDTO): Promise<boolean>
    finishProduct(id: string, date: Date): Promise<boolean>
}

@Injectable()
export class ProductsService implements IProductsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly customersService: CustomersService
    ) { }

    async getAll(): Promise<Products[]> {
        return await this.prismaService.products.findMany();
    }

    async getFirstOrDefault(id: string): Promise<Products> {
        return await this.prismaService.products.findFirst({
            where: { id }
        });
    }

    async getAllFromCustomer(idCustomer: string): Promise<Products[]> {
        return await this.prismaService.products.findMany({
            where: { idCustomer }
        });
    }

    async create(createProductDTO: CreateProductDTO): Promise<Products> {
        const customer = await this.getCustomer(createProductDTO);

        if (!customer) {
            throw new Error("Cliente selecionado não foi encontrado.")
        }

        return await this.prismaService.products.create({
            data: {
                reference: createProductDTO.reference,
                of: createProductDTO.of,
                description: createProductDTO.description,
                quantity: createProductDTO.quantity,
                unitaryValue: createProductDTO.unitaryValue,
                amount: this.calcAmount(createProductDTO),
                status: ProductStatus.Pending,
                image: createProductDTO.image,
                idCustomer: createProductDTO.idCustomer,
            }
        });
    }

    async update(id: string, updateProductDTO: UpdateProductDTO): Promise<Products> {
        const customer = await this.getCustomer(updateProductDTO);

        if (!customer) {
            throw new Error("Cliente selecionado não foi encontrado.")
        }

        return await this.prismaService.products.update({
            where: { id },
            data: {
                reference: updateProductDTO.reference,
                of: updateProductDTO.of,
                description: updateProductDTO.description,
                quantity: updateProductDTO.quantity,
                unitaryValue: updateProductDTO.unitaryValue,
                amount: this.calcAmount(updateProductDTO),
                image: updateProductDTO.image,
                idCustomer: updateProductDTO.idCustomer,
            }
        });
    }

    async delete(id: string): Promise<boolean> {
        await this.prismaService.products.delete({
            where: { id }
        });
        return true;
    }

    async deleteMany(ids: string[]): Promise<boolean> {
        await this.prismaService.products.deleteMany({
            where: { id: { in: ids }}
        });
        return true;
    }

    async changeProductStatus(id: string, changeStatusDTO: ChangeStatusDTO): Promise<boolean> {
        const savedProduct = await this.getFirstOrDefault(id);

        if(!savedProduct) {
            throw new Error("Não foi possível localizar o produto informado.");
        }

        await this.prismaService.products.update({
            where: { id },
            data: {
                reference: savedProduct.reference,
                of: savedProduct.of,
                description: savedProduct.description,
                quantity: savedProduct.quantity,
                unitaryValue: savedProduct.unitaryValue,
                amount: savedProduct.amount,
                completionDate: savedProduct.completionDate,
                idCustomer: savedProduct.idCustomer,
                image: savedProduct.image,
                status: changeStatusDTO.status,
            },
        });

        return true;
    }

    async finishProduct(id: string, date: Date): Promise<boolean> {
        const savedProduct = await this.getFirstOrDefault(id);

        if(!savedProduct) {
            throw new Error("Não foi possível localizar o produto informado.");
        }

        await this.prismaService.products.update({
            where: { id },
            data: {
                reference: savedProduct.reference,
                of: savedProduct.of,
                description: savedProduct.description,
                quantity: savedProduct.quantity,
                unitaryValue: savedProduct.unitaryValue,
                amount: savedProduct.amount,
                completionDate: date,
                idCustomer: savedProduct.idCustomer,
                image: savedProduct.image,
                status: ProductStatus.Finished,
            },
        });

        return true;
    }

    private calcAmount(product: CreateProductDTO | UpdateProductDTO): number {
        return product.quantity * product.unitaryValue;
    }

    private async getCustomer(product: CreateProductDTO | UpdateProductDTO): Promise<Customers> {
        return await this.customersService.getFirstOrDefaultById(product.idCustomer);
    }
}
