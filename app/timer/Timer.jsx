'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Timer() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [inputMinutes, setInputMinutes] = useState('')
  const [inputSeconds, setInputSeconds] = useState('')
  const [isSoundPlaying, setIsSoundPlaying] = useState(false)
  const [totalTime, setTotalTime] = useState(0)
  const audioRef = useRef(null)
  const animationRef = useRef(null)
  const startTimeRef = useRef(0)

  useEffect(() => {
    audioRef.current = new Audio('/timer-beep.mp3')
    audioRef.current.addEventListener('ended', () => setIsSoundPlaying(false))
    return () => {
      audioRef.current.removeEventListener('ended', () => setIsSoundPlaying(false))
    }
  }, [])

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = Math.floor(totalSeconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startTimer = useCallback(() => {
    const minutes = parseInt(inputMinutes, 10) || 0
    const seconds = parseInt(inputSeconds, 10) || 0
    const totalSeconds = minutes * 60 + seconds
    if (totalSeconds > 0) {
      setTime(totalSeconds)
      setTotalTime(totalSeconds)
      setIsRunning(true)
      stopSound()
      setInputMinutes('')
      setInputSeconds('')
      startTimeRef.current = Date.now()
      animationRef.current = requestAnimationFrame(updateTimer)
    }
  }, [inputMinutes, inputSeconds])

  const pauseTimer = () => {
    setIsRunning(false)
    cancelAnimationFrame(animationRef.current)
  }

  const stopTimer = () => {
    setIsRunning(false)
    setTime(0)
    setTotalTime(0)
    cancelAnimationFrame(animationRef.current)
  }

  const resetTimer = () => {
    stopTimer()
    setInputMinutes('')
    setInputSeconds('')
    stopSound()
  }

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsSoundPlaying(false)
    }
  }

  const updateTimer = () => {
    const elapsedTime = (Date.now() - startTimeRef.current) / 1000
    const remainingTime = Math.max(totalTime - elapsedTime, 0)

    setTime(remainingTime)

    if (remainingTime > 0 && isRunning) {
      animationRef.current = requestAnimationFrame(updateTimer)
    } else if (remainingTime <= 0) {
      setIsRunning(false)
      if (audioRef.current) {
        audioRef.current.play()
        setIsSoundPlaying(true)
      }
    }
  }

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - ((totalTime - time) * 1000)
      animationRef.current = requestAnimationFrame(updateTimer)
    } else {
      cancelAnimationFrame(animationRef.current)
    }

    return () => cancelAnimationFrame(animationRef.current)
  }, [isRunning, totalTime])

  const calculateCircumference = (radius) => 2 * Math.PI * radius
  const radius = 120
  const circumference = calculateCircumference(radius)
  const progress = totalTime > 0 ? time / totalTime : 1
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <div className="space-y-4 flex flex-col items-center">
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Minutes"
          value={inputMinutes}
          onChange={(e) => setInputMinutes(e.target.value)}
          className="w-24"
        />
        <Input
          type="text"
          placeholder="Seconds"
          value={inputSeconds}
          onChange={(e) => setInputSeconds(e.target.value)}
          className="w-24"
        />
        <Button onClick={startTimer} disabled={isRunning}>Start</Button>
      </div>
      <div className="relative">
        <svg width="250" height="250" viewBox="0 0 250 250">
          <circle
            cx="125"
            cy="125"
            r={radius}
            fill="#f3f4f6"
            stroke="#d1d5db"
            strokeWidth="8"
          />
          <circle
            cx="125"
            cy="125"
            r={radius}
            fill="none"
            stroke="#4836A1"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 125 125)"
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold">
          {formatTime(time)}
        </div>
      </div>
      <div className="space-x-2">
        <Button onClick={pauseTimer} disabled={!isRunning}>Pause</Button>
        <Button onClick={stopTimer} disabled={!isRunning && time === 0}>Stop</Button>
        <Button onClick={resetTimer} disabled={!inputMinutes && !inputSeconds && time === 0}>Reset</Button>
        {isSoundPlaying && <Button onClick={stopSound}>Stop Sound</Button>}
      </div>
    </div>
  )
}