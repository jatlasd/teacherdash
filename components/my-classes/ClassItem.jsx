'use client'

import { useState } from 'react'
import { MoreVertical, Edit, UserPlus, Trash2, Users } from 'lucide-react'
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
import ClassDetails from '../ClassDetails'

function ClassItem({ cls }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)
  const [studentName, setStudentName] = useState('')
  const [update, setUpdate] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleEditClass = () => {
    // TODO: Implement edit class functionality
    console.log('Edit class:', cls.id)
  }

  const handleAddStudent = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    const result = await addStudentToClass({ classId: cls.id, name: studentName })
    
    setIsLoading(false)
    if (result.success) {
      setStudentName('')
      setIsAddStudentOpen(false)
      setUpdate(!update) // Refresh the page to show the new student
    } else {
      // Handle error (you might want to show an error message to the user)
      console.error(result.error)
    }
  }

  const handleDeleteClass = () => {
    // TODO: Implement delete class functionality
    console.log('Delete class:', cls.id)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{cls.name}</CardTitle>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEditClass}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Class
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
        <ClassDetails classId={cls.id} update={update}/>
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
    </Card>
  )
}

export default ClassItem