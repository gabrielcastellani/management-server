import { IsNotEmpty, IsNumber, IsUUID } from "class-validator"

export class UpdateProductDTO {
    @IsNotEmpty()
    reference: string

    @IsNotEmpty()
    of: string

    description: string

    @IsNotEmpty()
    @IsNumber()
    quantity: number

    @IsNotEmpty()
    @IsNumber()
    unitaryValue: number

    image: string

    @IsNotEmpty()
    @IsUUID()
    idCustomer: string
}