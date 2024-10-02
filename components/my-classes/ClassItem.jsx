'use client'

import { useEffect, useState } from 'react'
import { MoreVertical, Edit, UserPlus, Trash2, Users, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { addStudentToClass } from '@/app/actions/classActions'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ClassDetailsDialog from './ClassDetailsDialog'

function ClassItem({ cls }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)
  const [studentName, setStudentName] = useState('')
  const [classData, setClassData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClassDetailsOpen, setIsClassDetailsOpen] = useState(false)
  const router = useRouter()

  const handleAddStudent = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    const result = await addStudentToClass({ classId: cls.id, name: studentName })
    
    setIsLoading(false)
    if (result.success) {
      setStudentName('')
      setIsAddStudentOpen(false)
      fetchClassData()
    } else {
      console.error(result.error)
    }
  }

  const handleDeleteClass = () => {
    console.log('Delete class:', cls.id)
  }

  const fetchClassData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/classes/${cls.id}`)
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
  }

  useEffect(() => {
    fetchClassData()
  }, [cls.id])

  if (isLoading) {
    return <Card><CardContent>Loading...</CardContent></Card>
  }

  if (!classData) {
    return <Card><CardContent>No data available</CardContent></Card>
  }

  const handleEditStudent = async (updatedStudent) => {
    // Implement the logic to update the student in the backend
    console.log('Edit student:', updatedStudent)
    // After successful update, refresh the class data
    await fetchClassData()
  }

  const handleDeleteStudent = async (studentId) => {
    // Implement the logic to delete the student from the backend
    console.log('Delete student:', studentId)
    // After successful deletion, refresh the class data
    await fetchClassData()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold text-primary">{cls.name}</CardTitle>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setIsClassDetailsOpen(true)}>
              <Eye className="mr-2 h-4 w-4" />
              View Class
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setIsAddStudentOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Student
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteClass}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Class
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        {classData.students.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No students yet. Add your first student!
          </p>
        ) : (
          <>
            <div className="text-2xl font-bold">{classData.students.length}</div>
            <p className="text-xs text-muted-foreground">
              <Users className="mr-1 h-4 w-4 inline" />
              {classData.students.length === 1 ? 'Student' : 'Students'}
            </p>
          </>
        )}
      </CardContent>
      
      <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Student to {cls.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddStudent} className="space-y-4">
            <div>
              <Label htmlFor="studentName">Student Name</Label>
              <Input
                id="studentName"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter student name"
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Student'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <ClassDetailsDialog
        cls={classData}
        isOpen={isClassDetailsOpen}
        onOpenChange={setIsClassDetailsOpen}
        onEditStudent={handleEditStudent}
        onDeleteStudent={handleDeleteStudent}
      />
    </Card>
  )
}

export default ClassItem