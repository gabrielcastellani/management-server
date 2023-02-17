import { Injectable } from '@nestjs/common';
import { ProductOrders } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ChangeStatusDTO } from '../products/dtos/change-status-dto';
import { ProductStatus } from '../products/dtos/product-status';
import { ProductsService } from '../products/products.service';
import { CreateOrderDTO } from './dtos/create-order-dto';
import { FinishOrderDTO } from './dtos/finish-order-dto';
import { UpdateOrderDTO } from './dtos/update-order-dto';

export interface IProductOrdersService {
    getAll(): Promise<ProductOrders[]>
    getFirstOrDefault(id: string): Promise<ProductOrders>
    create(createOrderDTO: CreateOrderDTO): Promise<ProductOrders>
    update(id: string, updateOrderDTO: UpdateOrderDTO): Promise<ProductOrders>
    finisheOrder(id: string, finishOrderDTO: FinishOrderDTO): Promise<boolean>
    delete(id: string): Promise<boolean>
    deleteMany(ids: string): Promise<boolean>
}

@Injectable()
export class ProductOrdersService implements IProductOrdersService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly productsService: ProductsService,
    ) { }

    async getAll(): Promise<ProductOrders[]> {
        return await this.prismaService.productOrders.findMany();
    }

    async getFirstOrDefault(id: string): Promise<ProductOrders> {
        return await this.prismaService.productOrders.findFirst({
            where: { id }
        });
    }

    async create(createOrderDTO: CreateOrderDTO): Promise<ProductOrders> {
        const savedOrder = await this.getOrderFromProduct(createOrderDTO.idProduct);

        if (savedOrder) {
            throw new Error("Já existe uma ordem de produção para esse pedido.");
        }

        var changeStatusDTO = new ChangeStatusDTO();
        changeStatusDTO.status = ProductStatus.Progress;

        await this.productsService.changeProductStatus(createOrderDTO.idProduct, changeStatusDTO);

        return await this.prismaService.productOrders.create({
            data: {
                order: createOrderDTO.order,
                priority: createOrderDTO.priority,
                idProduct: createOrderDTO.idProduct,
            }
        });
    }

    async update(id: string, updateOrderDTO: UpdateOrderDTO): Promise<ProductOrders> {
        const savedOrder = await this.getFirstOrDefault(id);

        if (!savedOrder) {
            throw new Error("A ordem de produção informada não foi localizada.");
        }

        return await this.prismaService.productOrders.update({
            where: { id },
            data: {
                order: updateOrderDTO.order,
                priority: updateOrderDTO.priority,
                idProduct: savedOrder.idProduct,
            }
        });
    }

    async finisheOrder(id: string, finishOrderDTO: FinishOrderDTO): Promise<boolean> {
        const savedOrder = await this.getFirstOrDefault(id);

        if (!savedOrder) {
            throw new Error("A ordem de produção informada não foi localizada.");
        }

        await this.productsService.finishProduct(savedOrder.idProduct, finishOrderDTO.date);
        await this.prismaService.productOrders.delete({
            where: { id: savedOrder.id }
        });

        return true;
    }

    async delete(id: string): Promise<boolean> {
        const savedOrder = await this.getFirstOrDefault(id);
        var changeStatusDTO = new ChangeStatusDTO();
        changeStatusDTO.status = ProductStatus.Pending;

        await this.productsService.changeProductStatus(savedOrder.idProduct, changeStatusDTO);
        await this.prismaService.productOrders.delete({ where: { id } });

        return true;
    }

    async deleteMany(ids: string): Promise<boolean> {
        await this.prismaService.productOrders.deleteMany({
            where: { id: { in: ids } }
        });
        return true;
    }

    private async getOrderFromProduct(idProduct: string) {
        return await this.prismaService.productOrders.findFirst({
            where: { idProduct }
        });
    }
}
