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
  const audioRef = useRef(null)

  useEffect(() => {
    audioRef.current = new Audio('/timer-beep.mp3')
    audioRef.current.addEventListener('ended', () => setIsSoundPlaying(false))
    return () => {
      audioRef.current.removeEventListener('ended', () => setIsSoundPlaying(false))
    }
  }, [])

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startTimer = useCallback(() => {
    const minutes = parseInt(inputMinutes, 10) || 0
    const seconds = parseInt(inputSeconds, 10) || 0
    const totalSeconds = minutes * 60 + seconds
    if (totalSeconds > 0) {
      setTime(totalSeconds)
      setIsRunning(true)
      stopSound()
      setInputMinutes('')
      setInputSeconds('')
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
    stopSound()
  }

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsSoundPlaying(false)
    }
  }

  useEffect(() => {
    let interval

    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval)
            setIsRunning(false)
            if (audioRef.current) {
              audioRef.current.play()
              setIsSoundPlaying(true)
            }
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
      <div className="text-4xl font-bold">{formatTime(time)}</div>
      <div className="space-x-2">
        <Button onClick={pauseTimer} disabled={!isRunning}>Pause</Button>
        <Button onClick={stopTimer} disabled={!isRunning && time === 0}>Stop</Button>
        <Button onClick={resetTimer} disabled={!inputMinutes && !inputSeconds && time === 0}>Reset</Button>
        {isSoundPlaying && <Button onClick={stopSound}>Stop Sound</Button>}
      </div>
    </div>
  )
}