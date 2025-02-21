import { db } from '$lib/server/db';
import { usersTable } from '$lib/server/db/schema';

export async function load() {
	const users = await db.select().from(usersTable).orderBy(usersTable.id);
	return { users };
}