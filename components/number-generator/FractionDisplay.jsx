import React from 'react'

function FractionDisplay({ numerator, denominator, wholeNumber }) {
  return (
    <div className="inline-flex items-center mx-1">
      {wholeNumber > 0 && (
        <span className="mr-1 text-4xl">{wholeNumber}</span>
      )}
      <div className="flex flex-col items-center">
        <div className="text-2xl">{numerator}</div>
        <div className="w-full h-0.5 bg-current"></div>
        <div className="text-2xl">{denominator}</div>
      </div>
    </div>
  )
}

export default FractionDisplay