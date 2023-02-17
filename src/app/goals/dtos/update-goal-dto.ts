import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateGoalDTO {
    @IsNotEmpty()
    @IsNumber()
    currentQuantity: number

    @IsNotEmpty()
    @IsNumber()
    expectedQuantity: number
}