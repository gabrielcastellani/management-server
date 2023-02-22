import { Controller, Get, Post, Put, Delete, InternalServerErrorException, UseGuards, HttpStatus, Param, ParseUUIDPipe, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { AccessType } from '../users/dtos/access-types';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDTO } from './dtos/create-employee-dto';
import { UpdateEmployeeDTO } from './dtos/update-employee-dto';
import { DeleteEmployeeDTO } from './dtos/delete-employee-dto';

@Controller('api/employees')
@UseGuards(AuthGuard('jwt'))
export class EmployeesController {
    constructor(
        private readonly employeesService: EmployeesService
    ) { }

    @Get()
    async getAll() {
        try {
            return await this.employeesService.getAll();
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
            return await this.employeesService.getFirstOrDefaultById(id);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }

    @Post()
    @Roles(AccessType.Administrator)
    async create(@Body() createEmployeeDTO: CreateEmployeeDTO) {
        try {
            return await this.employeesService.create(createEmployeeDTO);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }

    @Put(':id')
    @Roles(AccessType.Administrator)
    async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateEmployeeDTO: UpdateEmployeeDTO) {
        try {
            return await this.employeesService.update(id, updateEmployeeDTO);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }

    @Delete(':id')
    @Roles(AccessType.Administrator)
    async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
        try {
            return await this.employeesService.delete(id);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }

    @Delete()
    @Roles(AccessType.Administrator)
    async destroyMany(@Body() deleteEmployeeDTO: DeleteEmployeeDTO) {
        try {
            return await this.employeesService.deleteMany(deleteEmployeeDTO.ids);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }
}
