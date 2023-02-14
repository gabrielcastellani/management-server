import { IsDate, IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class UpdatePayrollDTO {
    @IsNotEmpty()
    @IsNumber()
    salary: number;

    @IsNotEmpty()
    @IsNumber()
    attendanceAward: number;

    @IsNotEmpty()
    @IsNumber()
    productionAward: number;

    @IsNotEmpty()
    @IsNumber()
    overtime: number;

    @IsNotEmpty()
    date: Date

    @IsNotEmpty()
    @IsUUID()
    idEmployee: string;
}