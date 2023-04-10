import { IsNotEmpty } from "class-validator";

export class ChangeUserPasswordDTO {
    @IsNotEmpty()
    password: string;
}