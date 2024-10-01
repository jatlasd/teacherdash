import { db } from "@/lib/db"
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const { id } = params

  try {
    const classData = await db.class.findUnique({
      where: { id: id },
      include: {
        students: true,
      },
    })

    if (!classData) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 })
    }

    return NextResponse.json(classData)
  } catch (error) {
    console.error('Error fetching class:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}