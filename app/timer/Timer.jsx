'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Timer() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [inputMinutes, setInputMinutes] = useState('')
  const [inputSeconds, setInputSeconds] = useState('')

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startTimer = useCallback(() => {
    const minutes = parseInt(inputMinutes) || 0
    const seconds = parseInt(inputSeconds) || 0
    const totalSeconds = minutes * 60 + seconds
    if (totalSeconds > 0) {
      setTime(totalSeconds)
      setIsRunning(true)
    }
  }, [inputMinutes, inputSeconds])

  const pauseTimer = () => setIsRunning(false)

  const stopTimer = () => {
    setIsRunning(false)
    setTime(0)
  }

  const resetTimer = () => {
    stopTimer()
    setInputMinutes('')
    setInputSeconds('')
  }

  useEffect(() => {
    let interval

    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval)
            setIsRunning(false)
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isRunning, time])

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          type="number"
          placeholder="Minutes"
          value={inputMinutes}
          onChange={(e) => setInputMinutes(e.target.value)}
          className="w-24"
          min="0"
        />
        <Input
          type="number"
          placeholder="Seconds"
          value={inputSeconds}
          onChange={(e) => setInputSeconds(e.target.value)}
          className="w-24"
          min="0"
          max="59"
        />
        <Button onClick={startTimer} disabled={isRunning}>Start</Button>
      </div>
      <div className="text-4xl font-bold">{formatTime(time)}</div>
      <div className="space-x-2">
        <Button onClick={pauseTimer} disabled={!isRunning}>Pause</Button>
        <Button onClick={stopTimer} disabled={!isRunning && time === 0}>Stop</Button>
        <Button onClick={resetTimer} disabled={!inputMinutes && !inputSeconds && time === 0}>Reset</Button>
      </div>
    </div>
  )
}