"use client"

import {useState, useEffect} from 'react'
import AddClass from '@/components/my-classes/AddClass'
import ClassItem from '@/components/my-classes/ClassItem'
// import { db } from '@/lib/db'

const MyClasses = () => {
  const [classes, setClasses] = useState([])
  // const classes = await db.class.findMany()
  
  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes')
      if(!response.ok) {
        throw new Error('Failed to fetch classes')
      }
      const data = await response.json()
      setClasses(data)
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
  }

  useEffect(() => {
    fetchClasses()
  }, [])

  const handleAddStudent = (classId, newStudent) => {
    setClasses(prevClasses => 
      prevClasses.map(cls => 
        cls.id === classId 
          ? { ...cls, students: [...cls.students, newStudent] }
          : cls
      )
    )
  }

  const handleEditStudent = (classId, updatedStudent) => {
    setClasses(prevClasses => 
      prevClasses.map(cls => 
        cls.id === classId 
          ? { 
              ...cls, 
              students: cls.students.map(student => 
                student.id === updatedStudent.id ? updatedStudent : student
              )
            }
          : cls
      )
    )
  }

  const handleRemoveStudent = (classId, studentId) => {
    setClasses(prevClasses => 
      prevClasses.map(cls => 
        cls.id === classId 
          ? { ...cls, students: cls.students.filter(student => student.id !== studentId) }
          : cls
      )
    )
  }

  const handleDeleteClass = async (classId) => {
    // Implement the API call to delete the class
    // Then update the state
    setClasses(prevClasses => prevClasses.filter(cls => cls.id !== classId))
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-secondary">My Classes</h1>
        <AddClass onClassAdded={fetchClasses} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <ClassItem
            key={cls.id}
            cls={cls}
            onAddStudent={handleAddStudent}
            onEditStudent={handleEditStudent}
            onRemoveStudent={handleRemoveStudent}
            onDeleteClass={handleDeleteClass}
          />
        ))}
      </div>
    </div>
  )
}

export default MyClasses