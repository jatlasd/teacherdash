"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Save, UserPlus, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { removeStudentFromClass, addStudentToClass } from "@/app/actions/classActions"

const ClassDetailsDialog = ({
  cls,
  isOpen,
  onOpenChange,
  onEditStudent,
  onRemoveStudent,
  onAddStudent,
}) => {
  const [editingStudent, setEditingStudent] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [newStudentName, setNewStudentName] = useState("")
  const [isAddingStudent, setIsAddingStudent] = useState(false)
  const [showAddStudentInput, setShowAddStudentInput] = useState(false)

  const handleEditStudent = (student) => {
    setEditingStudent(student)
  }

  const handleSaveEdit = () => {
    onEditStudent(editingStudent)
    setEditingStudent(null)
  }

  const handleRemoveStudent = async (studentId) => {
    setIsDeleting(true)
    const result = await removeStudentFromClass({ studentId, classId: cls.id })
    setIsDeleting(false)
    if (result.success) {
      onRemoveStudent(studentId)
    } else {
      console.error(result.error)
    }
  }

  const handleAddStudent = async () => {
    if (!newStudentName.trim()) return
    setIsAddingStudent(true)
    const result = await addStudentToClass({ name: newStudentName, classId: cls.id })
    setIsAddingStudent(false)
    if (result.success) {
      onAddStudent(result.student)
      setNewStudentName("")
      setShowAddStudentInput(false)
    } else {
      console.error(result.error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">{cls.name} - Students</DialogTitle>
        </DialogHeader>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cls.students.map((student) => (
            <Card key={student.id} className="overflow-hidden">
              <CardContent className="p-4">
                {editingStudent && editingStudent.id === student.id ? (
                  <Input
                    value={editingStudent.name}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        name: e.target.value,
                      })
                    }
                    className="mb-2"
                  />
                ) : (
                  <p className="font-medium text-lg mb-2 truncate text-primary">{student.name}</p>
                )}
                <div className="flex justify-end space-x-2">
                  {editingStudent && editingStudent.id === student.id ? (
                    <Button onClick={handleSaveEdit} size="icon" variant="outline">
                      <Save className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleEditStudent(student)}
                      size="icon"
                      variant="outline"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    onClick={() => handleRemoveStudent(student.id)}
                    size="icon"
                    className="bg-secondary hover:bg-secondary-600"
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-6 border-t pt-4">
          {showAddStudentInput ? (
            <div className="flex items-center space-x-2">
              <Input
                placeholder="New student name"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                className="flex-grow"
              />
              <Button 
                onClick={handleAddStudent} 
                disabled={isAddingStudent || !newStudentName.trim()}
                size="sm"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add
              </Button>
              <Button
                onClick={() => setShowAddStudentInput(false)}
                size="sm"
                variant="outline"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setShowAddStudentInput(true)}
              size="sm"
              variant="outline"
              className="w-full text-primary border border-primary-200/50 hover:text-primary-700 hover:bg-primary/10"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ClassDetailsDialog