'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  BookOpen, 
  Calendar, 
  FileSpreadsheet, 
  MessageSquare, 
  ChevronLeft,
  Brain,
  UserCheck,
  Radical,
  Calculator,
  Clock
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'


const appCards = [
  { 
    id: 'group-maker', 
    title: 'Group Maker', 
    icon: <Users className="h-8 w-8" />, 
    description: 'Create and manage student groups',
    route: '/groups'
  },
  { 
    id: 'select-student', 
    title: 'Random Student(s) Selector', 
    icon: <UserCheck className="h-8 w-8" />, 
    description: 'Select a student or students at random',
    route: '/select-students'
  },
  { 
    id: 'debate-topic', 
    title: 'Debate Topic Generator', 
    icon: <Brain className="h-8 w-8" />, 
    description: 'Generate a random topic for debate',
    route: '/debate-topic'
  },
  { 
    id: 'number-generator', 
    title: 'Number Generator',  
    icon: <Calculator className="h-8 w-8" />, 
    description: 'An assortment of random number generators',
    route: '/number-generator'
  },
  { 
    id: 'timer', 
    title: 'Timer',  
    icon: <Clock className="h-8 w-8" />, 
    description: 'A simple timer',
    route: '/timer'
  },
]

function Dashboard() {
  const router = useRouter()
  const [selectedApp, setSelectedApp] = useState(null)

  const handleCardClick = (appId) => {
    setSelectedApp(appId)
  }

  const handleBackClick = () => {
    setSelectedApp(null)
  }

  return (
    <div className="min-h-screen">
      
      <main className="container mx-auto p-4">
        {selectedApp ? (
          <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <Button
              onClick={handleBackClick}
              variant="ghost"
              className="mb-4 text-[#4836A1] hover:text-[#372981]">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h2 className="text-2xl font-semibold mb-4 text-[#73B830]">
              {appCards.find(app => app.id === selectedApp)?.title}
            </h2>
            <p>This is a placeholder for the {selectedApp} app content.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {appCards.map((app) => (
              <Card
                key={app.id}
                className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => router.push(app.route)}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="mr-4 text-secondary">{app.icon}</div>
                    <h2 className="text-xl font-semibold text-[#4836A1]">{app.title}</h2>
                  </div>
                  <p className="text-gray-600">{app.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard