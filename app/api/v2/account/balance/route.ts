import { createConnection } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const userId = req.headers.get("x-user-id");
        console.log("Received userId:", userId);

        if (!userId) {
            return NextResponse.json({ msg: "User ID is required" }, { status: 400 });
        }

        const db = await createConnection();

        const [rows] = await db.execute<RowDataPacket[]>(
            "SELECT * FROM Account WHERE userId = ?",
            [userId]
        );

        // Assuming only one account per userId
        const account = rows[0];

        if (!account) {
            return NextResponse.json({ msg: "Account not found" }, { status: 400 });
        }

        // Optionally close connection
        await db.end?.();

        return NextResponse.json({ balance: account.balance });
    } catch (error) {
        console.error("Error fetching account:", error);
        return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
    }
}
