-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('INFO', 'WARNING', 'ERROR');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING_FOR_GENERATION', 'GENERATED', 'POSTED', 'FAILED');

-- CreateEnum
CREATE TYPE "HealthStatus" AS ENUM ('HEALTHY', 'WARNING', 'CRITICAL');

-- CreateEnum
CREATE TYPE "StatusReason" AS ENUM ('CANT_SEND_POSTS', 'CHANNEL_NOT_FOUND');

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "telegram_id" INTEGER NOT NULL,
    "config" JSONB NOT NULL DEFAULT '{}',
    "first_name" TEXT,
    "last_name" TEXT,
    "username" TEXT,
    "tg_api" TEXT,
    "role" "UserRoles" NOT NULL DEFAULT 'USER',
    "end_subscription" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "channel_name" TEXT,
    "channel_id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "config" JSONB NOT NULL DEFAULT '{}',
    "status" "HealthStatus" NOT NULL DEFAULT 'HEALTHY',
    "reason" "StatusReason",
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel_post" (
    "id" SERIAL NOT NULL,
    "channel_id" INTEGER NOT NULL,
    "text" TEXT,
    "photo" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING_FOR_GENERATION',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Channel_post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_telegram_id_key" ON "Users"("telegram_id");

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel_post" ADD CONSTRAINT "Channel_post_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
