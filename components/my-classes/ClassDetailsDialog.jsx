"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import StudentList from './StudentList'
import { removeStudentFromClass, addStudentToClass } from '@/app/actions/classActions'
import StudentGroups from "./StudentGroups"

const ClassDetailsDialog = ({
  cls,
  isOpen,
  onOpenChange,
  onEditStudent,
  onRemoveStudent,
  onAddStudent,
}) => {
  const [activeTab, setActiveTab] = useState('students')
  const [deleteConfirmation, setDeleteConfirmation] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [students, setStudents] = useState(cls.students || [])

  useEffect(() => {
    setStudents(cls.students || [])
  }, [cls.students])

  const handleRemoveStudent = async (studentId) => {
    setIsDeleting(true)
    try {
      const result = await removeStudentFromClass({ studentId, classId: cls.id })
      if (result.success) {
        setStudents(students.filter(student => student.id !== studentId))
        setDeleteConfirmation(null)
      } else {
        console.error(result.error)
      }
    } catch (error) {
      console.error('Error removing student:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleAddStudent = async (newStudentName) => {
    if (!newStudentName.trim()) return
    try {
      const result = await addStudentToClass({ name: newStudentName, classId: cls.id })
      if (result.success) {
        setStudents(prevStudents => [...prevStudents, result.student])
        onAddStudent(result.student) // Notify parent component
      } else {
        console.error(result.error)
      }
    } catch (error) {
      console.error('Error adding student:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">{cls.name} - Details</DialogTitle>
        </DialogHeader>
        <div className="flex space-x-4 mb-4">
          <Button
            onClick={() => setActiveTab('students')}
            variant={activeTab === 'students' ? 'default' : 'outline'}
          >
            Students
          </Button>
          <Button
            onClick={() => setActiveTab('groups')}
            variant={activeTab === 'groups' ? 'default' : 'outline'}
          >
            Groups
          </Button>
        </div>
        {activeTab === 'students' && (
          <StudentList
            cls={{ ...cls, students }} 
            onEditStudent={onEditStudent}
            onRemoveStudent={handleRemoveStudent}
            onAddStudent={handleAddStudent}
            onDeleteConfirmation={setDeleteConfirmation}
          />
        )}
        {activeTab === 'groups' && (
          <div>
            {/* Placeholder for future Groups component */}
            <StudentGroups
              cls={cls}
            />
          </div>
        )}
      </DialogContent>

      <Dialog open={!!deleteConfirmation} onOpenChange={() => setDeleteConfirmation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {deleteConfirmation?.name} from this class?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmation(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleRemoveStudent(deleteConfirmation.id)}
              disabled={isDeleting}
            >
              {isDeleting ? 'Removing...' : 'Remove'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}

export default ClassDetailsDialog
