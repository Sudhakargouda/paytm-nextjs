import { NextResponse, NextRequest } from "next/server";
import {prisma} from '@/lib/prisma'
import zod from 'zod'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { JWT_SECRET } from "@/config";

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

export type FinalSigninSchema = zod.infer<typeof signinBody>

export async function POST(req:NextRequest){

    try {
            
        const parsed = signinBody.safeParse(await req.json())

        if(!parsed.success){
            return NextResponse.json({message: 'data not parsed correctly'}, {status: 400})
        }

        const {username, password}: FinalSigninSchema = parsed.data

        const user = await prisma.user.findUnique({
            where:{
                username
            }
        })

        if(!user){
            return NextResponse.json({msg: 'user is not there in database'}, {status: 401})
        }

        const matchPassword = await bcrypt.compare(password, user.password)

        if(!matchPassword){
            return NextResponse.json({msg: 'password does not match'}, {status: 401})
        }

        const token = jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn: '1h'})

        return NextResponse.json({
            msg: 'signin successful',
            token: token
        }, {status: 201})
    
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }    
}

    