import { pgTable, serial, varchar, integer, boolean } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }),
	age: integer('age'),
	isDone: boolean('isDone').default(false)
});
