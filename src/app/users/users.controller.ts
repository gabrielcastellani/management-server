import { Controller, Get, Post, Put, Delete, Body, Param, ParseUUIDPipe, InternalServerErrorException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { AccessType } from './dtos/access-types';
import { CreateUserDTO } from './dtos/create-user-dto';
import { UpdateUsersDTO } from './dtos/update-users-dto';
import { UsersService } from './users.service';

@Controller('api/users')
@UseGuards(AuthGuard('jwt'))
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

    @Get(':id')
    @Roles(AccessType.Administrator)
    async getFirst(@Param('id', new ParseUUIDPipe()) id: string) {
        try {
            return this.usersService.getFirstOrDefaultById(id);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }

    @Post()
    @Roles(AccessType.Administrator)
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
