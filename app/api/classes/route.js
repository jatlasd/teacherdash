
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export const GET = async ( request) => {
  const user = await currentUser()
  const  clerkUserId  = user.id

  try {
    const classes = await db.class.findMany({
      where: {
        ownerId: clerkUserId,
      },
      include: {
        students: true
      }
    })
    return new Response(JSON.stringify(classes), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
  })
  } catch (error) {
    console.error('Error fetching classes:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch classes', details: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
    })
  }
}