import { Controller, Get, Post, Put, Delete, Param, Body, ParseUUIDPipe, InternalServerErrorException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { AccessType } from '../users/dtos/access-types';
import { CreatePayrollDTO } from './dtos/create-payroll-dto';
import { DeletePayrollDTO } from './dtos/delete-payroll-dto';
import { UpdatePayrollDTO } from './dtos/update-payroll-dto';
import { PayrollsService } from './payrolls.service';

@Controller('api/payrolls')
@UseGuards(AuthGuard('jwt'))
export class PayrollsController {
    constructor(
        private readonly payrollsService: PayrollsService
    ) { }

    @Get()
    async getAll() {
        try {
            return await this.payrollsService.getAll();
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
            return await this.payrollsService.getFirstOrDefault(id);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }

    @Post()
    @Roles(AccessType.Administrator)
    async create(@Body() createPayrollDTO: CreatePayrollDTO) {
        try {
            return await this.payrollsService.create(createPayrollDTO);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }

    @Put(':id')
    @Roles(AccessType.Administrator)
    async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updatePayrollDTO: UpdatePayrollDTO) {
        try {
            return await this.payrollsService.update(id, updatePayrollDTO);
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
            return this.payrollsService.delete(id);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }

    @Delete()
    @Roles(AccessType.Administrator)
    async deleteMany(@Body() deletePayrollDTO: DeletePayrollDTO) {
        try {
            return this.payrollsService.deleteMany(deletePayrollDTO.ids);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }
}
