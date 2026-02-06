ALTER TYPE "public"."orderStatus" ADD VALUE 'PENDING' BEFORE 'ORDERED';--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "deliveryAddres" text;