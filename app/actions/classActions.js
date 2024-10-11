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

export async function addMultipleStudentsToClass({ classId, names }) {
  try {
    const user = await checkUser();
    const userId = user ? user.clerkUserId : null;
    if (!userId) {
      return { success: false, error: 'User not authenticated' }
    }

    const classToUpdate = await db.class.findUnique({
      where: { id: classId, ownerId: userId },
      include: { students: true }
    })

    if (!classToUpdate) {
      return { success: false, error: 'Class not found or you do not have permission' }
    }

    // Find existing students
    const existingStudents = await db.student.findMany({
      where: {
        name: {
          in: names
        }
      }
    })

    // Identify new student names
    const existingNames = existingStudents.map(student => student.name.toLowerCase())
    const newNames = names.filter(name => !existingNames.includes(name.toLowerCase()))

    // Create new students
    if (newNames.length > 0) {
      await db.student.createMany({
        data: newNames.map(name => ({ name })),
        skipDuplicates: true,
      })
    }

    // Fetch all students (existing and newly created)
    const allStudents = await db.student.findMany({
      where: {
        name: {
          in: names
        }
      }
    })

    // Connect all students to the class
    await db.class.update({
      where: { id: classId },
      data: {
        students: {
          connect: allStudents.map(student => ({ id: student.id }))
        }
      }
    })

    // Fetch the final list of added students
    const addedStudents = await db.student.findMany({
      where: {
        name: {
          in: names
        },
        classes: {
          some: {
            id: classId
          }
        }
      }
    })

    return { success: true, data: addedStudents }
  } catch (error) {
    console.error('Failed to add students:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteClass(classId) {
  try {
    const user = await checkUser();
    const userId = user ? user.clerkUserId : null;
    if (!userId) {
      return { success: false, error: 'User not authenticated' }
    }

    // First, remove the association between the class and its students
    await db.class.update({
      where: {
        id: classId,
        ownerId: userId // Ensure the user owns this class
      },
      data: {
        students: {
          set: [] // This removes all associations without deleting the students
        }
      }
    })

    // Then delete the class itself
    await db.class.delete({
      where: {
        id: classId,
        ownerId: userId // Ensure the user owns this class
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Error deleting class:', error)
    return { success: false, error: 'Failed to delete class' }
  }
}