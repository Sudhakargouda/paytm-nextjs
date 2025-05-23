import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try {
            
        const userId = req.headers.get('x-user-id')

        if (!userId || isNaN(Number(userId))) {
            return NextResponse.json({ msg: 'Invalid userId in headers' }, { status: 400 })
        }

        const showBalance = await prisma.account.findFirst({
            where: {
                id: Number(userId)
            },
            select: {
                balance: true
            }
        })

        return NextResponse.json({Balance: showBalance}, {status: 201})
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}



