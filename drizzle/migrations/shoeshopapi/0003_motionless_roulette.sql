CREATE TYPE "public"."paymentStatus" AS ENUM('PENDING', 'FAILD', 'PAID');--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'PENDING';--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "paymentStatus" "paymentStatus" DEFAULT 'PENDING' NOT NULL;