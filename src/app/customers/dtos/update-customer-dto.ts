import { IsNotEmpty } from "class-validator"

export class UpdateCustomerDTO {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    cnpj: string

    @IsNotEmpty()
    initials: string
}