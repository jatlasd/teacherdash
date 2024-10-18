"use server"

import { db } from "@/lib/db"
import { checkUser } from "@/lib/checkUser"

export async function createCenters(name, centers) {
  try {
    const user = await checkUser()
    if (!user) {
      return { success: false, error: "User not authenticated" }
    }

    const centerNames = centers.map(center => center.name)

    const newCenterList = await db.centerList.create({
      data: {
        name,
        centers: centerNames,
        user: { connect: { clerkUserId: user.clerkUserId } }
      }
    })

    return { success: true, data: newCenterList }
  } catch (error) {
    console.error("Error creating centers", error)
    return { success: false, error: "Failed to create centers" }
  }
}

export async function fetchSavedCenters() {
  try {
    const user = await checkUser()
    if (!user) {
      return { success: false, error: "User not authenticated" }
    }

    const centerLists = await db.centerList.findMany({
      where: { userId: user.clerkUserId }
    })

    return { success: true, data: centerLists }
  } catch (error) {
    console.error("Error fetching saved centers", error)
    return { success: false, error: "Failed to fetch saved centers" }
  }
}

export async function updateCenters(id, name, centers) {
  try {
    const user = await checkUser()
    if (!user) {
      return { success: false, error: "User not authenticated" }
    }

    const centerNames = centers.map(center => center.name)

    const updatedCenterList = await db.centerList.update({
      where: { id },
      data: {
        name,
        centers: centerNames
      }
    })

    return { success: true, data: updatedCenterList }
  } catch (error) {
    console.error("Error updating centers", error)
    return { success: false, error: "Failed to update centers" }
  }
}

export async function deleteCenterList(id) {
  try {
    const user = await checkUser()
    if (!user) {
      return { success: false, error: "User not authenticated" }
    }

    await db.centerList.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    console.error("Error deleting center list", error)
    return { success: false, error: "Failed to delete center list" }
  }
}