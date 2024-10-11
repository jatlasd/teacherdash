"use client"

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClass } from '@/app/actions/classActions'
import { useRouter } from 'next/navigation'
import { useToast } from "@/hooks/use-toast"

function AddClass({ onClassAdded }) {
  const [open, setOpen] = useState(false)
  const [className, setClassName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    const result = await createClass({ name: className })
    
    setIsLoading(false)
    if (result.success) {
      setClassName('')
      setOpen(false)
      onClassAdded() // Call this function to fetch updated classes
      toast({
        title: "Class created",
        description: "Your new class has been successfully created.",
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to create class",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className=" bg-primary flex items-center justify-center px-4 py-2 text-white rounded hover:bg-primary-700 transition-all">
          <Plus className="mr-2 h-4 w-4" />
          Add Class
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Class</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="className">Class Name</Label>
            <Input
              id="className"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Enter class name"
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full bg-primary rounded hover:bg-primary-700">
            {isLoading ? 'Creating...' : 'Create Class'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddClass