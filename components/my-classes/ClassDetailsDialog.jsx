"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import StudentList from "./StudentList";
import {
  removeStudentFromClass,
  addStudentToClass,
} from "@/app/actions/classActions";
import StudentGroups from "./StudentGroups";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ClassDetailsDialog = ({
  cls,
  isOpen,
  onOpenChange,
  onEditStudent,
  onRemoveStudent,
  onAddStudent,
}) => {
  const [activeTab, setActiveTab] = useState("students");
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [students, setStudents] = useState([]);
  const [sortBy, setSortBy] = useState("lastName");

  useEffect(() => {
    sortStudents();
  }, [cls.students, sortBy]);

  const sortStudents = () => {
    const sortedStudents = [...(cls.students || [])].sort((a, b) => {
      if (sortBy === "lastName") {
        const lastNameA = a.name.split(' ').pop().toLowerCase();
        const lastNameB = b.name.split(' ').pop().toLowerCase();
        return lastNameA.localeCompare(lastNameB);
      } else {
        const firstNameA = a.name.split(' ')[0].toLowerCase();
        const firstNameB = b.name.split(' ')[0].toLowerCase();
        return firstNameA.localeCompare(firstNameB);
      }
    });
    setStudents(sortedStudents);
  };

  const handleRemoveStudent = async (studentId) => {
    setIsDeleting(true);
    try {
      const result = await removeStudentFromClass({
        studentId,
        classId: cls.id,
      });
      if (result.success) {
        setStudents(students.filter((student) => student.id !== studentId));
        setDeleteConfirmation(null);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error removing student:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddStudent = async (newStudentName) => {
    if (!newStudentName.trim()) return;
    try {
      const result = await addStudentToClass({
        name: newStudentName,
        classId: cls.id,
      });
      if (result.success) {
        const updatedStudents = [...students, result.student];
        sortStudents();
        onAddStudent(result.student);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            {cls.name} - Details
          </DialogTitle>
        </DialogHeader>
        <div className="flex space-x-4">
          <Button
            onClick={() => setActiveTab("students")}
            variant={activeTab === "students" ? "default" : "outline"}
            className={
              activeTab === "students"
                ? "bg-primary hover:bg-primary-700 border-0 text-white"
                : "text-primary hover:text-primary-700"
            }
          >
            Students
          </Button>
          <Button
            onClick={() => setActiveTab("groups")}
            variant={activeTab === "groups" ? "default" : "outline"}
            className={
              activeTab === "groups"
                ? "bg-primary hover:bg-primary-700 border-0 text-white"
                : "text-primary hover:text-primary-700"
            }
          >
            Groups
          </Button>
        </div>
        {activeTab === "students" && (
          <>
            <div className="flex justify-end">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lastName">Sort by Last Name</SelectItem>
                  <SelectItem value="firstName">Sort by First Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <StudentList
              cls={{ ...cls, students }}
              onEditStudent={onEditStudent}
              onRemoveStudent={handleRemoveStudent}
              onAddStudent={handleAddStudent}
              onDeleteConfirmation={setDeleteConfirmation}
            />
          </>
        )}
        {activeTab === "groups" && (
          <div>
            <StudentGroups cls={cls} />
          </div>
        )}
      </DialogContent>

      <Dialog
        open={!!deleteConfirmation}
        onOpenChange={() => setDeleteConfirmation(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {deleteConfirmation?.name} from
              this class?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmation(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleRemoveStudent(deleteConfirmation.id)}
              disabled={isDeleting}
            >
              {isDeleting ? "Removing..." : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default ClassDetailsDialog;
