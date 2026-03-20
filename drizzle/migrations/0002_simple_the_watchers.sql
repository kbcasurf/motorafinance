ALTER TABLE `income` ADD `time_start` text DEFAULT '00:00' NOT NULL;--> statement-breakpoint
ALTER TABLE `income` ADD `time_end` text DEFAULT '23:59' NOT NULL;--> statement-breakpoint
ALTER TABLE `income` ADD `route_type` text DEFAULT 'urban' NOT NULL;