import { NextRequest, NextResponse } from "next/server";
import zod from 'zod'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "@/config";
import bcrypt from 'bcrypt'
import { createConnection } from "@/lib/db";
import { RowDataPacket } from "mysql2";

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

export type FinalSigninSchema = zod.infer<typeof signinBody>

export async function POST(req: NextRequest){
    try {
        const parsed = signinBody.safeParse(await req.json())

        if(!parsed.success){
            return NextResponse.json({msg: 'data not parsed correctly'}, {status: 403})
        }

        const {username, password}: FinalSigninSchema = parsed.data 

        const db = await createConnection()

        const [rows] = await db.execute<RowDataPacket[]>('select * from User where username = ?', [username])

        const user = rows[0]

        if(!user){
            await db.end()
            return NextResponse.json({msg: 'user does not exist'}, {status: 400})
        }

        const matchPassword = await bcrypt.compare(password, user.password)

        if(!matchPassword){
            await db.end()
            return NextResponse.json({msg: 'the password do not match'}, {status: 403})
        }
        
        const token = jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn: '1h'})

        return NextResponse.json({
            token: token,
            msg: 'signin successful'
        })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}