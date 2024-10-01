'use client'

import { Users } from 'lucide-react'
import { useState, useEffect } from 'react'

function ClassDetails({ classId, update }) {
  const [classData, setClassData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchClassData() {
      try {
        const response = await fetch(`/api/classes/${classId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch class data')
        }
        const data = await response.json()
        setClassData(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClassData()
  }, [classId, update])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!classData) return null

  const studentCount = classData.students.length

  if (studentCount === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        No students yet. Add your first student!
      </p>
    )
  }

  return (
    <>
      <div className="text-2xl font-bold">{studentCount}</div>
      <p className="text-xs text-muted-foreground">
        <Users className="mr-1 h-4 w-4 inline" />
        {studentCount === 1 ? 'Student' : 'Students'}
      </p>
    </>
  )
}

export default ClassDetails
