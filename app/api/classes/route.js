import { db } from "@/lib/db";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const classes = await db.class.findMany({
      include: {
        students: true,
      },
    });

    return NextResponse.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

