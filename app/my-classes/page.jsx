"use client";

import { useState, useEffect, useCallback } from "react";
import AddClass from "@/components/my-classes/AddClass";
import ClassItem from "@/components/my-classes/ClassItem";
import { deleteClass } from "@/app/actions/classActions";
import { useToast } from "@/hooks/use-toast";

const MyClasses = () => {
  const [classes, setClasses] = useState([]);
  const [update, setUpdate] = useState(false)
  const { toast } = useToast();

  const updateStudents = () => {setUpdate(!update)}

  const fetchClasses = useCallback(async () => {
    try {
      const response = await fetch("/api/classes");
      if (!response.ok) {
        throw new Error("Failed to fetch classes");
      }
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses, update]);

  const handleAddStudent = (classId, newStudents) => {
    setClasses((prevClasses) =>
      prevClasses.map((cls) =>
        cls.id === classId
          ? { ...cls, students: [...cls.students, ...newStudents] }
          : cls
      )
    );
    updateStudents()
  };

  const handleEditStudent = (classId, updatedStudent) => {
    setClasses((prevClasses) =>
      prevClasses.map((cls) =>
        cls.id === classId
          ? {
              ...cls,
              students: cls.students.map((student) =>
                student.id === updatedStudent.id ? updatedStudent : student
              ),
            }
          : cls
      )
    );
  };

  const handleRemoveStudent = (classId, studentId) => {
    setClasses((prevClasses) =>
      prevClasses.map((cls) =>
        cls.id === classId
          ? {
              ...cls,
              students: cls.students.filter(
                (student) => student.id !== studentId
              ),
            }
          : cls
      )
    );
    updateStudents()
  };

  const handleDeleteClass = async (classId) => {
    try {
      const classToDelete = classes.find((cls) => cls.id === classId);
      if (!classToDelete) {
        throw new Error("Class not found");
      }

      const result = await deleteClass(classId);
      if (result.success) {
        setClasses((prevClasses) =>
          prevClasses.filter((cls) => cls.id !== classId)
        );
        toast({
          title: "Class deleted",
          description: `The class "${classToDelete.name}" has been successfully deleted.`,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error deleting class:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete class",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-secondary">My Classes</h1>
        <AddClass onClassAdded={fetchClasses} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <ClassItem
            key={cls.id}
            cls={cls}
            onAddStudent={handleAddStudent}
            onEditStudent={handleEditStudent}
            onRemoveStudent={handleRemoveStudent}
            onDeleteClass={handleDeleteClass}
            updateStudents={updateStudents}
          />
        ))}
      </div>
    </div>
  );
};

export default MyClasses;
