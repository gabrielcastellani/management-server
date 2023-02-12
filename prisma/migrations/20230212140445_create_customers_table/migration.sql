/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Customers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "initials" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Customers_cnpj_key" ON "Customers"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");
