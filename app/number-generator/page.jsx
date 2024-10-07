import NumGenContainer from '@/components/number-generator/NumGenContainer'
import React from 'react'

const NumberGenerator = () => {
  return (
    <div className="container mx-auto p-6 flex flex-col space-y-6">
    <h1 className="text-4xl font-bold text-primary mb-8">Number Generator</h1>
    <div className='w-full flex justify-center'>
    <NumGenContainer/>
    </div>
  </div>
  )
}

export default NumberGenerator