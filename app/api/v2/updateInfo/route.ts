import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const userId = req.headers.get('x-user-id');

    if (!userId || isNaN(Number(userId))) {
        return NextResponse.json({ msg: 'Invalid userId in headers' }, { status: 400 });
    }

    const { username, firstName, lastName } = await req.json();

    const db = await createConnection();

    const updateFields: string[] = [];
    const values: any[] = [];

    if (username) {
        updateFields.push(`username = ?`);
        values.push(username);
    }

    if (firstName) {
        updateFields.push(`firstName = ?`);
        values.push(firstName);
    }

    if (lastName) {
        updateFields.push(`lastName = ?`);
        values.push(lastName);
    }

    if (updateFields.length === 0) {
        return NextResponse.json({ msg: 'No fields to update' }, { status: 400 });
    }

    // Add userId as the last param for WHERE clause
    values.push(Number(userId));

    const query = `UPDATE User SET ${updateFields.join(', ')} WHERE id = ?`;

    try {
        const [result]: any = await db.execute(query, values);

        if (result.affectedRows === 0) {
            return NextResponse.json({ msg: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            msg: 'User information updated correctly'
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
