'use server'

import { db } from '@/lib/db'
import { checkUser } from "@/lib/checkUser";

export async function addTodo({todo}) {
    const user = await checkUser();
    const userId = user ? user.clerkUserId : null;
    if (!userId) {
      return { success: false, error: 'User not authenticated' }
    }
    try {
      const newTodo = await db.todo.create({
        data: {
          todo: todo,
          completed: false,
          user: {
            connect: { clerkUserId: userId }
          }
        }
      })
      return { success: true, data: newTodo }
    } catch (error) {
      console.error('Failed to add todo:', error)
      return { success: false, error: error.message }
    }
  }

export async function editTodo({ id, todo, completed }) {
  try {
    const updateData = {}
    if (todo !== undefined) updateData.todo = todo
    if (completed !== undefined) updateData.completed = completed

    const updatedTodo = await db.todo.update({
      where: { id },
      data: updateData
    })

    return { success: true, data: updatedTodo }
  } catch (error) {
    console.error('Error updating todo:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteTodo({ id }) {
  try {
    await db.todo.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    console.error('Error deleting todo:', error)
    return { success: false, error: error.message }
  }
}