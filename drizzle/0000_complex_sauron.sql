CREATE TABLE "chapter_notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"chapterId" varchar(100),
	"courseId" varchar(100),
	"notes" varchar(5000)
);
--> statement-breakpoint
CREATE TABLE "study_materials" (
	"courseId" varchar(100) PRIMARY KEY NOT NULL,
	"createdBy" varchar(256),
	"status" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"email" varchar(256) NOT NULL,
	"isMember" boolean DEFAULT false,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
