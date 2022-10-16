/*
  Warnings:

  - You are about to drop the column `acronym` on the `CITIES` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CITIES" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "stateId" INTEGER NOT NULL,
    CONSTRAINT "CITIES_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "STATES" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CITIES" ("id", "name", "stateId") SELECT "id", "name", "stateId" FROM "CITIES";
DROP TABLE "CITIES";
ALTER TABLE "new_CITIES" RENAME TO "CITIES";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
