-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PACKAGES" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE'
);
INSERT INTO "new_PACKAGES" ("description", "id") SELECT "description", "id" FROM "PACKAGES";
DROP TABLE "PACKAGES";
ALTER TABLE "new_PACKAGES" RENAME TO "PACKAGES";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
