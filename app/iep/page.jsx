"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ClipboardCopy, Copy } from "lucide-react"
import CustomTooltip from "@/components/CustomTooltip"
import { templates } from './templates'
import { predefinedOptions } from './options'

const CustomInput = ({ value, onChange, onSubmit, placeholder }) => (
  <div className="flex gap-2">
    <Input
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
    />
    <Button onClick={onSubmit}>Add</Button>
  </div>
)

const SelectField = ({ label, value, options = [], onChange, customValue, onCustomChange, onCustomSubmit, showCustomInput }) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
      </SelectTrigger>
      <SelectContent>
        {options.map(option => (
          <SelectItem key={option} value={option}>{option}</SelectItem>
        ))}
        <SelectItem value="add_new">+ Add New</SelectItem>
      </SelectContent>
    </Select>
    {showCustomInput && (
      <CustomInput
        value={customValue}
        onChange={onCustomChange}
        onSubmit={onCustomSubmit}
        placeholder={`Enter custom ${label.toLowerCase()}`}
      />
    )}
  </div>
)

const MultiSelectField = ({ label, value, options, onChange, customValue, onCustomChange, onCustomSubmit, showCustomInput }) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
      <div className="space-y-2">
        {options.map(option => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={`${label}-${option}`}
              checked={value.includes(option)}
              onCheckedChange={(checked) => {
                onChange(checked ? [...value, option] : value.filter(v => v !== option))
              }}
            />
            <Label htmlFor={`${label}-${option}`}>{option}</Label>
          </div>
        ))}
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`${label}-add-new`}
            checked={showCustomInput}
            onCheckedChange={(checked) => onCustomChange(checked)}
          />
          <Label htmlFor={`${label}-add-new`}>+ Add New</Label>
        </div>
      </div>
    </ScrollArea>
    {showCustomInput && (
      <CustomInput
        value={customValue}
        onChange={(e) => onCustomChange(e.target.value)}
        onSubmit={onCustomSubmit}
        placeholder={`Add custom ${label.toLowerCase()}`}
      />
    )}
  </div>
)

