import { Controller, Get, Post, Put, Delete, Param, Body, ParseUUIDPipe, InternalServerErrorException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { AccessType } from '../users/dtos/access-types';
import { ChangeStatusDTO } from './dtos/change-status-dto';
import { CreateProductDTO } from './dtos/create-product-dto';
import { DeleteProductDTO } from './dtos/delete-product-dto';
import { UpdateProductDTO } from './dtos/update-product-dto';
import { ProductsService } from './products.service';

@Controller('api/products')
@UseGuards(AuthGuard('jwt'))
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService
    ) { }

    @Get()
    async getAll() {
        try {
            return await this.productsService.getAll();
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
            return await this.productsService.getFirstOrDefault(id);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }

    @Get('customers/:idCustomer')
    @Roles(AccessType.Administrator)
    async getAllFromCustomer(@Param('idCustomer', new ParseUUIDPipe()) idCustomer: string) {
        try {
            return await this.productsService.getAllFromCustomer(idCustomer);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }

    @Post()
    @Roles(AccessType.Administrator)
    async create(@Body() createProductDTO: CreateProductDTO) {
        try {
         return this.productsService.create(createProductDTO);   
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }

    @Put(':id')
    @Roles(AccessType.Administrator)
    async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateProductDTO: UpdateProductDTO) {
        try {
         return this.productsService.update(id, updateProductDTO);   
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }

    @Put(':id/change-status')
    @Roles(AccessType.Administrator)
    async changeStatus(@Param('id', new ParseUUIDPipe()) id: string, @Body() changeStatusDTO: ChangeStatusDTO) {
        try {
            return await this.productsService.changeProductStatus(id, changeStatusDTO);
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
            return this.productsService.delete(id);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }

    @Delete()
    @Roles(AccessType.Administrator)
    async deleteMany(@Body() deleteProductDTO: DeleteProductDTO) {
        try {
            return this.productsService.deleteMany(deleteProductDTO.ids);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }
}
