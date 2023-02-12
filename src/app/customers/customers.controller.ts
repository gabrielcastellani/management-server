import { Controller, Get, Post, Put, Delete, InternalServerErrorException, UseGuards, HttpStatus, Param, ParseUUIDPipe, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { AccessType } from '../users/dtos/access-types';
import { CustomersService } from './customers.service';
import { CreateCustomerDTO } from './dtos/create-customer-dto';
import { UpdateCustomerDTO } from './dtos/update-customer-dto';

@Controller('api/customers')
@UseGuards(AuthGuard('jwt'))
export class CustomersController {
    constructor(
        private readonly customersService: CustomersService
    ) { }

    @Get()
    async getAll() {
        try {
            return await this.customersService.getAll();
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }

    @Get(':id')
    async getFirst(@Param('id', new ParseUUIDPipe()) id: string) {
        try {
            return await this.customersService.getFirstOrDefaultById(id);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }

    @Post()
    @Roles(AccessType.Administrator)
    async create(@Body() createCustomerDTO: CreateCustomerDTO) {
        try {
            return await this.customersService.create(createCustomerDTO);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }

    @Put(':id')
    @Roles(AccessType.Administrator)
    async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateCustomerDTO: UpdateCustomerDTO) {
        try {
            return await this.customersService.update(id, updateCustomerDTO);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }

    @Delete(':id')
    @Roles(AccessType.Administrator)
    async destroy(@Param('id', new ParseUUIDPipe()) id: string): Promise<boolean> {
        try {
            return await this.customersService.delete(id);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }
}
