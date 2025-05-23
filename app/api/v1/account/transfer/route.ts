
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest){
    const {amount, to} = await req.json()
    const userId = req.headers.get('x-user-id')

    try {
        
        const result = await prisma.$transaction(async (prisma) => {

            const sender = await prisma.account.findUnique({
                where: {
                    id: Number(userId)
                }
            })

            if(!sender || sender.balance < amount){
                throw new Error('Insufficent Balance')
            }

            const receiver = await prisma.account.findUnique({
                where: { userId: to},
            }) 

            if(!receiver){
                throw new Error('Receiver account not found')
            }
        })

        await prisma.account.update({
            where: {id: Number(userId)},
            data: {balance: {decrement: amount}}
        })

        await prisma.account.update({
            where: {userId: to},
            data: {balance: {increment: amount}}
        })

        // return {success: true}

        return NextResponse.json({msg: 'amount Transfer successful', showResult: result})
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}