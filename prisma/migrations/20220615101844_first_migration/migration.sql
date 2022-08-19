-- CreateTable
CREATE TABLE "Product_Inventory" (
    "id" SERIAL NOT NULL,
    "sold" BOOLEAN DEFAULT false,

    CONSTRAINT "Product_Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "category_id" INTEGER,
    "inventory_id" INTEGER,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product_Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer_Address" (
    "id" SERIAL NOT NULL,
    "address_line1" TEXT,
    "city" TEXT,
    "country" TEXT,
    "postal_code" TEXT,
    "customer_id" INTEGER,
    "address_line2" TEXT,

    CONSTRAINT "Customer_Address_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_Inventory_FK" FOREIGN KEY ("inventory_id") REFERENCES "Product_Inventory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_Category_FK" FOREIGN KEY ("category_id") REFERENCES "Product_Category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Customer_Address" ADD CONSTRAINT "Customer_ID_FK" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
