import { AccessType } from "./access-types";

export class CreateUserDTO {
    username: string;
    password: string;
    accessType: AccessType;
}