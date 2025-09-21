CREATE TABLE "shoes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"brand" varchar(255) NOT NULL,
	"category" varchar(255) NOT NULL,
	"discription" text,
	"unitPrice" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"avator" varchar(255),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
