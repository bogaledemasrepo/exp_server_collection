ALTER TABLE "orders" ADD COLUMN "orderDate" date NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "birthDate";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "photos";