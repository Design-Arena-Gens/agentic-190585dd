-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Trend" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "source" TEXT NOT NULL,
    "category" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "region" TEXT NOT NULL DEFAULT 'US',
    "popularityScore" INTEGER NOT NULL DEFAULT 0,
    "url" TEXT,
    "keywords" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trendId" TEXT,
    "platform" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "caption" TEXT,
    "imageUrl" TEXT,
    "imagePrompt" TEXT,
    "tone" TEXT NOT NULL DEFAULT 'professional',
    "hashtags" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "scheduledFor" DATETIME,
    "publishedAt" DATETIME,
    "platformPostId" TEXT,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "engagement" REAL NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Post_trendId_fkey" FOREIGN KEY ("trendId") REFERENCES "Trend" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SocialAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "platform" TEXT NOT NULL,
    "username" TEXT,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "lastSyncedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Analytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalPosts" INTEGER NOT NULL DEFAULT 0,
    "totalLikes" INTEGER NOT NULL DEFAULT 0,
    "totalComments" INTEGER NOT NULL DEFAULT 0,
    "totalShares" INTEGER NOT NULL DEFAULT 0,
    "totalViews" INTEGER NOT NULL DEFAULT 0,
    "totalEngagement" REAL NOT NULL DEFAULT 0,
    "topPlatform" TEXT,
    "topTrend" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "autoPostEnabled" BOOLEAN NOT NULL DEFAULT false,
    "postIntervalHours" INTEGER NOT NULL DEFAULT 4,
    "defaultTone" TEXT NOT NULL DEFAULT 'professional',
    "defaultLanguage" TEXT NOT NULL DEFAULT 'en',
    "enabledPlatforms" TEXT NOT NULL,
    "trendSources" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "SocialAccount_platform_key" ON "SocialAccount"("platform");
