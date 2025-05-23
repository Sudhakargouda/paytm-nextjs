import { NextRequest, NextResponse } from "next/server"
import {prisma} from '@/lib/prisma'

type updateData = {
    username: string,
    firstName: string,
    lastName: string
}

export async function POST(req:NextRequest){
    try {

        const userId = req.headers.get('x-user-id')

        if (!userId || isNaN(Number(userId))) {
            return NextResponse.json({ msg: 'Invalid userId in headers' }, { status: 400 })
        }

        const {username, firstName, lastName}: updateData = await req.json()

        const updateUser = await prisma.user.update({where: {
            id: Number(userId)
            },
            data: {
                username,
                firstName,
                lastName
            }
        })
        
        return NextResponse.json({user: updateUser, msg: 'user update successfully'},{status: 201})

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}