'use client'

import { useState, useRef, useCallback } from 'react'
import * as XLSX from 'xlsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Upload } from 'lucide-react'

function UploadStudentList({ classId, onPreviewStudents, isOpen, onOpenChange }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const { toast } = useToast()

  const processFile = useCallback(async (file) => {
    const reader = new FileReader()

    reader.onload = async (e) => {
      let jsonData
      if (file.name.endsWith('.csv')) {
        // Process CSV file
        const csvData = e.target.result
        jsonData = XLSX.utils.csv_to_sheet(csvData, { header: 1 })
        jsonData = XLSX.utils.sheet_to_json(jsonData, { header: 1 })
      } else {
        // Process Excel file
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      }

      const names = jsonData.slice(1).map(row => {
        const fullName = row[0]
        if (fullName && typeof fullName === 'string') {
          const [lastName, firstName] = fullName.split(',').map(part => part.trim())
          return `${firstName} ${lastName}`
        }
        return null
      }).filter(Boolean)

      try {
        setIsLoading(true)
        onPreviewStudents(names)
        onOpenChange(false)
      } catch (error) {
        console.error('Error processing student list:', error)
        toast({
          title: 'Error',
          description: error.message || 'Failed to process student list',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file)
    } else {
      reader.readAsArrayBuffer(file)
    }
  }, [onPreviewStudents, onOpenChange, toast])

  const handleFileUpload = useCallback((e) => {
    const file = e.target.files[0]
    if (file) {
      processFile(file)
    }
  }, [processFile])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      processFile(file)
    }
  }, [processFile])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Student List</DialogTitle>
        </DialogHeader>
        <div
          className={`flex flex-col items-center justify-center p-6 mt-4 border-2 border-dashed rounded-lg cursor-pointer ${
            isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'
          }`}
          onClick={() => fileInputRef.current.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileUpload}
            ref={fileInputRef}
            className="hidden"
          />
          <Upload className="w-12 h-12 mb-4 text-gray-400" />
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">Excel or CSV files (XLSX, XLS, CSV)</p>
        </div>
        {isLoading && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Processing...
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default UploadStudentList