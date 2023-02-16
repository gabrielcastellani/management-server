import { IsNotEmpty } from "class-validator";
import { ProductStatus } from "./product-status";

export class ChangeStatusDTO {
    @IsNotEmpty()
    status: ProductStatus
}