/*
  Warnings:

  - You are about to alter the column `verificationExpires` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'comprador',
    "isActive" INTEGER NOT NULL DEFAULT 0,
    "isVerified" INTEGER NOT NULL DEFAULT 0,
    "verificationCode" TEXT,
    "verificationExpires" BIGINT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("createdAt", "email", "id", "isActive", "isVerified", "name", "password", "role", "verificationCode", "verificationExpires") SELECT "createdAt", "email", "id", "isActive", "isVerified", "name", "password", "role", "verificationCode", "verificationExpires" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
