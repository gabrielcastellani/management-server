-- CreateTable
CREATE TABLE "Goals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "currentQuantity" INTEGER NOT NULL DEFAULT 0,
    "expectedQuantity" INTEGER NOT NULL DEFAULT 0
);
