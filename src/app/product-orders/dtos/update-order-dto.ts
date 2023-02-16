import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";
import { OrderPriority } from "./order-priority";

export class UpdateOrderDTO {
    @IsNotEmpty()
    priority: OrderPriority

    @IsNotEmpty()
    @IsNumber()
    order: number
}