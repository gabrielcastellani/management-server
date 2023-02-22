import { Controller, Get, Post, Put, Delete, Param, Body, ParseUUIDPipe, InternalServerErrorException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { AccessType } from '../users/dtos/access-types';
import { CreateExpenseDTO } from './dtos/create-expense-dto';
import { DeleteExpenseDTO } from './dtos/delete-expense-dto';
import { UpdateExpenseDTO } from './dtos/update-expense-dto';
import { ExpensesService } from './expenses.service';

@Controller('api/expenses')
@UseGuards(AuthGuard('jwt'))
export class ExpensesController {
    constructor(
        private readonly expensesService: ExpensesService
    ) { }

    @Get()
    async getAll() {
        try {
            return await this.expensesService.getAll();
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
            return await this.expensesService.getFirstOrDefault(id);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }

    @Post()
    @Roles(AccessType.Administrator)
    async create(@Body() createExpenseDTO: CreateExpenseDTO) {
        try {
            return await this.expensesService.create(createExpenseDTO);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }

    @Put(':id')
    @Roles(AccessType.Administrator)
    async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateExpenseDTO: UpdateExpenseDTO) {
        try {
            return await this.expensesService.update(id, updateExpenseDTO);
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
            return this.expensesService.delete(id);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }

    @Delete()
    @Roles(AccessType.Administrator)
    async deleteMany(@Body() deleteExpenseDTO: DeleteExpenseDTO) {
        try {
            return this.expensesService.deleteMany(deleteExpenseDTO.ids);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }
}
