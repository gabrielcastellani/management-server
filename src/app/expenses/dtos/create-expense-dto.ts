import { IsDate, IsNotEmpty } from "class-validator"

export class CreateExpenseDTO {
    @IsNotEmpty()
    name: string
    description: string
    
    @IsNotEmpty()
    value: number

    @IsNotEmpty()
    @IsDate()
    date: Date
}