"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '../ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Play, Pause, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'
import { Separator } from '../ui/separator'
import { generateWarning } from '@/app/actions/openaiActions'

function RotationsDisplay ({ centers }) {
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState(null)
  const [groups, setGroups] = useState([])
  const [centerAssignments, setCenterAssignments] = useState({})
  const [time, setTime] = useState(300)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [editMinutes, setEditMinutes] = useState('05')
  const [editSeconds, setEditSeconds] = useState('00')
  const [isOptionsVisible, setIsOptionsVisible] = useState(false)
  const timeInputRef = useRef(null)
  const [warningTime, setWarningTime] = useState('')
  const [warningAudioSrc, setWarningAudioSrc] = useState('')
  const [unassignedGroups, setUnassignedGroups] = useState([])
  const [timerWarningEnabled, setTimerWarningEnabled] = useState(false)
  const [centerDetails, setCenterDetails] = useState({})
  const [editingCenterId, setEditingCenterId] = useState(null)
  const [isDetailsAdded, setIsDetailsAdded] = useState({})
  const detailInputRefs = useRef({})

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    let interval
    if (isTimerRunning && time > 0) {
      interval = setInterval(() => {
        setTime(prevTime => {
          if (warningAudioSrc && prevTime === parseInt(warningTime) * 60) {
            new Audio(warningAudioSrc).play()
          }
          return prevTime - 1
        })
      }, 1000)
    } else if (time === 0) {
      handleEndRotation()
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, time, warningTime, warningAudioSrc])

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

  const fetchGroups = async classId => {
    try {
      const response = await fetch(`/api/classes/${classId}/groups`)
      if (!response.ok) throw new Error('Failed to fetch groups')
      const data = await response.json()
      setGroups(data)
      setUnassignedGroups(data)
      initializeCenterAssignments()
    } catch (error) {
      console.error('Error fetching groups:', error)
    }
  }

  const initializeCenterAssignments = () => {
    const initialAssignments = {}
    centers.forEach(center => {
      initialAssignments[center.id] = []
    })
    setCenterAssignments(initialAssignments)
  }

  const handleClassSelect = classId => {
    setSelectedClass(classId)
    fetchGroups(classId)
  }

  const handleDragStart = (e, group) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(group))
  }

  const handleDragOver = e => {
    e.preventDefault()
  }

  const handleDrop = (e, centerId) => {
    e.preventDefault()
    const groupData = JSON.parse(e.dataTransfer.getData('text/plain'))
    
    setCenterAssignments(prev => {
      const newAssignments = { ...prev }
      Object.keys(newAssignments).forEach(key => {
        newAssignments[key] = newAssignments[key].filter(g => g.id !== groupData.id)
      })
      newAssignments[centerId] = [...newAssignments[centerId], groupData]
      return newAssignments
    })

    setUnassignedGroups(prev => prev.filter(g => g.id !== groupData.id))
  }

  const handleTimeChange = setter => e => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 2)
    setter(value)
  }

  const handleSetTime = () => {
    const minutes = parseInt(editMinutes, 10) || 0
    const seconds = parseInt(editSeconds, 10) || 0
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
    setIsTimerRunning(false)
    setTime(300)
    setEditMinutes('05')
    setEditSeconds('00')
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
    handleResetTimer()
  }

  const formatTime = seconds => {
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
    setUnassignedGroups(prev => [...prev, group])
  }

  const toggleOptions = () => {
    setIsOptionsVisible(!isOptionsVisible)
  }

  const warningMessages = [
    `Hey there! Just a heads up, we've got about ${warningTime} ${warningTime === '1' ? 'minute' : 'minutes'} to go. Let's wrap things up!`,
    `Time flies when you're having fun! We have ${warningTime} ${warningTime === '1' ? 'minute' : 'minutes'} left in this rotation.`,
    `Attention everyone! ${warningTime} ${warningTime === '1' ? 'minute' : 'minutes'} remaining. Start wrapping up your activities.`,
    `Quick update: ${warningTime} ${warningTime === '1' ? 'minute' : 'minutes'} left on the clock. Finish strong!`,
    `Time check! We're down to our last ${warningTime} ${warningTime === '1' ? 'minute' : 'minutes'}. Make them count!`,
    `Heads up, team! Only ${warningTime} ${warningTime === '1' ? 'minute' : 'minutes'} left in this rotation. Start wrapping up.`,
    `Time's almost up! We have ${warningTime} ${warningTime === '1' ? 'minute' : 'minutes'} remaining. Let's finish what we started.`,
    `Just a friendly reminder: ${warningTime} ${warningTime === '1' ? 'minute' : 'minutes'} left. Let's prepare for the next rotation.`,
    `Final countdown! ${warningTime} ${warningTime === '1' ? 'minute' : 'minutes'} remaining. Get ready to switch centers soon.`
  ]

  const handleGenerateWarning = async () => {
    try {
      const randomMessage = warningMessages[Math.floor(Math.random() * warningMessages.length)]
      const audioDataUrl = await generateWarning({ input: randomMessage })
      setWarningAudioSrc(audioDataUrl)
    } catch (error) {
      console.error('Error generating warning:', error)
    }
  }

  const handleCenterDetailClick = (centerId) => {
    setEditingCenterId(centerId)
    setTimeout(() => {
      detailInputRefs.current[centerId]?.focus()
    }, 0)
  }

  const handleCenterDetailChange = (centerId, value) => {
    setCenterDetails(prev => ({ ...prev, [centerId]: value }))
    setIsDetailsAdded(prev => ({ ...prev, [centerId]: value.trim() !== '' }))
  }

  const handleCenterDetailBlur = () => {
    setEditingCenterId(null)
  }

  return (
    <div className="space-y-8">
      <div className="bg-gray-100 p-4 rounded-lg space-y-4">
        <div className="flex justify-between items-center cursor-pointer" onClick={toggleOptions}>
          <span>Options</span>
          {isOptionsVisible ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
        {isOptionsVisible && (
          <div className="space-y-4">
            <Select onValueChange={handleClassSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map(cls => (
                  <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                value={editMinutes}
                onChange={handleTimeChange(setEditMinutes)}
                className="w-12 text-center"
                placeholder="MM"
              />
              <span>:</span>
              <Input
                type="text"
                value={editSeconds}
                onChange={handleTimeChange(setEditSeconds)}
                className="w-12 text-center"
                placeholder="SS"
              />
              <Button onClick={handleSetTime} variant="outline">Set</Button>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="timerWarning"
                checked={timerWarningEnabled}
                onChange={(e) => setTimerWarningEnabled(e.target.checked)}
              />
              <label htmlFor="timerWarning">Enable Timer Warnings</label>
            </div>
            {timerWarningEnabled && (
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={warningTime}
                  onChange={(e) => setWarningTime(e.target.value)}
                  className="w-1/6 text-center"
                  placeholder="Minutes"
                />
                <Button onClick={handleGenerateWarning} variant="outline">Set Warning</Button>
              </div>
            )}
            {warningAudioSrc && (
              <div className="text-sm text-green-600">
                Warning audio set for {warningTime} minutes remaining
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button onClick={handleStartTimer} disabled={isTimerRunning} size="icon" variant="outline" className="text-primary hover:bg-primary/10"><Play className="h-4 w-4" /></Button>
          <Button onClick={handlePauseTimer} disabled={!isTimerRunning} size="icon" variant="outline" className="text-primary hover:bg-primary/10"><Pause className="h-4 w-4" /></Button>
          <Button onClick={handleResetTimer} size="icon" variant="outline" className="text-primary hover:bg-primary/10"><RotateCcw className="h-4 w-4" /></Button>
        </div>
        <div className="text-6xl font-bold text-primary">
          {formatTime(time)}
        </div>
        <Button onClick={handleEndRotation} variant="secondary" className="bg-secondary hover:bg-secondary/90 text-white">End Rotation</Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {unassignedGroups.map(group => (
          <div
            key={group.id}
            draggable
            onDragStart={e => handleDragStart(e, group)}
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
              onDrop={e => handleDrop(e, center.id)}
              className="p-4 min-h-[200px]"
            >
              <h3 className={`text-4xl text-center font-bold mb-2 ${index % 2 === 0 ? 'text-primary' : 'text-secondary'}`}>
                {center.name}
              </h3>
              <div className="border rounded border-primary/50 flex justify-center items-center p-2 bg-primary-400/20 shadow-sm">
                {editingCenterId === center.id ? (
                  <Input
                    ref={el => detailInputRefs.current[center.id] = el}
                    value={centerDetails[center.id] || ''}
                    onChange={e => handleCenterDetailChange(center.id, e.target.value)}
                    onBlur={handleCenterDetailBlur}
                    placeholder="Enter center details"
                    className=" text-sm focus-visible:ring-0 focus:outline-transparent focus:border-transparent shadow-none"
                  />
                ) : (
                  <p
                    onClick={() => handleCenterDetailClick(center.id)}
                    className={`cursor-text text-center font-semibold tracking-wide ${
                      isDetailsAdded[center.id] ? 'text-primary' : 'text-gray-400'
                    }`}
                  >
                    {centerDetails[center.id] || 'Click to add details'}
                  </p>
                )}
              </div>
              <div className="space-y-2 mt-4">
                {centerAssignments[center.id]?.map(group => (
                  <div
                    key={group.id}
                    draggable
                    onDragStart={e => handleDragStart(e, group)}
                    className="bg-gray-100 p-2 rounded cursor-move flex justify-between items-center text-sm mt-5"
                  >
                    <span className='text-xl font-semibold text-primary'>{group.name}</span>
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
      <Separator/>
        {groups.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {groups.map((group) => (
              <Card key={group.id}>
                <CardContent className="p-4">
                  <h3 className="text-2xl font-semibold text-primary mb-2 text-center underline">{group.name}</h3>
                  <ul className="space-y-1">
                    {group.students
                      .sort((a, b) => {
                        const lastNameA = a.name.split(' ').pop();
                        const lastNameB = b.name.split(' ').pop();
                        return lastNameA.localeCompare(lastNameB);
                      })
                      .map((student) => (
                        <li key={student.id} className="text-gray-600 text-lg">{student.name}</li>
                      ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
    </div>
  )
}

export default RotationsDisplay
