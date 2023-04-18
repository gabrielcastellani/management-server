import { Body, Controller, HttpStatus, InternalServerErrorException, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { DashboardService } from './dashboard.service';
import { AccessType } from '../users/dtos/access-types';

@Controller('api/dashboard')
@UseGuards(AuthGuard('jwt'))
export class DashboardController {
    constructor(
        private readonly dashboardService: DashboardService
    ) { }

    @Put()
    @Roles(AccessType.Administrator)
    async getDetails(@Body() detailsDTO) {
        try {
            return this.dashboardService.getDetails(detailsDTO);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }
}
