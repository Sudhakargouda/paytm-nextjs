import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket, ResultSetHeader } from 'mysql2'; 
import { createConnection } from "@/lib/db";
import zod from 'zod'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "@/config";

const signupBody = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
})

export type FinalSignupSchema = zod.infer<typeof signupBody>

export async function POST(req:NextRequest){
    try {
            
        const parsed = signupBody.safeParse(await req.json())

        if(!parsed.success){
            return NextResponse.json({msg: 'the data is not crt see'}, {status: 403})
        }

        const {username, password, firstName, lastName}: FinalSignupSchema = parsed.data
        
        const db = await createConnection()

        const [rows] = await db.execute<RowDataPacket[]>('SELECT * FROM User WHERE username = ?', [username]);

        if (rows.length > 0) {
        await db.end();
        return NextResponse.json({ msg: 'The user already exists' }, { status: 400 });
        }
        
        const hashPassword = await bcrypt.hash(password, 10)

        const [result] = await db.execute<ResultSetHeader>('INSERT INTO User(username, password, firstName, lastName) values(?, ?, ?, ?)', [username, hashPassword, firstName, lastName]) 

        const random = 1 + Math.floor(Math.random() * 1000)
        
        await db.execute('INSERT INTO Account(userId, balance) VALUES (?,?)',[result.insertId, random])


        await db.end();
        const userId = result.insertId;

        const token = jwt.sign({userId}, JWT_SECRET, {expiresIn: '1h'})

        return NextResponse.json({
            token: token,
            msg: 'signup successful'
        }, {status: 201})
    } catch (error) {
        console.error(error);
        return NextResponse.json({ msg: 'Internal server error' }, { status: 500 });
    }

}

// Why This Happens

// The method db.execute() in mysql2/promise returns a result with this type:

// [ResultSetHeader | RowDataPacket[], FieldPacket[]]

// SELECT queries return RowDataPacket[]

// INSERT/UPDATE/DELETE return ResultSetHeader (which contains insertId, affectedRows, etc.)
// TypeScript doesn't know which you're doing, so you have to cast it explicitly.