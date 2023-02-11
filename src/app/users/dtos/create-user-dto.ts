import { IsNotEmpty } from "class-validator";
import { AccessType } from "./access-types";

export class CreateUserDTO {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    accessType: AccessType;
}