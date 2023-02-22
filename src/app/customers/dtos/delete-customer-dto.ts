import { IsNotEmpty } from "class-validator";

export class DeleteCustomerDTO {
    @IsNotEmpty()
    ids: string[]
}