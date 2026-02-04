CREATE TABLE "menu_digitals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" double precision DEFAULT 0 NOT NULL,
	"category_id" uuid NOT NULL,
	"badges" text[] DEFAULT '{}' NOT NULL,
	"is_suggestio" boolean DEFAULT false NOT NULL,
	"is_custom_menu" boolean DEFAULT false NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "menu_digitals" ADD CONSTRAINT "menu_digitals_category_id_menu_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."menu_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menu_digitals" ADD CONSTRAINT "menu_digitals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;