const TemplateButtons = ({ selectedTemplate, onSelect }) => {
  const categories = {
    'Doing Well': ['resilient_learner', 'independent_worker', 'quiet_achiever'],
    'Neutral': ['social_learner', 'hardworking_social', 'quiet_listener', 'creative_distracted'],
    'Struggling': ['struggling_learner', 'self_advocating', 'distracted_social']
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Quick Templates</h2>
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(categories).map(([category, templateKeys]) => (
          <div key={category} className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">{category}</h3>
            <div className="flex flex-col gap-2">
              {templateKeys.map(key => (
                <CustomTooltip 
                  key={key} 
                  content={templates[key].description || templates[key].label}
                >
                  <Button
                    onClick={() => onSelect(key)}
                    variant={selectedTemplate === key ? 'default' : 'outline'}
                    className="w-full justify-start"
                  >
                    {templates[key].label}
                  </Button>
                </CustomTooltip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const GeneratedParagraph = ({ paragraph, onParagraphChange }) => {
  const plainText = paragraph.replace(/<[^>]*>/g, '')
  
  const handleTextChange = (e) => {
    const newText = e.target.value
    const formattedText = newText.replace(/(Name|Grade|Setting|Subject|Progress|Work Style|Help-Seeking Behavior|Personality|Distractibility|Redirection Behavior|Focus Behavior|Strengths|Assessment Accommodations|Supports|Class Presence)/g, 
      '<span class="font-semibold text-red-500 underline bg-yellow-200 px-1">$1</span>'
    )
    onParagraphChange(formattedText)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(plainText)
  }

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Generated Paragraph</CardTitle>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleCopy}
          className="h-8 w-8 border group"
        >
          <Copy className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: paragraph }} />
          <div className="space-y-2">
            <Label>Edit Paragraph</Label>
            <textarea
              className="w-full min-h-[200px] p-4 border rounded-md"
              value={plainText}
              onChange={handleTextChange}
            />
          </div>
        </div>
        <style jsx>{`
          .missing {
            color: #ef4444;
            font-weight: bold;
          }
        `}</style>
      </CardContent>
    </Card>
  )
}

const IEP = () => {
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    grade: '',
    setting: '',
    subject: '',
    progress: 'making satisfactory progress',
    motivated: true,
    participates: true,
    workStyle: 'works diligently but struggles with some of the concepts taught in class',
    helpseeking: 'will ask for help when they do not understand a question',
    personality: 'has a great sense of humor and maintains positive relationships with staff and students alike',
    distractibility: 'at times is easily distracted',
    redirection: 'will return to the task at hand and put forth their best effort',
    focusBehavior: 'maintains focus, asks questions, and puts forth their best effort',
    strengths: ['following directions', 'asking questions without being prompted', 'classwork completion'],
    assessments: ['taking modified assessments'],
    supports: ['study guides', 'calculators', 'work examples', 'retest', 'additional time for the completion of the assessment'],
    classPresence: 'a pleasure to have in class',
    pronouns: 'he/him'
  })

  const [customEntries, setCustomEntries] = useState({})
  const [showCustomInputs, setShowCustomInputs] = useState({})
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [editedParagraph, setEditedParagraph] = useState('')

  const handleChange = (value, field) => {
    if (value === "add_new") {
      setShowCustomInputs(prev => ({ ...prev, [field]: true }))
    } else {
      setStudentInfo(prev => ({ ...prev, [field]: value }))
      setShowCustomInputs(prev => ({ ...prev, [field]: false }))
    }
  }

  const handleCustomChange = (field, value) => {
    setCustomEntries(prev => ({ ...prev, [field]: value }))
  }

  const handleCustomSubmit = (field) => {
    if (customEntries[field]?.trim()) {
      setStudentInfo(prev => ({ ...prev, [field]: customEntries[field] }))
      setShowCustomInputs(prev => ({ ...prev, [field]: false }))
      setCustomEntries(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleMultiSelectCustomSubmit = (field) => {
    if (customEntries[field]?.trim()) {
      setStudentInfo(prev => ({
        ...prev,
        [field]: [...prev[field], customEntries[field]]
      }))
      setShowCustomInputs(prev => ({ ...prev, [field]: false }))
      setCustomEntries(prev => ({ ...prev, [field]: '' }))
    }
  }

  const loadTemplate = (templateName) => {
    if (templates[templateName]) {
      setStudentInfo(prev => ({
        ...prev,
        ...templates[templateName].values
      }))
      setSelectedTemplate(templateName)
    }
  }

  const generateParagraph = () => {
    const p = getPronouns()
    const missing = (text) => `<span class="font-semibold text-red-500 underline bg-yellow-200 px-1">${text}</span>`
    
    const getValue = (field, defaultText) => studentInfo[field] || missing(defaultText)
    const getArrayValue = (field, defaultText) => 
      studentInfo[field]?.length ? studentInfo[field].join(', ') : missing(defaultText)

    return `${getValue('name', 'Name')} is ${studentInfo.grade === "8th Grade" ? "an" : "a"} ${getValue('grade', 'Grade')} student participating in a ${getValue('setting', 'Setting')}. In ${getValue('subject', 'Subject')} class, ${getValue('name', 'Name')} is ${getValue('progress', 'Progress')}. ${getValue('name', 'Name')} ${studentInfo.motivated ? 'seems motivated to do well in the class' : 'seems unmotivated in class'} and ${studentInfo.participates ? 'does participate in class' : 'seldom participates in class discussions and activities'}. During independent work ${getValue('name', 'Name')} ${getValue('workStyle', 'Work Style')}, and ${getValue('helpseeking', 'Help-Seeking Behavior')}. ${getValue('name', 'Name')} ${getValue('personality', 'Personality')}, but ${getValue('distractibility', 'Distractibility')}. When redirected, ${p.subject} ${getValue('redirection', 'Redirection Behavior')}. ${getValue('name', 'Name')}'s motivation to do well is evident when ${p.subject} does not fully understand the skills being practiced. In these situations, ${getValue('name', 'Name')} ${getValue('focusBehavior', 'Focus Behavior')}. ${getValue('name', 'Name')}'s strengths include, but are not limited to: ${getArrayValue('strengths', 'Strengths')}. When completing most assessments, ${getValue('name', 'Name')} benefits from ${getArrayValue('assessments', 'Assessment Accommodations')}. Additional supports for this class include but are not limited to ${getArrayValue('supports', 'Supports')}. In addition, ${getValue('name', 'Name')} is ${getValue('classPresence', 'Class Presence')}.`
  }

  const getPronouns = () => {
    const [subject, object] = studentInfo.pronouns.split('/')
    return { 
      subject, 
      object, 
      possessive: subject === 'he' ? 'his' : subject === 'she' ? 'her' : 'their' 
    }
  }

  const handleParagraphChange = (newParagraph) => {
    setEditedParagraph(newParagraph)
  }

  return (
    <div className="container mx-auto p-6 flex flex-col space-y-6 max-w-6xl">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-primary mb-4">PLAAFP Generator</h1>
        <p className="text-lg text-gray-600">
          Generate professional PLAAFP statements for your students
        </p>
      </div>
      
      <TemplateButtons selectedTemplate={selectedTemplate} onSelect={loadTemplate} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {['name', 'grade', 'setting', 'subject', 'progress'].map(field => (
              <SelectField
                key={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                value={studentInfo[field]}
                options={field === 'grade' ? ['6th Grade', '7th Grade', '8th Grade'] : predefinedOptions[field]}
                onChange={(value) => handleChange(value, field)}
                customValue={customEntries[field]}
                onCustomChange={(e) => handleCustomChange(field, e.target.value)}
                onCustomSubmit={() => handleCustomSubmit(field)}
                showCustomInput={showCustomInputs[field]}
              />
            ))}
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="motivated"
                checked={studentInfo.motivated}
                onCheckedChange={(checked) => setStudentInfo(prev => ({ ...prev, motivated: checked }))}
              />
              <Label htmlFor="motivated">Motivated to do well</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="participates"
                checked={studentInfo.participates}
                onCheckedChange={(checked) => setStudentInfo(prev => ({ ...prev, participates: checked }))}
              />
              <Label htmlFor="participates">Participates in class</Label>
            </div>
            
            {['workStyle', 'helpseeking'].map(field => (
              <SelectField
                key={field}
                label={field === 'workStyle' ? 'Work Style' : 'Help-Seeking Behavior'}
                value={studentInfo[field]}
                options={predefinedOptions[field]}
                onChange={(value) => handleChange(value, field)}
                customValue={customEntries[field]}
                onCustomChange={(e) => handleCustomChange(field, e.target.value)}
                onCustomSubmit={() => handleCustomSubmit(field)}
                showCustomInput={showCustomInputs[field]}
              />
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {['personality', 'distractibility', 'redirection', 'focusBehavior'].map(field => (
              <SelectField
                key={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                value={studentInfo[field]}
                options={predefinedOptions[field]}
                onChange={(value) => handleChange(value, field)}
                customValue={customEntries[field]}
                onCustomChange={(e) => handleCustomChange(field, e.target.value)}
                onCustomSubmit={() => handleCustomSubmit(field)}
                showCustomInput={showCustomInputs[field]}
              />
            ))}
            
            {['strengths', 'assessments', 'supports'].map(field => (
              <MultiSelectField
                key={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                value={studentInfo[field]}
                options={predefinedOptions[field]}
                onChange={(value) => setStudentInfo(prev => ({ ...prev, [field]: value }))}
                customValue={customEntries[field]}
                onCustomChange={(value) => {
                  if (typeof value === 'boolean') {
                    setShowCustomInputs(prev => ({ ...prev, [field]: value }))
                  } else {
                    handleCustomChange(field, value)
                  }
                }}
                onCustomSubmit={() => handleMultiSelectCustomSubmit(field)}
                showCustomInput={showCustomInputs[field]}
              />
            ))}
            
            <SelectField
              label="Class Presence"
              value={studentInfo.classPresence}
              options={predefinedOptions.classPresence}
              onChange={(value) => handleChange(value, 'classPresence')}
              customValue={customEntries.classPresence}
              onCustomChange={(e) => handleCustomChange('classPresence', e.target.value)}
              onCustomSubmit={() => handleCustomSubmit('classPresence')}
              showCustomInput={showCustomInputs.classPresence}
            />
            
            <div className="space-y-2">
              <Label>Pronouns</Label>
              <Select value={studentInfo.pronouns} onValueChange={(value) => handleChange(value, 'pronouns')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pronouns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="he/him">he/him</SelectItem>
                  <SelectItem value="she/her">she/her</SelectItem>
                  <SelectItem value="they/them">they/them</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <GeneratedParagraph 
        paragraph={editedParagraph || generateParagraph()} 
        onParagraphChange={handleParagraphChange}
      />
    </div>
  )
}

export default IEP