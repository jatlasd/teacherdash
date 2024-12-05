'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

function SelectStudents() {
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState(null)
  const [students, setStudents] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [removedStudents, setRemovedStudents] = useState(new Set())

  const fetchClasses = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/classes')
      if (!response.ok) {
        throw new Error('Failed to fetch classes')
      }
      const data = await response.json()
      setClasses(data)
    } catch (error) {
      console.error('Error fetching classes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchClasses()
  }, [])

  const handleSelectClass = (cls) => {
    setSelectedClass(cls)
    setStudents(cls.students)
    setSelectedStudent(null)
    setRemovedStudents(new Set())
  }

  const handleSelectRandomStudents = () => {
    if (!students || students.length === 0) return

    setIsLoading(true)
    try {
      const availableStudents = students.filter(student => !removedStudents.has(student.id))
      if (availableStudents.length === 0) {
        setIsLoading(false)
        return
      }
      
      const shuffled = [...availableStudents].sort(() => 0.5 - Math.random())
      setSelectedStudent(shuffled[0])
    } catch (error) {
      console.error('Error selecting random student:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveStudent = () => {
    setRemovedStudents(prev => new Set([...prev, selectedStudent.id]))
    setSelectedStudent(null)
  }

  const handleKeepStudent = () => {
    setSelectedStudent(null)
  }

  const handleResetPool = () => {
    setRemovedStudents(new Set())
  }

  const handleAddBackToPool = (studentId) => {
    setRemovedStudents(prev => {
      const newSet = new Set(prev)
      newSet.delete(studentId)
      return newSet
    })
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-primary mb-4">Random Student Selector</h1>
        <p className="text-lg text-gray-600">Easily select a random student from your class list</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700">Select Class</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {classes.map((cls) => (
              <Button
                key={cls.id}
                onClick={() => handleSelectClass(cls)}
                variant={selectedClass?.id === cls.id ? 'default' : 'outline'}
                className={`h-auto py-2 justify-start rounded ${selectedClass?.id === cls.id ? 'bg-primary text-white hover:bg-primary-700' : 'bg-white border-gray-300'}`}
              >
                {cls.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedClass && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="shadow-lg">
              <CardHeader className="py-3">
                <CardTitle className="text-xl font-semibold text-gray-700">Student List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {students?.map((student) => (
                    <div
                      key={student.id}
                      className={`p-2 rounded-lg flex justify-between items-center ${
                        removedStudents.has(student.id)
                          ? 'bg-gray-100 text-gray-400'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      <span>{student.name}</span>
                      {removedStudents.has(student.id) && (
                        <Button
                          onClick={() => handleAddBackToPool(student.id)}
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 hover:bg-primary/10"
                        >
                          Add Back
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardHeader className="py-3">
                <CardTitle className="text-xl font-semibold text-gray-700 text-center">Controls</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-3">
                <Button
                  onClick={handleSelectRandomStudents}
                  disabled={isLoading || !students || students.length === 0}
                  className="w-full py-3 text-lg rounded hover:bg-primary-700 bg-primary"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Selecting...
                    </>
                  ) : (
                    'Select Random Student'
                  )}
                </Button>
                <Button
                  onClick={handleResetPool}
                  variant="outline"
                  className="w-full"
                  disabled={removedStudents.size === 0}
                >
                  Reset Pool
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-primary">
              Selected Student
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-3xl font-bold text-secondary">
              {selectedStudent?.name}
            </p>
          </div>
          <DialogFooter className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={handleRemoveStudent}
              className="bg-gray-100 hover:bg-gray-200"
            >
              Remove from Pool
            </Button>
            <Button
              onClick={handleKeepStudent}
              className="bg-primary hover:bg-primary-700"
            >
              Keep in Pool
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SelectStudents
