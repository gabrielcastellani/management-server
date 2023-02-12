-- CreateTable
CREATE TABLE "Payrolls" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "salary" DECIMAL NOT NULL,
    "attendanceAward" DECIMAL NOT NULL,
    "productionAward" DECIMAL NOT NULL,
    "overtime" DECIMAL NOT NULL,
    "salaryToBePaid" DECIMAL NOT NULL,
    "date" DATETIME NOT NULL,
    "idEmployee" TEXT NOT NULL,
    CONSTRAINT "Payrolls_idEmployee_fkey" FOREIGN KEY ("idEmployee") REFERENCES "Employees" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
