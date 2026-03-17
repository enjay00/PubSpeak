CREATE TABLE `feedback` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pronunciation` text,
	`grammar` text,
	`pace` text,
	`speech_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`speech_id`) REFERENCES `speech`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `mispronounced` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`word` text NOT NULL,
	`url` text NOT NULL,
	`local_uri` text NOT NULL,
	`phonemes` text NOT NULL,
	`definition` text NOT NULL,
	`speech_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`speech_id`) REFERENCES `speech`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `speech` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`audio_uri` text NOT NULL,
	`transcribe` text NOT NULL,
	`summary` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `suggestions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`suggestion` text NOT NULL,
	`speech_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`speech_id`) REFERENCES `speech`(`id`) ON UPDATE no action ON DELETE no action
);
