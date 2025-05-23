import { createConnection } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const userId = req.headers.get('x-user-id');

    if (!userId) {
        return NextResponse.json({ msg: 'User ID header missing' }, { status: 400 });
    }

    const db = await createConnection();

    try {
        const { amount, to } = await req.json();

        if (!amount || typeof amount !== 'number' || amount <= 0) {
            return NextResponse.json({ msg: 'Invalid amount' }, { status: 400 });
        }

        await db.beginTransaction();

        const [senderRows] = await db.execute<RowDataPacket[]>(
            'SELECT * FROM Account WHERE userId = ?',
            [userId]
        );
        const sender = senderRows[0];

        if (!sender || sender.balance < amount) {
            await db.rollback();
            return NextResponse.json({ msg: 'Insufficient Balance' }, { status: 400 });
        }

        const [receiverRows] = await db.execute<RowDataPacket[]>(
            'SELECT * FROM Account WHERE userId = ?',
            [to]
        );
        const receiver = receiverRows[0];

        if (!receiver) {
            await db.rollback();
            return NextResponse.json({ msg: 'Receiver not found' }, { status: 400 });
        }

        await db.execute(
            'UPDATE Account SET balance = balance - ? WHERE userId = ?',
            [amount, userId]
        );

        await db.execute(
            'UPDATE Account SET balance = balance + ? WHERE userId = ?',
            [amount, to]
        );

        await db.commit();

        return NextResponse.json({ msg: 'Amount transfer successful' });

    } catch (error) {
        console.error('Transfer error:', error);
        await db.rollback();
        return NextResponse.json({ msg: 'Transaction failed' }, { status: 500 });
    } finally {
        await db.end();
    }
}
