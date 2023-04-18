import { IsNotEmpty } from "class-validator"

export class DetailsDTO {
    @IsNotEmpty()
    startDate: Date

    @IsNotEmpty()
    endDate: Date
}