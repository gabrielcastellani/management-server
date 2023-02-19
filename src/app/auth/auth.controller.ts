import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('login')
    @UseGuards(AuthGuard('local'))
    async login(@Req() req: any) {
        return await this.authService.login(req.user);
    }

    @Get('ping')
    @UseGuards(AuthGuard('jwt'))
    async ping() {
        return true;
    }
}
