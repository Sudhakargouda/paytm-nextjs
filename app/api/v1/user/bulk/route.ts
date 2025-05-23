import { NextRequest, NextResponse } from "next/server";
import {prisma} from '@/lib/prisma'

export async function GET(req:NextRequest) {
    const {searchParams} = new URL(req.url)
    const rawFilter = searchParams.get("filter")    

    const filter = typeof rawFilter === 'string' ? rawFilter : '';

    // if (!filter) {
    //     return NextResponse.json({ users: [] });
    //   }

    try {
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    {
                        username: {
                            contains: filter,
                            mode: 'insensitive'
                        }
                    },
                    {
                        firstName: {
                            contains: filter,
                            mode: 'insensitive'
                        }
                    },
                    {
                        lastName: {
                            contains: filter,
                            mode: 'insensitive'
                        }
                    }
                ]
            }
        });

        return NextResponse.json({users})

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

