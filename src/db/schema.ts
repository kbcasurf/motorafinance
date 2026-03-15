import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const income = sqliteTable('income', {
  id: text('id').primaryKey(),
  amount: integer('amount').notNull(),
  platform: text('platform').notNull(),
  platformCustom: text('platform_custom'),
  odoStart: integer('odo_start'),
  odoEnd: integer('odo_end'),
  date: text('date').notNull(),
  time: text('time'),
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
