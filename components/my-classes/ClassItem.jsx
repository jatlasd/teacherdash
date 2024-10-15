"use client";

import { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  UserPlus,
  Trash2,
  Users,
  Eye,
  Plus,
  Minus,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { addMultipleStudentsToClass } from "@/app/actions/classActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ClassDetailsDialog from "./ClassDetailsDialog";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import UploadStudentList from './UploadStudentList'

function ClassItem({
  cls,
  onAddStudent,
  onEditStudent,
  onRemoveStudent,
  onDeleteClass,
  updateStudents
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isClassDetailsOpen, setIsClassDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [studentInputs, setStudentInputs] = useState([{ name: "" }]);
  const inputRefs = useRef([]);
  const { toast } = useToast();
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false)
  const [previewStudents, setPreviewStudents] = useState([])

  const handleAddStudentInput = () => {
    setStudentInputs([...studentInputs, { name: "" }]);
  };

  useEffect(() => {
    const lastIndex = studentInputs.length - 1;
    if (inputRefs.current[lastIndex]) {
      inputRefs.current[lastIndex].focus();
    }
  }, [studentInputs.length]);

  const handleRemoveStudentInput = (index) => {
    const newInputs = studentInputs.filter((_, i) => i !== index);
    setStudentInputs(newInputs);
  };

  const handleStudentNameChange = (index, value) => {
    const newInputs = [...studentInputs];
    newInputs[index].name = value;
    setStudentInputs(newInputs);
  };

  const handlePreviewStudents = (names) => {
    setPreviewStudents(names.map(name => ({ name })))
    setStudentInputs(names.map(name => ({ name })))
    setIsAddStudentOpen(true)
  }

  const handleAddStudents = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const names = studentInputs
      .map((input) => input.name.trim())
      .filter((name) => name !== "");

    try {
      const result = await addMultipleStudentsToClass({
        classId: cls.id,
        names,
      });

      if (result.success) {
        onAddStudent(cls.id, result.data);
        setStudentInputs([{ name: "" }]);
        setPreviewStudents([])
        setIsAddStudentOpen(false);
        toast({
          title: "Students added",
          description: `Successfully added ${result.data.length} student(s) to the class.`,
        });
        updateStudents()
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error adding students:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add students",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveStudent = (studentId) => {
    onRemoveStudent(cls.id, studentId);
    updateStudents()
  };

  const handleAddStudent = (classId, newStudent) => {
    if (classId === cls.id) {
      cls.students.push(newStudent) // Update the class's student list
    }
    updateStudents()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold text-primary">
          {cls.name}
        </CardTitle>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setIsClassDetailsOpen(true)}>
              <Eye className="mr-2 h-4 w-4" />
              View Class
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setIsAddStudentOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Student
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setIsFileUploadOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Student List
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDeleteClass(cls.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Class
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        {cls.students.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No students yet. Add your first student!
          </p>
        ) : (
          <>
            <div className="text-2xl font-bold text-primary">
              {cls.students.length}
            </div>
            <p className="text-xs text-muted-foreground">
              <Users className="mr-1 h-4 w-4 inline" />
              {cls.students.length === 1 ? "Student" : "Students"}
            </p>
          </>
        )}
      </CardContent>

      <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {previewStudents.length > 0 ? 'Preview and Edit Students' : `Add New Student(s) to ${cls.name}`}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleAddStudents}
            className="flex flex-col flex-grow"
          >
            <ScrollArea className="flex-grow pr-4 mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({
                  length: Math.ceil(studentInputs.length / 7),
                }).map((_, colIndex) => (
                  <div key={colIndex} className="space-y-4">
                    {studentInputs
                      .slice(colIndex * 7, (colIndex + 1) * 7)
                      .map((input, index) => {
                        const actualIndex = colIndex * 7 + index;
                        const isLastInput =
                          actualIndex === studentInputs.length - 1;
                        return (
                          <div
                            key={actualIndex}
                            className="flex items-center space-x-2"
                          >
                            <Input
                              ref={(el) =>
                                (inputRefs.current[actualIndex] = el)
                              }
                              value={input.name}
                              onChange={(e) =>
                                handleStudentNameChange(
                                  actualIndex,
                                  e.target.value
                                )
                              }
                              placeholder={`Student ${actualIndex + 1} name`}
                              className="mx-1 my-px"
                            />
                            {isLastInput ? (
                              <Button
                                type="button"
                                size="icon"
                                onClick={handleAddStudentInput}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                size="icon"
                                variant="destructive"
                                onClick={() =>
                                  handleRemoveStudentInput(actualIndex)
                                }
                                className="bg-secondary hover:bg-secondary-600"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        );
                      })}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary rounded hover:bg-primary-700"
            >
              {isLoading ? "Adding..." : "Add Student(s)"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <UploadStudentList
        classId={cls.id}
        onPreviewStudents={handlePreviewStudents}
        isOpen={isFileUploadOpen}
        onOpenChange={setIsFileUploadOpen}
      />

      <ClassDetailsDialog
        cls={cls}
        isOpen={isClassDetailsOpen}
        onOpenChange={setIsClassDetailsOpen}
        onEditStudent={(updatedStudent) =>
          onEditStudent(cls.id, updatedStudent)
        }
        onRemoveStudent={handleRemoveStudent}
        onAddStudent={handleAddStudent}
      />
    </Card>
  );
}

export default ClassItem;
