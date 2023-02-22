import { IsNotEmpty } from "class-validator";

export class DeleteEmployeeDTO {
    @IsNotEmpty()
    ids: string[];
}