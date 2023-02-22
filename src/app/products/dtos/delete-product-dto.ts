import { IsNotEmpty } from "class-validator";

export class DeleteProductDTO {
    @IsNotEmpty()
    ids: string[];
}