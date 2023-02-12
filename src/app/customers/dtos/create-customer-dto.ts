import { IsNotEmpty } from "class-validator"

export class CreateCustomerDTO {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    cnpj: string

    @IsNotEmpty()
    initials: string
}