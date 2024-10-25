"use server"

import { db } from "@/lib/db"
import { checkUser } from "@/lib/checkUser";

export async function createList(data) {
    try {
        const user = await checkUser();
        const userId = user ? user.clerkUserId : null;
        if (!userId) {
          return { success: false, error: "User not authenticated" };
        }

        const newList = await db.list.create({
            data: {
                title: data.title,
                user: {
                    connect: { clerkUserId: userId }
                }
            }
        })

        return { success: true, data: newList }

    } catch (error) {
        console.error('Failed to create list:', error)
        return { success: false, error: error.message }
    }
}

export async function addItemToList(listId, newItem) {
  try {
    const user = await checkUser()
    const userId = user ? user.clerkUserId : null
    if (!userId) {
      return { success: false, error: 'User not authenticated' }
    }

    const updatedList = await db.list.update({
      where: { id: listId },
      data: {
        items: {
          push: newItem // Use the `push` operator to add a new item to the array
        }
      }
    })

    return { success: true, data: updatedList }
  } catch (error) {
    console.error('Failed to add item to list:', error)
    return { success: false, error: error.message }
  }
}

export async function fetchUserLists() {
  try {
    const user = await checkUser()
    const userId = user ? user.clerkUserId : null
    if (!userId) {
      return { success: false, error: 'User not authenticated' }
    }

    const userLists = await db.list.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        items: true,
        color: true // Ensure items are included
      }
    })

    return { success: true, data: userLists }
  } catch (error) {
    console.error('Failed to fetch user lists:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteList(listId) {
  try {
    const user = await checkUser()
    const userId = user ? user.clerkUserId : null
    if (!userId) {
      return { success: false, error: 'User not authenticated' }
    }

    await db.list.delete({
      where: { id: listId }
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to delete list:', error)
    return { success: false, error: error.message }
  }
}

export async function updateListItems(listId, items) {
  try {
    const updatedList = await db.list.update({
      where: { id: listId },
      data: { items },
    });
    return { success: true, data: updatedList };
  } catch (error) {
    console.error('Error updating list items:', error);
    return { success: false, error: error.message };
  }
}

export async function updateListColor(listId, color) {
  try {
    const updatedList = await db.list.update({
      where: { id: listId },
      data: { color },
    });
    return { success: true, data: updatedList };
  } catch (error) {
    console.error('Error updating list color:', error);
    return { success: false, error: error.message };
  }
}
