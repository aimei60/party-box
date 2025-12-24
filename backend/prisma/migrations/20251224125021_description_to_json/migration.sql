/*
  Warnings:

  - Changed the type of `description` on the `products` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "short_description" TEXT,
DROP COLUMN "description",
ADD COLUMN     "description" JSONB NOT NULL;
