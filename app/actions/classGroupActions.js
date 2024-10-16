"use server";

import { db } from "@/lib/db";

export async function createGroup(data) {
  try {
    const newGroup = await db.group.create({
      data: {
        name: data.name,
        class: {
          connect: { id: data.classId },
        },
      },
    });
    return { success: true, data: newGroup };
  } catch (error) {
    console.error("Error creating group", error);
    return { success: false, error: "Failed to create group" };
  }
}

export async function updateGroups({ groups, classId }) {
  try {
    const updates = groups.map(group => 
      db.group.update({
        where: { id: group.id },
        data: {
          name: group.name,
          students: {
            set: group.students.map(student => ({ id: student.id }))
          }
        },
        include: {
          students: true
        }
      })
    );

    const updatedGroups = await db.$transaction(updates);
    return { success: true, data: updatedGroups };
  } catch (error) {
    console.error("Error updating groups", error);
    return { success: false, error: "Failed to update groups" };
  }
}

export async function deleteGroup(groupId) {
  try {
    await db.group.delete({
      where: { id: groupId },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting group", error);
    return { success: false, error: "Failed to delete group" };
  }
}

export async function updateGroup({ groupId, newName, students, classId }) {
  try {
    const updatedGroup = await db.group.update({
      where: { id: groupId },
      data: {
        name: newName,
        students: {
          set: students.map(student => ({ id: student.id }))
        }
      }
    })
    return { success: true, data: updatedGroup }
  } catch (error) {
    console.error("Error updating group", error)
    return { success: false, error: "Failed to update group" }
  }
}
