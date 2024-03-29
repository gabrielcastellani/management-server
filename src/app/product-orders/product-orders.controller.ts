import { Controller, Get, Post, Put, Delete, Param, Body, ParseUUIDPipe, InternalServerErrorException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { AccessType } from '../users/dtos/access-types';
import { CreateOrderDTO } from './dtos/create-order-dto';
import { UpdateOrderDTO } from './dtos/update-order-dto';
import { FinishOrderDTO } from './dtos/finish-order-dto';
import { ProductOrdersService } from './product-orders.service';
import { CreateOrdersDTO } from './dtos/create-orders-dto';

@Controller('api/product-orders')
@UseGuards(AuthGuard('jwt'))
export class ProductOrdersController {
    constructor(
        private readonly productOrdersService: ProductOrdersService
    ) { }

    @Get()
    async getAll() {
        try {
            return await this.productOrdersService.getAll();
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }

    @Get(':id')
    async getFirstOrDefault(@Param('id', new ParseUUIDPipe()) id: string) {
        try {
            return await this.productOrdersService.getFirstOrDefault(id);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }

    @Post()
    @Roles(AccessType.Administrator)
    async create(@Body() createOrdersDTO: CreateOrdersDTO) {
        try {
            await this.productOrdersService.deleteAll();
            return await this.productOrdersService.createMany(createOrdersDTO);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }

    @Put(':id')
    @Roles(AccessType.Administrator)
    async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateOrderDTO: UpdateOrderDTO) {
        try {
            return await this.productOrdersService.update(id, updateOrderDTO);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }

    @Put(':id/finish')
    @Roles(AccessType.Administrator)
    async finish(@Param('id', new ParseUUIDPipe()) id: string, @Body() finishOrderDTO: FinishOrderDTO) {
        try {
            const success = await this.productOrdersService.finisheOrder(id, finishOrderDTO);

            return {
                success: success,
                productOrder: id,
            }
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }

    @Delete(':id')
    @Roles(AccessType.Administrator)
    async delete(@Param('id', new ParseUUIDPipe()) id: string) {
        try {
            return await this.productOrdersService.delete(id);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }
}