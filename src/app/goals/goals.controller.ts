import { Controller, Get, Post, Put, Delete, Body, ParseUUIDPipe, InternalServerErrorException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { AccessType } from '../users/dtos/access-types';
import { UpdateGoalDTO } from './dtos/update-goal-dto';
import { GoalsService } from './goals.service';

@Controller('api/goals')
@UseGuards(AuthGuard('jwt'))
export class GoalsController {
    constructor(
        private readonly goalsService: GoalsService
    ) { }

    @Get()
    async getUnique() {
        try {
            return await this.goalsService.getUnique();
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }

    @Put('reset')
    @Roles(AccessType.Administrator)
    async reset() {
        try {
            return await this.goalsService.reset();
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }

    @Put()
    async update(@Body() updateGoalDTO: UpdateGoalDTO) {
        try {
            const goal = await this.goalsService.getUnique();

            return await this.goalsService.update(goal.id, updateGoalDTO);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }

    @Put('change/expected-quantity')
    @Roles(AccessType.Administrator)
    async changeExpectedQuantity(@Body() updateGoalDTO: UpdateGoalDTO) {
        try {
            return await this.goalsService.changeExpectedQuantity(updateGoalDTO.expectedQuantity);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }

    @Put('change/current-quantity')
    @Roles(AccessType.Administrator)
    async changeCurrentQuantity(@Body() updateGoalDTO: UpdateGoalDTO) {
        try {
            return await this.goalsService.incrementCurrentQuantity(updateGoalDTO.currentQuantity);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }
}
