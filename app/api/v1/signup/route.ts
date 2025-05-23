
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import zod from 'zod'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '@/config';

const signupBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string()
})
export type FinalSchemaSignupBody = zod.infer<typeof signupBody>

export async function POST(req: NextRequest) {

  try {
    
    const parsed = signupBody.safeParse(await req.json())

    if(!parsed.success){
      return NextResponse.json({error: 'data not parsed'}, {status: 400})
    }

    const { username, password, firstName, lastName }: FinalSchemaSignupBody = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        firstName,
        lastName
      },
    });

    const random = 1 + Math.floor(Math.random() * 1000)

    await prisma.account.create({
      data:{
        balance: random,
        userId: user.id
      }
    })

    const token = jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn: '1h'} ) 

    return NextResponse.json({
      message: 'signup successful',
      token: token,
    }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
