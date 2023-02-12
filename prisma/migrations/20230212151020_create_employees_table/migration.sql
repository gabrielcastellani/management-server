-- CreateTable
CREATE TABLE "Employees" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "active" BOOLEAN NOT NULL
);
