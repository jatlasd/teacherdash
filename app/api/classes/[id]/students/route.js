import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req, { params }) {
  try {
    const students = await db.student.findMany({
      where: {
        classes: {
          some: {
            id: params.id
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })
    
    return NextResponse.json(students)
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 })
  }
} 