ALTER TABLE `organizations` ADD `workspace_type` text DEFAULT 'personal' NOT NULL;--> statement-breakpoint
ALTER TABLE `organizations` ADD `subscription_plan` text DEFAULT 'starter' NOT NULL;