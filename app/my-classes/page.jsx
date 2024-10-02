import React from 'react'
import AddClass from '@/components/my-classes/AddClass'
import ClassItem from '@/components/my-classes/ClassItem'
import { db } from '@/lib/db'

async function MyClasses() {
  const classes = await db.class.findMany()

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-secondary">My Classes</h1>
        <AddClass />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.length > 0 ? (
          classes.map((cls) => (
            <ClassItem key={cls.id} cls={cls} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 py-8">
            No classes yet. Add your first class!
          </p>
        )}
      </div>
    </div>
  )
}

export default MyClasses