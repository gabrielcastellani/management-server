import { IsNotEmpty } from "class-validator";

export class DeleteExpenseDTO {
    @IsNotEmpty()
    ids: string[];
}