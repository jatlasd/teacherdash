'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'

function SelectStudents() {
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState(null)
  const [students, setStudents] = useState(null)
  const [selectedStudents, setSelectedStudents] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [numberOfStudents, setNumberOfStudents] = useState('1')

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
    setSelectedStudents([])
  }

  const handleSelectRandomStudents = () => {
    if (!students || students.length === 0) return

    setIsLoading(true)
    try {
      const numStudents = Math.min(parseInt(numberOfStudents, 10) || 1, students.length)
      const shuffled = [...students].sort(() => 0.5 - Math.random())
      setSelectedStudents(shuffled.slice(0, numStudents))
    } catch (error) {
      console.error('Error selecting random students:', error)
    } finally {
      setIsLoading(false)
    }
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
        <Card className="shadow-lg">
          <CardContent className="space-y-4 flex flex-col items-center">
            <div className="flex flex-col items-center space-y-4 w-full justify-center mt-5">
              <Input
                type="text"
                value={numberOfStudents}
                onChange={(e) => setNumberOfStudents(e.target.value)}
                placeholder="Number of students"
                className="w-40 text-center"
              />
              <Button
                onClick={handleSelectRandomStudents}
                disabled={isLoading || !students || students.length === 0}
                className="py-3 text-lg rounded hover:bg-primary-700 bg-primary"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Selecting...
                  </>
                ) : (
                  'Select Random Students'
                )}
              </Button>
            </div>
            {selectedStudents.length > 0 && (
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">Selected Students:</h2>
                {selectedStudents.map((student, index) => (
                  <p key={student.id} className="text-3xl font-bold text-secondary mb-2">
                    {student.name}
                  </p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default SelectStudents
