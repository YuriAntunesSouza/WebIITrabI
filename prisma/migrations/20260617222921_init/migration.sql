-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'comprador',
    "isActive" INTEGER NOT NULL DEFAULT 0,
    "isVerified" INTEGER NOT NULL DEFAULT 0,
    "verificationCode" TEXT,
    "verificationExpires" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Log" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER,
    "method" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "imageUrl" TEXT NOT NULL,
    "isPrimary" INTEGER NOT NULL DEFAULT 0,
    "productId" INTEGER NOT NULL,
    CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BuyerProfile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "BuyerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SellerProfile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "storeName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "categories" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "SellerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Comment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CommentLike" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "commentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "CommentLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CommentLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BuyerProfile_userId_key" ON "BuyerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SellerProfile_userId_key" ON "SellerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CommentLike_commentId_userId_key" ON "CommentLike"("commentId", "userId");
