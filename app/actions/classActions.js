'use server'

import { db } from '@/lib/db'
import { checkUser } from "@/lib/checkUser";


export async function createClass(data) {
  try {
    const user = await checkUser();
    const userId = user ? user.clerkUserId : null;
    if (!userId) {
      return { success: false, error: 'User not authenticated' }
    }

    const newClass = await db.class.create({
      data: {
        name: data.name,
        ownerId: userId,
        users: {
          connect: { clerkUserId: userId }
        }
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
    return { success: true, data: newStudent }
  } catch (error) {
    console.error('Failed to add student:', error)
    return { success: false, error: error.message }
  }
}

export async function removeStudentFromClass({ studentId, classId }) {
  try {
    await db.class.update({
      where: { id: classId },
      data: {
        students: {
          disconnect: { id: studentId }
        }
      }
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to remove student from class:', error)
    return { success: false, error: error.message }
  }
}

