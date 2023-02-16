import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";
import { OrderPriority } from "./order-priority";

export class CreateOrderDTO {
    @IsNotEmpty()
    priority: OrderPriority

    @IsNotEmpty()
    @IsNumber()
    order: number

    @IsNotEmpty()
    @IsUUID()
    idProduct: string;
}