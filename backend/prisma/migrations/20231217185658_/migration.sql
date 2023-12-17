/*
  Warnings:

  - A unique constraint covering the columns `[channel_id]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tg_api]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `time` to the `Channel_post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Channel_post" ADD COLUMN     "time" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Channel_channel_id_key" ON "Channel"("channel_id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_tg_api_key" ON "Users"("tg_api");
