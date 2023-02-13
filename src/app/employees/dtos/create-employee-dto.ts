import { IsNotEmpty } from "class-validator"

export class CreateEmployeeDTO {
    @IsNotEmpty()
    name: string
    
    @IsNotEmpty()
    cpf: string

    @IsNotEmpty()
    birthDate: Date
}