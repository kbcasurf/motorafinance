import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const income = sqliteTable('income', {
  id: text('id').primaryKey(),
  amount: integer('amount').notNull(),
  platform: text('platform').notNull(),
  platformCustom: text('platform_custom'),
  odoStart: integer('odo_start'),
  odoEnd: integer('odo_end'),
  date: text('date').notNull(),
  time: text('time'), // deprecated: usar timeStart e timeEnd
  timeStart: text('time_start').notNull().default('00:00'),
  timeEnd: text('time_end').notNull().default('23:59'),
  routeType: text('route_type').notNull().default('urban'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const expenses = sqliteTable('expenses', {
  id: text('id').primaryKey(),
  amount: integer('amount').notNull(),
  category: text('category').notNull(),
  description: text('description'),
  odoReading: integer('odo_reading'),
  date: text('date').notNull(),
  fuelType: text('fuel_type'),
  fuelLiters: integer('fuel_liters'),
  fuelPricePerLiter: integer('fuel_price_per_liter'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const customCategories = sqliteTable('custom_categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
});

export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});

export const extras = sqliteTable('extras', {
  id: text('id').primaryKey(),
  odoStart: integer('odo_start').notNull(),
  odoEnd: integer('odo_end').notNull(),
  date: text('date').notNull(),
  timeStart: text('time_start').notNull(),
  timeEnd: text('time_end').notNull(),
  routeType: text('route_type').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});
