import { Injectable } from '@nestjs/common';
import { Goals } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGoalDTO } from './dtos/create-goal-dto';
import { UpdateGoalDTO } from './dtos/update-goal-dto';

export interface IGoalsService {
    getUnique(): Promise<Goals>
    reset(): Promise<boolean>
    incrementCurrentQuantity(quantity: number): Promise<boolean>
    changeExpectedQuantity(quantity: number): Promise<boolean>
    create(createGoalDTO: CreateGoalDTO): Promise<Goals>
    update(id: string, updateGoalDTO: UpdateGoalDTO): Promise<Goals>
    delete(): Promise<boolean>
}

@Injectable()
export class GoalsService implements IGoalsService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async getUnique(): Promise<Goals> {
        return await this.prismaService.goals.findFirst()
    }

    async reset(): Promise<boolean> {
        const savedGoal = await this.create(new CreateGoalDTO(0, 0));
        const updateGoalDTO = new UpdateGoalDTO();
        updateGoalDTO.currentQuantity = 0;
        updateGoalDTO.expectedQuantity = 0;
        
        await this.update(savedGoal.id, updateGoalDTO);

        return true;
    }

    async incrementCurrentQuantity(quantity: number): Promise<boolean> {
        const savedGoal = await this.create(new CreateGoalDTO(0, 0));
        const updateGoalDTO = new UpdateGoalDTO();
        updateGoalDTO.currentQuantity = (savedGoal.currentQuantity + quantity);
        updateGoalDTO.expectedQuantity = savedGoal.expectedQuantity;
        
        await this.update(savedGoal.id, updateGoalDTO);

        return true;
    }

    async changeExpectedQuantity(quantity: number): Promise<boolean> {
        const savedGoal = await this.create(new CreateGoalDTO(0, 0));
        const updateGoalDTO = new UpdateGoalDTO();
        updateGoalDTO.currentQuantity = savedGoal.currentQuantity;
        updateGoalDTO.expectedQuantity = quantity;
        
        await this.update(savedGoal.id, updateGoalDTO);

        return true;
    }

    async create(createGoalDTO: CreateGoalDTO): Promise<Goals> {
        const savedGoal = await this.getUnique();

        if (savedGoal) {
            return savedGoal;
        }

        return await this.prismaService.goals.create({
            data: {
                currentQuantity: createGoalDTO.currentQuantity,
                expectedQuantity: createGoalDTO.expectedQuantity,
            }
        });
    }

    async update(id: string, updateGoalDTO: UpdateGoalDTO): Promise<Goals> {
        return await this.prismaService.goals.update({
            where: { id: id },
            data: {
                currentQuantity: updateGoalDTO.currentQuantity,
                expectedQuantity: updateGoalDTO.expectedQuantity,
            }
        });
    }

    async delete(): Promise<boolean> {
        const savedGoal = await this.getUnique();
        await this.prismaService.goals.delete({
            where: { id: savedGoal.id }
        });
        return true;
    }
}
