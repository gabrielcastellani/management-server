import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { passwordIsMatch } from 'src/helpers/hashing-helper';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async login(user) {
        const payload = { sub: user.id, username: user.username };

        return {
            token: this.jwtService.sign(payload),
            user: user,
        }
    }

    async validateUser(username: string, password: string) {
        try {
            const user = await this.userService.getFirstOrThrow(username);
            const isPasswordMatch = passwordIsMatch(password, user.password);

            if (!isPasswordMatch) {
                throw new Error('Usuário ou senha incorretos!');
            }
                
            return user;
        } catch (error) {
            return null;
        }
    }
}
