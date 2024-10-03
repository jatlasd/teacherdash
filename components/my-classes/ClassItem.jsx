'use client'

import { useState } from 'react'
import { MoreVertical, UserPlus, Trash2, Users, Eye } from 'lucide-react'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ClassDetailsDialog from './ClassDetailsDialog'

function ClassItem({ cls, onAddStudent, onEditStudent, onRemoveStudent, onDeleteClass }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)
  const [studentName, setStudentName] = useState('')
  const [isClassDetailsOpen, setIsClassDetailsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddStudent = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    const result = await addStudentToClass({ classId: cls.id, name: studentName })
    
    setIsLoading(false)
    if (result.success) {
      setStudentName('')
      setIsAddStudentOpen(false)
      onAddStudent(cls.id, result.data) // Pass the entire new student data
    } else {
      console.error(result.error)
    }
  }

  const handleRemoveStudent = (studentId) => {
    onRemoveStudent(cls.id, studentId)
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
            <DropdownMenuItem onClick={() => onDeleteClass(cls.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Class
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        {cls.students.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No students yet. Add your first student!
          </p>
        ) : (
          <>
            <div className="text-2xl font-bold">{cls.students.length}</div>
            <p className="text-xs text-muted-foreground">
              <Users className="mr-1 h-4 w-4 inline" />
              {cls.students.length === 1 ? 'Student' : 'Students'}
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
            <Button type="submit" disabled={isLoading} className="bg-primary rounded hover:bg-primary-700">
              {isLoading ? 'Adding...' : 'Add Student'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <ClassDetailsDialog
        cls={cls}
        isOpen={isClassDetailsOpen}
        onOpenChange={setIsClassDetailsOpen}
        onEditStudent={(updatedStudent) => onEditStudent(cls.id, updatedStudent)}
        onRemoveStudent={handleRemoveStudent}
      />
    </Card>
  )
}

export default ClassItem