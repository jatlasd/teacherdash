"use client"
import { useState, useEffect, useCallback } from 'react'

const WholeClassDetails = ({ classId }) => {
  const [classData, setClassData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchClassData = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/classes/${classId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch class data')
      }
      const data = await response.json()
      setClassData(data)
    } catch (err) {
      console.error('Error fetching class data:', err.message)
    } finally {
      setIsLoading(false)
    }
  }, [classId])

  useEffect(() => {
    fetchClassData()
  }, [fetchClassData])

  if (isLoading) return <div>Loading...</div>
  if (!classData) return <div>No class data available</div>

  return (
    <div className='container mx-20 mt-10 flex flex-col'>
      <h1 className='text-secondary text-3xl font-bold'>{classData.name}</h1>
    </div>
  )
}

export default WholeClassDetails