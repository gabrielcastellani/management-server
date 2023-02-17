import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateGoalDTO {
    @IsNotEmpty()
    @IsNumber()
    currentQuantity: number

    @IsNotEmpty()
    @IsNumber()
    expectedQuantity: number

    constructor(currentQuantity: number, expectedQuantity: number) {
        this.currentQuantity = currentQuantity;
        this.expectedQuantity = expectedQuantity;
    }
}