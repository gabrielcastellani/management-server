import { AccessType } from "./access-types";

export class UpdateUsersDTO {
    username: string;
    password: string;
    accessType: AccessType;
}