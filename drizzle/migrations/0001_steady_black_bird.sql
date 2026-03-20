CREATE TABLE `extras` (
	`id` text PRIMARY KEY NOT NULL,
	`odo_start` integer NOT NULL,
	`odo_end` integer NOT NULL,
	`date` text NOT NULL,
	`time_start` text NOT NULL,
	`time_end` text NOT NULL,
	`route_type` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
