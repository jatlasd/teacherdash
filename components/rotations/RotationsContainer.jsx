"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, Edit3 } from 'lucide-react'
import RotationsDisplay from './RotationsDisplay'
import { createCenters, fetchSavedCenters, updateCenters, deleteCenterList } from '@/app/actions/userActions'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const RotationsContainer = () => {
  const [centers, setCenters] = useState([])
  const [newCenter, setNewCenter] = useState('')
  const [isFinalized, setIsFinalized] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedCenters, setSavedCenters] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [centerListTitle, setCenterListTitle] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [currentCenterListId, setCurrentCenterListId] = useState(null)

  useEffect(() => {
    const loadSavedCenters = async () => {
      try {
        const result = await fetchSavedCenters()
        if (result.success) {
          setSavedCenters(result.data)
        } else {
          console.error(result.error)
        }
      } catch (error) {
        console.error('Error fetching saved centers:', error)
      }
    }

    loadSavedCenters()
  }, [])

  const handleAddCenter = () => {
    if (newCenter.trim()) {
      setCenters([...centers, { id: Date.now(), name: newCenter.trim() }])
      setNewCenter('')
    }
  }

  const handleRemoveCenter = (id) => {
    setCenters(centers.filter((center) => center.id !== id))
  }

  const handleSaveOrUpdateCenters = async () => {
    setIsSaving(true)
    try {
      const result = isEditing
        ? await updateCenters(currentCenterListId, centerListTitle, centers)
        : await createCenters(centerListTitle, centers)

      if (result.success) {
        console.log('Centers saved/updated successfully')
        setIsDialogOpen(false)
        setIsEditing(false)
        setCurrentCenterListId(null)
      } else {
        console.error(result.error)
      }
    } catch (error) {
      console.error('Error saving/updating centers:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLoadSavedCenters = (centerList) => {
    setCenters(centerList.centers.map(name => ({ id: Date.now(), name })))
    setCenterListTitle(centerList.name)
    setCurrentCenterListId(centerList.id)
    setIsEditing(true)
  }

  const handleEditCenterName = (centerList) => {
    setCenterListTitle(centerList.name)
    setCurrentCenterListId(centerList.id)
    setIsDialogOpen(true)
    setIsEditing(true)
  }

  const handleClearCenters = () => {
    setCenters([])
    setIsEditing(false)
    setCurrentCenterListId(null)
    setCenterListTitle('')
  }

  const handleDeleteCenterList = async () => {
    try {
      const result = await deleteCenterList(currentCenterListId)
      if (result.success) {
        setSavedCenters(savedCenters.filter(centerList => centerList.id !== currentCenterListId))
        console.log('Center list deleted successfully')
        setIsDialogOpen(false)
        handleClearCenters()
      } else {
        console.error(result.error)
      }
    } catch (error) {
      console.error('Error deleting center list:', error)
    }
  }

  return (
    <div className='container mx-auto p-6 space-y-8'>
      <div className='mb-4'>
        <h2 className='text-2xl font-bold text-primary mb-2'>My Saved Rotations</h2>
        <div className='flex space-x-2'>
          {savedCenters.map((centerList, index) => (
            <div key={index} className='flex items-center space-x-2'>
              <Button
                onClick={() => handleLoadSavedCenters(centerList)}
                className='bg-primary-200 border-2 border-primary-400 hover:bg-primary hover:border-primary'
              >
                {centerList.name}
              </Button>
              <Button
                onClick={() => handleEditCenterName(centerList)}
                variant='ghost'
                size='sm'
              >
                <Edit3 className='h-4 w-4 text-blue-500' />
              </Button>
            </div>
          ))}
        </div>
      </div>
      {!isFinalized ? (
        <Card>
          <CardHeader>
            <CardTitle className='text-2xl font-bold text-primary'>
              Rotation Centers
            </CardTitle>
            <CardDescription>
              Create the list of centers for your rotations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex space-x-2 mb-4'>
              <Input
                value={newCenter}
                onChange={(e) => setNewCenter(e.target.value)}
                placeholder='Enter center name'
                onKeyPress={(e) => e.key === 'Enter' && handleAddCenter()}
              />
              <Button
                onClick={handleAddCenter}
                className='bg-primary hover:bg-primary-700'
              >
                <Plus className='mr-2 h-4 w-4' /> Add Center
              </Button>
            </div>
            {centers.length > 0 && (
              <>
                <Button
                  className='bg-secondary hover:bg-secondary-700 mb-5'
                  onClick={handleClearCenters}
                >
                  Clear All
                </Button>
                <div className='columns-4'>
                  {centers.map((center, index) => (
                    <div
                      key={center.id}
                      className='flex items-center bg-gray-100 rounded p-6'
                    >
                      <span
                        className={`flex-grow text-center text-4xl font-semibold ${
                          index % 2 === 0 ? 'text-primary' : 'text-secondary'
                        }`}
                      >
                        {center.name}
                      </span>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleRemoveCenter(center.id)}
                      >
                        <Trash2 className='h-4 w-4 text-red-500' />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className='w-full flex justify-center space-x-4'>
                  <Button
                    className='bg-primary hover:bg-primary-700 text-xl my-5'
                    size='lg'
                    onClick={() => setIsFinalized(true)}
                  >
                    Finalize Centers
                  </Button>
                  <Button
                    className='bg-green-500 hover:bg-green-700 text-xl my-5'
                    size='lg'
                    onClick={() => setIsDialogOpen(true)}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : isEditing ? 'Update Centers' : 'Save Centers'}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className='flex flex-col space-y-8'>
          <div className='w-full flex justify-center'>
            <Button
              className='bg-secondary hover:bg-secondary-600 mb-5 w-1/12'
              onClick={() => setIsFinalized(false)}
            >
              Reset Centers
            </Button>
          </div>
          <RotationsDisplay centers={centers} />
        </div>
      )}

      {/* Dialog for setting the title */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Title for Centers' : 'Set Title for Centers'}</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <Input
              value={centerListTitle}
              onChange={(e) => setCenterListTitle(e.target.value)}
              placeholder='Enter title for centers'
            />
            <Button
              onClick={handleSaveOrUpdateCenters}
              className='bg-primary hover:bg-primary-700 w-full'
              disabled={!centerListTitle.trim() || isSaving}
            >
              {isSaving ? 'Saving...' : isEditing ? 'Update' : 'Save'}
            </Button>
            {isEditing && (
              <Button
                onClick={handleDeleteCenterList}
                className='bg-red-500 hover:bg-red-700 w-full'
                disabled={isSaving}
              >
                Delete
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default RotationsContainer