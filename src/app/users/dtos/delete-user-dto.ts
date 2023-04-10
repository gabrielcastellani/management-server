import { IsNotEmpty } from "class-validator";

export class DeleteUserDTO {
    @IsNotEmpty()
    ids: string[];
}