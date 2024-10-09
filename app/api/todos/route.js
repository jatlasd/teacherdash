import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'

export const GET = async (request) => {
  const user = await currentUser()
  const clerkUserId = user.id

  try {
    const todos = await db.todo.findMany({
      where: {
        clerkUserId: clerkUserId
      }
    })
    return new Response(JSON.stringify(todos), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'failed to fetch todos', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}