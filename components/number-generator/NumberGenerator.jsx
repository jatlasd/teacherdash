'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'

function NumberGenerator() {
  const [numberSettings, setNumberSettings] = useState({
    min: '1',
    max: '100',
    includeDecimals: false,
    decimalPlaces: '2',
    quantity: '1',
  })
  const [generatedNumbers, setGeneratedNumbers] = useState([])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setNumberSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const generateNumbers = () => {
    const min = parseFloat(numberSettings.min)
    const max = parseFloat(numberSettings.max)
    const quantity = parseInt(numberSettings.quantity, 10)
    const decimalPlaces = parseInt(numberSettings.decimalPlaces, 10)

    const numbers = []
    for (let i = 0; i < quantity; i++) {
      let randomNumber = Math.random() * (max - min) + min

      if (numberSettings.includeDecimals) {
        randomNumber = randomNumber.toFixed(decimalPlaces)
      } else {
        randomNumber = Math.floor(randomNumber)
      }

      numbers.push(Number(randomNumber))
    }
    setGeneratedNumbers(numbers)
  }

  return (
    <Card className='w-full max-w-3xl shadow-lg'>
      <CardHeader className="bg-secondary text-white rounded-t-lg">
        <CardTitle className='text-3xl font-bold text-center'>Random Number Generator</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6 p-6'>
        <div className='grid grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <Label htmlFor='min' className="text-sm font-medium">Minimum:</Label>
            <Input
              id='min'
              name='min'
              type='text'
              value={numberSettings.min}
              onChange={handleInputChange}
              className="border-2 border-gray-300 focus:border-purple-500 rounded-md"
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='max' className="text-sm font-medium">Maximum:</Label>
            <Input
              id='max'
              name='max'
              type='text'
              value={numberSettings.max}
              onChange={handleInputChange}
              className="border-2 border-gray-300 focus:border-purple-500 rounded-md"
            />
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='quantity' className="text-sm font-medium">Quantity:</Label>
          <Input
            id='quantity'
            name='quantity'
            type='text'
            value={numberSettings.quantity}
            onChange={handleInputChange}
            className="border-2 border-gray-300 focus:border-purple-500 rounded-md"
          />
        </div>

        <div className='flex justify-between items-center bg-gray-100 p-3 rounded-lg'>
          <Label htmlFor='includeDecimals' className='cursor-pointer font-medium'>Include Decimals</Label>
          <Switch
            id='includeDecimals'
            name='includeDecimals'
            checked={numberSettings.includeDecimals}
            onCheckedChange={(checked) => handleInputChange({ target: { name: 'includeDecimals', type: 'checkbox', checked } })}
            className="data-[state=checked]:bg-primary"
          />
        </div>

        {numberSettings.includeDecimals && (
          <div className='space-y-2'>
            <Label htmlFor='decimalPlaces' className="text-sm font-medium">Decimal Places:</Label>
            <Input
              id='decimalPlaces'
              name='decimalPlaces'
              type='text'
              value={numberSettings.decimalPlaces}
              onChange={handleInputChange}
              className="border-2 border-gray-300 focus:border-purple-500 rounded-md"
            />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={generateNumbers} className='w-full bg-secondary text-white font-bold py-3 rounded-lg transition-all hover:bg-secondary-600'>Generate Numbers</Button>
      </CardFooter>

      {generatedNumbers.length > 0 && (
        <CardContent className='mt-4'>
          <h2 className='text-xl font-semibold mb-2 text-purple-600'>Generated Numbers:</h2>
          <div className='bg-gray-100 p-4 rounded-md max-h-40 overflow-y-auto border-2 border-purple-300 text-center'>
            {generatedNumbers.map((number, index) => (
              <span key={index} className={`text-6xl ${index % 2 === 0 ? 'text-primary' : 'text-secondary'}`}>
                {number}
                {index < generatedNumbers.length - 1 && ', '}
              </span>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export default NumberGenerator