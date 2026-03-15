CREATE TABLE `custom_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `custom_categories_name_unique` ON `custom_categories` (`name`);--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` text PRIMARY KEY NOT NULL,
	`amount` integer NOT NULL,
	`category` text NOT NULL,
	`description` text,
	`odo_reading` integer,
	`date` text NOT NULL,
	`fuel_type` text,
	`fuel_liters` integer,
	`fuel_price_per_liter` integer,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `income` (
	`id` text PRIMARY KEY NOT NULL,
	`amount` integer NOT NULL,
	`platform` text NOT NULL,
	`platform_custom` text,
	`odo_start` integer,
	`odo_end` integer,
	`date` text NOT NULL,
	`time` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
