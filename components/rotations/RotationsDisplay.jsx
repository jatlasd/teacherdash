"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { X, Play, Pause, RotateCcw, ChevronRight } from 'lucide-react'

const RotationsDisplay = ({ centers }) => {
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState(null)
  const [groups, setGroups] = useState([])
  const [centerAssignments, setCenterAssignments] = useState({})
  const [time, setTime] = useState(300) // 5 minutes in seconds
  const [inputMinutes, setInputMinutes] = useState('05')
  const [inputSeconds, setInputSeconds] = useState('00')
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [currentRotation, setCurrentRotation] = useState(0)

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    let interval
    if (isTimerRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1)
      }, 1000)
    } else if (time === 0) {
      handleEndRotation()
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, time])

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes')
      if (!response.ok) throw new Error('Failed to fetch classes')
      const data = await response.json()
      setClasses(data)
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
  }

  const fetchGroups = async (classId) => {
    try {
      const response = await fetch(`/api/classes/${classId}/groups`)
      if (!response.ok) throw new Error('Failed to fetch groups')
      const data = await response.json()
      setGroups(data)
      initializeCenterAssignments()
    } catch (error) {
      console.error('Error fetching groups:', error)
    }
  }

  const initializeCenterAssignments = () => {
    const initialAssignments = {}
    centers.forEach((center) => {
      initialAssignments[center.id] = []
    })
    setCenterAssignments(initialAssignments)
  }

  const handleClassSelect = (classId) => {
    setSelectedClass(classId)
    fetchGroups(classId)
  }

  const handleDragStart = (e, group) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(group))
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, centerId) => {
    e.preventDefault()
    const groupData = JSON.parse(e.dataTransfer.getData('text/plain'))
    
    setCenterAssignments(prev => {
      const newAssignments = { ...prev }
      // Remove the group from its previous center
      Object.keys(newAssignments).forEach(key => {
        newAssignments[key] = newAssignments[key].filter(g => g.id !== groupData.id)
      })
      // Add the group to the new center
      newAssignments[centerId] = [...newAssignments[centerId], groupData]
      return newAssignments
    })

    // Remove the group from the unassigned groups
    setGroups(prev => prev.filter(g => g.id !== groupData.id))
  }

  const handleTimeInputChange = (e, setter) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 2)
    setter(value)
  }

  const handleSetTime = () => {
    const minutes = parseInt(inputMinutes, 10) || 0
    const seconds = parseInt(inputSeconds, 10) || 0
    setTime(minutes * 60 + seconds)
  }

  const handleStartTimer = () => {
    if (time > 0) {
      setIsTimerRunning(true)
    }
  }

  const handlePauseTimer = () => {
    setIsTimerRunning(false)
  }

  const handleResetTimer = () => {
    handleSetTime()
    setIsTimerRunning(false)
  }

  const handleEndRotation = () => {
    setCenterAssignments(prev => {
      const newAssignments = {}
      centers.forEach((center, index) => {
        const nextIndex = (index - 1 + centers.length) % centers.length
        newAssignments[center.id] = prev[centers[nextIndex].id] || []
      })
      return newAssignments
    })
    setCurrentRotation((prev) => (prev - 1 + centers.length) % centers.length)
    handleResetTimer()
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleRemoveFromCenter = (centerId, group) => {
    setCenterAssignments(prev => {
      const newAssignments = { ...prev }
      newAssignments[centerId] = newAssignments[centerId].filter(g => g.id !== group.id)
      return newAssignments
    })
    setGroups(prev => [...prev, group])
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
        <Select onValueChange={handleClassSelect}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a class" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            value={inputMinutes}
            onChange={(e) => handleTimeInputChange(e, setInputMinutes)}
            className="w-12 text-center"
            placeholder="MM"
          />
          <span>:</span>
          <Input
            type="text"
            value={inputSeconds}
            onChange={(e) => handleTimeInputChange(e, setInputSeconds)}
            className="w-12 text-center"
            placeholder="SS"
          />
          <Button onClick={handleSetTime} variant="outline">Set</Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleStartTimer} disabled={isTimerRunning} size="icon"><Play className="h-4 w-4" /></Button>
          <Button onClick={handlePauseTimer} disabled={!isTimerRunning} size="icon"><Pause className="h-4 w-4" /></Button>
          <Button onClick={handleResetTimer} size="icon"><RotateCcw className="h-4 w-4" /></Button>
          <Button onClick={handleEndRotation}>End Rotation</Button>
        </div>
        <div className="text-3xl font-bold">{formatTime(time)}</div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {groups.map((group) => (
          <div
            key={group.id}
            draggable
            onDragStart={(e) => handleDragStart(e, group)}
            className="bg-gray-100 p-2 rounded cursor-move text-sm"
          >
            {group.name}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {centers.map((center, index) => (
          <Card key={center.id}>
            <CardContent
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, center.id)}
              className="p-4 min-h-[200px]"
            >
              <h3 className={`text-2xl text-center font-bold mb-2 ${index % 2 === 0 ? 'text-primary' : 'text-secondary'}`}>
                {center.name}
              </h3>
              <div className="space-y-2">
                {centerAssignments[center.id]?.map((group) => (
                  <div
                    key={group.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, group)}
                    className="bg-gray-100 p-2 rounded cursor-move flex justify-between items-center text-sm"
                  >
                    <span>{group.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFromCenter(center.id, group)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default RotationsDisplay
