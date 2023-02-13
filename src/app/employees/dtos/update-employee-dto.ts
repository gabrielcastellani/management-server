import { IsNotEmpty } from "class-validator"

export class UpdateEmployeeDTO {
    @IsNotEmpty()
    name: string
    
    @IsNotEmpty()
    cpf: string

    @IsNotEmpty()
    birthDate: Date
    active: boolean
}