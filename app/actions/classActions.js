'use server'

import { db } from '@/lib/db'

export async function createClass(data) {
  try {
    const newClass = await db.class.create({
      data: {
        name: data.name,
      },
    })
    return { success: true, data: newClass }
  } catch (error) {
    console.error('Error creating class:', error)
    return { success: false, error: 'Failed to create class' }
  }
}

export async function addStudentToClass({ classId, name }) {
  try {
    const newStudent = await db.student.create({
      data: {
        name,
        classes: {
          connect: { id: classId }
        }
      },
    })
    return { success: true, studentId: newStudent.id }
  } catch (error) {
    console.error('Failed to add student:', error)
    return { success: false, error: error.message }
  }
}