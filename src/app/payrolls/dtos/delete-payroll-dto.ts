import { IsNotEmpty } from "class-validator";

export class DeletePayrollDTO {
    @IsNotEmpty()
    ids: string[];
}