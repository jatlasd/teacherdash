"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import FractionDisplay from './FractionDisplay'

const FractionGenerator = () => {
    const [numberSettings, setNumberSettings] = useState({
        maxDenominator: '10', 
        easySimplify: true,
        mixedNumber: false,
        maxWholeNumber: '10',
        improper: false,
        quantity: '1'
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
        const max = parseInt(numberSettings.maxDenominator, 10)
        const quantity = parseInt(numberSettings.quantity, 10)
        const maxWholeNumber = parseInt(numberSettings.maxWholeNumber, 10)
        const numbers = []

        // Create an array of possible whole numbers
        let possibleWholeNumbers = Array.from({ length: maxWholeNumber }, (_, i) => i + 1)

        for (let i = 0; i < quantity; i++) {
            let numerator, denominator, wholeNumber = 0

            do {
                if (numberSettings.easySimplify) {
                    const factors = [2, 3, 4, 5, 6, 8, 10]
                    const factor = factors[Math.floor(Math.random() * factors.length)]
                    denominator = Math.min(Math.floor(Math.random() * (max / factor)) * factor + factor, max)
                    
                    const minNumerator = Math.min(2, denominator - 1)
                    const maxNumerator = Math.max(minNumerator, denominator - 1)
                    
                    numerator = Math.floor(Math.random() * (maxNumerator - minNumerator + 1)) + minNumerator
                    numerator = Math.floor(numerator / factor) * factor
                    if (numerator === 0) numerator = factor
                } else if (numberSettings.improper) {
                    denominator = Math.floor(Math.random() * (max - 1)) + 2
                    numerator = Math.floor(Math.random() * (max * 2 - 2)) + 2
                } else {
                    denominator = Math.floor(Math.random() * (max - 1)) + 2
                    numerator = Math.floor(Math.random() * (denominator - 1)) + 1
                }
            } while (numerator === denominator)

            if (numberSettings.mixedNumber) {
                if (possibleWholeNumbers.length === 0) {
                    possibleWholeNumbers = Array.from({ length: maxWholeNumber }, (_, i) => i + 1)
                }
                const randomIndex = Math.floor(Math.random() * possibleWholeNumbers.length)
                wholeNumber = possibleWholeNumbers[randomIndex]
                possibleWholeNumbers.splice(randomIndex, 1)
            }

            numbers.push({ numerator, denominator, wholeNumber })
        }

        setGeneratedNumbers(numbers)
    }

    const findGCD = (a, b) => {
        return b === 0 ? a : findGCD(b, a % b)
    }

    const formatFraction = (fraction) => {
        if (numberSettings.mixedNumber && fraction.wholeNumber > 0) {
            return (
                <FractionDisplay
                    numerator={fraction.numerator}
                    denominator={fraction.denominator}
                    wholeNumber={fraction.wholeNumber}
                />
            )
        }
        return (
            <FractionDisplay
                numerator={fraction.numerator}
                denominator={fraction.denominator}
            />
        )
    }

    return (
        <Card className="w-full max-w-3xl shadow-lg">
            <CardHeader className="bg-secondary text-white rounded-t-lg">
                <CardTitle className='text-3xl font-bold text-center'>Fraction Generator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className='space-y-2'>
                        <Label htmlFor="maxDenominator" className="text-sm font-medium">Maximum Denominator:</Label>
                        <Input
                            id="maxDenominator"
                            name="maxDenominator"
                            type="text"
                            value={numberSettings.maxDenominator}
                            onChange={handleInputChange}
                            className="border-2 border-gray-300 focus:border-purple-500 rounded-md"
                        />
                    </div>
                    <div className='space-y-2'>
                        <Label htmlFor="quantity" className="text-sm font-medium">Quantity:</Label>
                        <Input
                            id="quantity"
                            name="quantity"
                            type="text"
                            value={numberSettings.quantity}
                            onChange={handleInputChange}
                            className="border-2 border-gray-300 focus:border-purple-500 rounded-md"
                        />
                    </div>
                    <div className='flex justify-between items-center bg-gray-100 p-3 rounded-lg'>
                        <Label htmlFor='easySimplify' className='cursor-pointer font-medium'>Easy Simplify</Label>
                        <Switch
                            id='easySimplify'
                            name='easySimplify'
                            checked={numberSettings.easySimplify}
                            onCheckedChange={(checked) => handleInputChange({ target: { name: 'easySimplify', type: 'checkbox', checked } })}
                            className="data-[state=checked]:bg-primary"
                        />
                    </div>
                    <div className='flex justify-between items-center bg-gray-100 p-3 rounded-lg'>
                        <Label htmlFor='mixedNumber' className='cursor-pointer font-medium'>Mixed Numbers</Label>
                        <Switch
                            id='mixedNumber'
                            name='mixedNumber'
                            checked={numberSettings.mixedNumber}
                            onCheckedChange={(checked) => handleInputChange({ target: { name: 'mixedNumber', type: 'checkbox', checked } })}
                            className="data-[state=checked]:bg-primary"
                        />
                    </div>
                    <div className='flex justify-between items-center bg-gray-100 p-3 rounded-lg'>
                        <Label htmlFor='improper' className='cursor-pointer font-medium'>Improper Fractions</Label>
                        <Switch
                            id='improper'
                            name='improper'
                            checked={numberSettings.improper}
                            onCheckedChange={(checked) => handleInputChange({ target: { name: 'improper', type: 'checkbox', checked } })}
                            className="data-[state=checked]:bg-primary"
                        />
                    </div>
                    {numberSettings.mixedNumber === true && (
                        <div className='space-y-2'>
                            <Label htmlFor="maxWholeNumber" className="text-sm font-medium">Maximum Whole Number:</Label>
                            <Input
                                id="maxWholeNumber"
                                name="maxWholeNumber"
                                type="text"
                                value={numberSettings.maxWholeNumber}
                                onChange={handleInputChange}
                                className="border-2 border-gray-300 focus:border-purple-500 rounded-md"
                            />
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter>
                <Button 
                    onClick={generateNumbers} 
                    className='w-full bg-secondary text-white font-bold py-3 rounded-lg transition-all hover:bg-secondary-600'
                >
                    Generate Fractions
                </Button>
            </CardFooter>

            {generatedNumbers.length > 0 && (
                <CardContent className='mt-4'>
                    <h2 className='text-xl font-semibold mb-2 text-purple-600'>Generated Fractions:</h2>
                    <div className='bg-gray-100 p-4 rounded-md border-2 border-purple-300 flex flex-wrap justify-center items-center'>
                        {generatedNumbers.map((fraction, index) => (
                            <span 
                                key={index} 
                                className={`${index % 2 === 0 ? 'text-primary' : 'text-secondary'} mx-4 my-2`}
                            >
                                {formatFraction(fraction)}
                            </span>
                        ))}
                    </div>
                </CardContent>
            )}
        </Card>
    )
}

export default FractionGenerator