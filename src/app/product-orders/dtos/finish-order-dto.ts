import { IsNotEmpty } from "class-validator";

export class FinishOrderDTO {
    @IsNotEmpty()
    date: Date
}