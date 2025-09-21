CREATE TYPE "public"."orderStatus" AS ENUM('ORDERED', 'SHIPPED', 'DELIVERED');--> statement-breakpoint
CREATE TYPE "public"."userRole" AS ENUM('ADMIN', 'CUSTOMER');--> statement-breakpoint
CREATE TABLE "orderItems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"orderId" uuid NOT NULL,
	"shoesId" uuid NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"orderDate" date NOT NULL,
	"userId" uuid NOT NULL,
	"status" "orderStatus" DEFAULT 'ORDERED',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"birthDate" date NOT NULL,
	"photos" text[],
	"userId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shoes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand" varchar(255) NOT NULL,
	"category" varchar(255) NOT NULL,
	"discription" text,
	"quantity" integer NOT NULL,
	"soldout" integer DEFAULT 0 NOT NULL,
	"unitPrice" numeric NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"avator" varchar(255),
	"userRole" "userRole" DEFAULT 'CUSTOMER',
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_shoesId_shoes_id_fk" FOREIGN KEY ("shoesId") REFERENCES "public"."shoes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;