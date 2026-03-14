/*
  Warnings:

  - You are about to drop the column `maxMarks` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `method` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `paidAt` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `weekday` on the `Timetable` table. All the data in the column will be lost.
  - Added the required column `duration` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalMarks` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Fee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `feeType` to the `Fee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseId` to the `Timetable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dayOfWeek` to the `Timetable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instructor` to the `Timetable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `room` to the `Timetable` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."FeeType" AS ENUM ('TUITION', 'EXAM', 'LIBRARY', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('CASH', 'CARD', 'BANK_TRANSFER', 'ONLINE');

-- AlterTable
ALTER TABLE "public"."Exam" DROP COLUMN "maxMarks",
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "totalMarks" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Fee" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "feeType" "public"."FeeType" NOT NULL,
ADD COLUMN     "paidAmount" INTEGER DEFAULT 0,
ADD COLUMN     "paidDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."Grade" ADD COLUMN     "remarks" TEXT;

-- AlterTable
ALTER TABLE "public"."Payment" DROP COLUMN "method",
DROP COLUMN "paidAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "paymentMethod" "public"."PaymentMethod" NOT NULL,
ADD COLUMN     "reference" TEXT,
ADD COLUMN     "remarks" TEXT,
ADD COLUMN     "studentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Timetable" DROP COLUMN "weekday",
ADD COLUMN     "courseId" TEXT NOT NULL,
ADD COLUMN     "dayOfWeek" TEXT NOT NULL,
ADD COLUMN     "instructor" TEXT NOT NULL,
ADD COLUMN     "room" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Timetable" ADD CONSTRAINT "Timetable_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
