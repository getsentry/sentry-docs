/*
  Warnings:

  - Made the column `publishedAt` on table `Changelog` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Changelog" ALTER COLUMN "publishedAt" SET NOT NULL;
