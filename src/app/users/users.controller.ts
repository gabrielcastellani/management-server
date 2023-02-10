import { Controller, Get, Post, Put, Delete, Body, Param, ParseUUIDPipe, InternalServerErrorException, HttpStatus } from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user-dto';
import { UpdateUsersDTO } from './dtos/update-users-dto';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) { }

    @Get()
    async getAll() {
        try {
            return this.usersService.getAll();
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }

    @Post()
    async insert(@Body() createUserDTO: CreateUserDTO) {
        try {
            return await this.usersService.create(createUserDTO);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }

    @Put(':id')
    async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateUserDTO: UpdateUsersDTO) {
        try {
            return await this.usersService.update(id, updateUserDTO);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }

    @Delete(':id')
    async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
        try {
            return await this.usersService.delete(id);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }
}
