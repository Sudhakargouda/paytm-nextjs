import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    const {searchParams} = new URL(req.url)

    const filter = searchParams.get('filter') || ''

    const db = await createConnection()

    const searchQuery = `%${filter.toLowerCase()}%`

    try {
        const [rows] = await db.execute(
          `SELECT * FROM User 
           WHERE LOWER(username) LIKE ? 
           OR LOWER(firstName) LIKE ? 
           OR LOWER(lastName) LIKE ?`,
          [searchQuery, searchQuery, searchQuery]
        );
    
        return NextResponse.json({ users: rows });
      } catch (error) {
        console.error('Error running search query:', error);
        return NextResponse.json({ msg: 'Server error' }, { status: 500 });
      }

}