-- CreateTable
CREATE TABLE "ProductOrders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "priority" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "idProduct" TEXT NOT NULL,
    CONSTRAINT "ProductOrders_idProduct_fkey" FOREIGN KEY ("idProduct") REFERENCES "Products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
