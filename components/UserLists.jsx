"use client"

import { useState, useEffect } from 'react'
import { createList, addItemToList, fetchUserLists, deleteList } from '@/app/actions/userListActions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Check, Trash2 } from 'lucide-react'

function UserLists () {
  const [lists, setLists] = useState([])
  const [newListTitle, setNewListTitle] = useState('')
  const [selectedListId, setSelectedListId] = useState(null)
  const [newItem, setNewItem] = useState('')

  useEffect(() => {
    const fetchLists = async () => {
      const result = await fetchUserLists()
      if (result.success) {
        setLists(result.data)
      } else {
        console.error('Failed to fetch lists:', result.error)
      }
    }

    fetchLists()
  }, [])

  const handleCreateList = async () => {
    if (!newListTitle.trim()) return

    const result = await createList({ title: newListTitle })
    if (result.success) {
      setLists([...lists, result.data])
      setNewListTitle('')
    } else {
      console.error('Failed to create list:', result.error)
    }
  }

  const handleAddItem = async (e) => {
    e.stopPropagation() // Prevent the click event from bubbling up
    if (!newItem.trim() || !selectedListId) return

    const result = await addItemToList(selectedListId, newItem)
    if (result.success) {
      setLists(lists.map(list => 
        list.id === selectedListId ? { ...list, items: result.data.items } : list
      ))
      setNewItem('')
    } else {
      console.error('Failed to add item:', result.error)
    }
  }

  const handleDeleteList = async (listId, e) => {
    e.stopPropagation() // Prevent the click event from bubbling up
    const result = await deleteList(listId)
    if (result.success) {
      setLists(lists.filter(list => list.id !== listId))
      if (selectedListId === listId) {
        setSelectedListId(null) // Deselect the list if it was selected
      }
    } else {
      console.error('Failed to delete list:', result.error)
    }
  }

  const handleSelectList = (list) => {
    if (!selectedListId) {
      setSelectedListId(list.id)
    } else if (selectedListId === list.id) {
      setSelectedListId(null) // Deselect the list if it was already selected
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='text-white transition-colors p-2 hover:bg-white/10 rounded'>My Lists</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-5xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">My Lists</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 mb-4">
          <Input
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            placeholder="New list title"
          />
          <Button onClick={handleCreateList}>Add List</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {lists.map((list) => (
            <div
              key={list.id}
              className="p-4 bg-yellow-200 border border-yellow-300 rounded-lg shadow-md cursor-pointer"
              onClick={() => handleSelectList(list)}
            >
              <div className='flex items-center justify-between'>
                <h3 className="font-bold text-lg">{list.title}</h3>
                <button onClick={(e) => handleDeleteList(list.id, e)} className="text-white">
                  <Trash2 className='text-secondary' />
                </button>
              </div>
              {selectedListId === list.id && (
                <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                  <div className='flex items-center'>
                  <Input
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Add new item"
                    className="bg-white"
                  />
                  <button onClick={handleAddItem} className="ml-2 rounded bg-primary text-white p-1 hover:bg-primary-700 transition-colors"><Check/></button>
                  </div>
                  <ul className="mt-2">
                    {list.items.map((item, index) => (
                      <li key={index} className="text-sm text-gray-700">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UserLists
