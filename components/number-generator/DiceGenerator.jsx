"use client"

import { useState } from 'react'
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const DiceGenerator = () => {
  const [dice, setDice] = useState([1, 1])

  const diceIcons = {
    1: Dice1,
    2: Dice2,
    3: Dice3,
    4: Dice4,
    5: Dice5,
    6: Dice6
  }

  const rollDice = () => {
    setDice([
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1
    ])
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="!bg-secondary text-white rounded-t-lg">
        <CardTitle className="text-3xl font-bold text-center">Dice Roller</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="flex justify-center space-x-4">
          {dice.map((value, index) => {
            const DiceIcon = diceIcons[value]
            return <DiceIcon key={index} className="w-24 h-24 text-primary" />
          })}
        </div>

        <Button 
          onClick={rollDice} 
          className="w-full bg-secondary text-white font-bold py-3 rounded-lg transition-all hover:bg-secondary-600"
        >
          Roll Dice
        </Button>
      </CardContent>
    </Card>
  )
}

export default DiceGenerator