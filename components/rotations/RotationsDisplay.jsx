"use client"

import { useState, useEffect } from 'react'

const RotationsDisplay = ({ centers }) => {
    const [time, setTime] = useState("")
    const [classData, setClassData] = useState({
        time: "",
        classes: [],
        selectedClass: null
    })
  return (
    <div className="columns-4">
    {centers.map((center, index) => (
      <div key={center.id} className="flex items-center bg-gray-100 rounded p-6">
        <span className={`flex-grow text-center text-4xl font-semibold ${index % 2 === 0 ? 'text-primary' : 'text-secondary'}`}>
          {center.name}
        </span>
      </div>
    ))}
  </div>
  )
}

export default RotationsDisplay