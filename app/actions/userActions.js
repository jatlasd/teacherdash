"use server"

import { db } from "@/lib/db"
import { checkUser } from "@/lib/checkUser"

export async function createCenters(data) {
  try {
    const user = await checkUser()
    const userId = user ? user.clerkUserId : null
    if (!userId) {
      return { success: false, error: "User not authenticated" }
    }

    const newCenters = await db.user.update({
      where: { clerkUserId: userId },
      data: { centers: data }
    })

    return { success: true, data: newCenters }
  } catch (error) {
    console.error("Error creating centers", error)
    return { success: false, error: "Failed to create centers" }
  }
}
