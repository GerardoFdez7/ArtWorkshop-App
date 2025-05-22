-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(15),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Instructor" (
    "instructor_id" SERIAL NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "bio" TEXT,
    "email" VARCHAR(100),
    "phone" VARCHAR(15),

    CONSTRAINT "Instructor_pkey" PRIMARY KEY ("instructor_id")
);

-- CreateTable
CREATE TABLE "Workshop" (
    "workshop_id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "date" DATE NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "instructor_id" INTEGER,

    CONSTRAINT "Workshop_pkey" PRIMARY KEY ("workshop_id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "reservation_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "workshop_id" INTEGER NOT NULL,
    "reservation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ReservationStatus" NOT NULL,
    "attended" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("reservation_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Instructor_email_key" ON "Instructor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_user_workshop_reservation" ON "Reservation"("user_id", "workshop_id");

-- AddForeignKey
ALTER TABLE "Workshop" ADD CONSTRAINT "Workshop_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "Instructor"("instructor_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_workshop_id_fkey" FOREIGN KEY ("workshop_id") REFERENCES "Workshop"("workshop_id") ON DELETE CASCADE ON UPDATE CASCADE;
