import { Injectable } from '@nestjs/common';
import { Users } from '@prisma/client';
import { hashPassword } from 'src/helpers/hashing-helper';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDTO } from './dtos/create-user-dto';
import { UpdateUsersDTO } from './dtos/update-users-dto';
import { ChangeUserPasswordDTO } from './dtos/change-user-password-dto';

export interface IUsersService {
    getAll(): Promise<any[]>
    getAllWithoutFilter(): Promise<any[]>
    getFirstOrDefaultByUsername(username: string): Promise<any>
    getFirstOrDefaultById(id: string): Promise<any>
    getFirstOrThrow(username: string): Promise<Users>
    create(createUserDTO: CreateUserDTO): Promise<any>
    changePassword(id: string, changeUserPasswordDTO: ChangeUserPasswordDTO): Promise<any>
    update(id: string, updateUserDTO: UpdateUsersDTO): Promise<any>
    delete(id: string): Promise<boolean>
    deleteRange(ids: string[]): Promise<boolean>
}

@Injectable()
export class UsersService implements IUsersService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async getAll(): Promise<any[]> {
        return await this.prismaService.users.findMany({
            select: {
                id: true,
                username: true,
                createdAt: true,
                updatedAt: true,
                accessType: true,
            }
        });
    }

    async getAllWithoutFilter(): Promise<any[]> {
        return await this.prismaService.users.findMany();
    }

    async getFirstOrDefaultByUsername(username: string): Promise<any> {
        return await this.prismaService.users.findFirst({
            where: { username: username },
            select: {
                id: true,
                username: true,
                createdAt: true,
                updatedAt: true,
                accessType: true,
            }
        });
    }

    async getFirstOrDefaultById(id: string): Promise<any> {
        return await this.prismaService.users.findFirst({
            where: { id: id },
            select: {
                id: true,
                username: true,
                createdAt: true,
                updatedAt: true,
                accessType: true,
            }
        });
    }

    async getFirstOrThrow(username: string): Promise<Users> {
        return await this.prismaService.users.findFirstOrThrow({
            where: { username }
        });
    }

    async create(createUserDTO: CreateUserDTO): Promise<any> {
        try {
            const savedUser = await this.getFirstOrDefaultByUsername(createUserDTO.username);

            if (savedUser) {
                throw new Error("Usuário ou senha incorretos.")
            }

            return await this.prismaService.users.create({
                data: {
                    username: createUserDTO.username,
                    password: hashPassword(createUserDTO.password),
                    accessType: createUserDTO.accessType,
                },
            });
        } catch (error) {
            throw new Error("Não foi possível criar o usuário.")
        }
    }

    async update(id: string, updateUserDTO: UpdateUsersDTO): Promise<any> {
        try {
            return await this.prismaService.users.update({
                where: { id: id },
                data: {
                    username: updateUserDTO.username,
                    accessType: updateUserDTO.accessType,
                    updatedAt: new Date(),
                },
            });
        } catch (error) {
            throw new Error("Não foi possível atualizar o usuário.")
        }
    }

    async changePassword(id: string, changeUserPasswordDTO: ChangeUserPasswordDTO): Promise<any> {
        try {
            return await this.prismaService.users.update({
                where: { id: id },
                data: {
                    password: hashPassword(changeUserPasswordDTO.password),
                },
            });
        } catch (error) {
            throw new Error("Não foi possível alterar a senha.");
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await this.prismaService.users.delete({
                where: { id: id }
            });
            return true;
        } catch (error) {
            throw new Error("Não foi possível excluir o usuário.");
        }
    }

    async deleteRange(ids: string[]): Promise<boolean> {
        try {
            await this.prismaService.users.deleteMany({
                where: { id: { in: ids } }
            });
            return true;
        } catch (error) {
            throw new Error("Não foi possível excluir os usuários selecionados.");
        }
    }
}
