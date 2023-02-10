import { hashSync, compareSync } from "bcrypt";

export function hashPassword(password: string): string {
    return hashSync(password, 10);
}

export function passwordIsMatch(password: string, hashPassword: string) : boolean {
    return compareSync(password, hashPassword);
}