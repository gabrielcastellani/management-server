-- CreateTable
CREATE TABLE "Products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reference" TEXT NOT NULL,
    "of" TEXT NOT NULL,
    "description" TEXT,
    "quantity" DECIMAL NOT NULL,
    "unitaryValue" DECIMAL NOT NULL,
    "amount" DECIMAL NOT NULL,
    "status" INTEGER NOT NULL,
    "image" TEXT,
    "completionDate" DATETIME,
    "idCustomer" TEXT NOT NULL,
    CONSTRAINT "Products_idCustomer_fkey" FOREIGN KEY ("idCustomer") REFERENCES "Customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
