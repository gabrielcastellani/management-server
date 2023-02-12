-- CreateTable
CREATE TABLE "Expenses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "value" DECIMAL NOT NULL,
    "date" DATETIME NOT NULL
);
