import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { usersTable } from '$lib/server/db/schema';

export const GET: RequestHandler = async () => {
    const users = await db.select().from(usersTable).orderBy(usersTable.id);
    return json({ users });
}

export const POST: RequestHandler = async ({ request }) => {
    const data = await request.formData();
    const name = data.get('name') as string;
    const age = parseInt(data.get('age') as string, 10);

    await db.insert(usersTable).values({
        name,
        age
    });

    return json({
        message: "Success to add new user"
    });
};

export const PATCH: RequestHandler = async ({ request }) => {
    const data = await request.formData();
    const id = parseInt(data.get('id') as string, 10);
    const name = data.get('name') ? data.get('name') as string : undefined;
    const age = data.get('age') ? parseInt(data.get('age') as string, 10) : undefined;
    const isDone = data.get('isDone') ? (data.get('isDone') as string == 'true' ? true : false) : undefined;

    await db.update(usersTable)
        .set({
            name,
            age,
            isDone
        })
        .where(eq(usersTable.id, id));

    return json({
        message: "Success to update user"
    });
};

export const DELETE: RequestHandler = async ({ request }) => {
    const data = await request.formData();
    const id = parseInt(data.get('id') as string, 10);

    await db.delete(usersTable).where(eq(usersTable.id, id));

    return json({
        message: "Success to delete user"
    });
};
