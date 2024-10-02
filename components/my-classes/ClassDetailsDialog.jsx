"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Save } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

const ClassDetailsDialog = ({
  cls,
  isOpen,
  onOpenChange,
  onEditStudent,
  onDeleteStudent,
}) => {
  const [editingStudent, setEditingStudent] = useState(null)

  const handleEditStudent = (student) => {
    setEditingStudent(student)
  }

  const handleSaveEdit = () => {
    onEditStudent(editingStudent)
    setEditingStudent(null)
  }

  const handleDeleteStudent = (studentId) => {
    onDeleteStudent(studentId)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary">{cls.name} - Students</DialogTitle>
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
                  <p className="font-medium text-lg mb-2 truncate">{student.name}</p>
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
                    onClick={() => handleDeleteStudent(student.id)}
                    size="icon"
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ClassDetailsDialog