"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { shuffle } from "@/lib/utils";
import { useEffect, useState } from "react";

const Groups = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [absentStudents, setAbsentStudents] = useState(new Set());
  const [groupingMethod, setGroupingMethod] = useState(null);
  const [groups, setGroups] = useState([]);
  const [activeStep, setActiveStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/classes");
      if (!response.ok) {
        throw new Error("Failed to fetch classes");
      }
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleClassSelect = (cls) => {
    setSelectedClass(cls);
    setActiveStep(2);
    setAbsentStudents(new Set());
    setGroups([]);
    setGroupingMethod(null);
  };

  const handleStudentAbsence = (studentId) => {
    setAbsentStudents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  const handleContinueToGrouping = () => {
    setActiveStep(3);
  };

  const handleGroupingMethodSelect = (method) => {
    setGroupingMethod(method);
    setActiveStep(4);
    setGroups([]);
  };

  const generateGroups = () => {
    if (!selectedClass || !groupingMethod) return;

    const presentStudents = selectedClass.students.filter(
      (student) => !absentStudents.has(student.id)
    );
    const shuffledStudents = shuffle(presentStudents);
    const groupSize =
      groupingMethod === "partners" ? 2 : groupingMethod === "threes" ? 3 : 4;
    const newGroups = [];

    while (shuffledStudents.length > 0) {
      const group = shuffledStudents.splice(0, groupSize);
      newGroups.push(group);
    }

    if (shuffledStudents.length > 0) {
      shuffledStudents.forEach((student, index) => {
        newGroups[index % newGroups.length].push(student);
      });
    }

    setGroups(newGroups);
  };

  const shuffleGroups = () => {
    const allStudents = groups.flat();
    const shuffledStudents = shuffle(allStudents);
    const newGroups = [];

    const groupSize =
      groupingMethod === "partners" ? 2 : groupingMethod === "threes" ? 3 : 4;

    while (shuffledStudents.length > 0) {
      const group = shuffledStudents.splice(0, groupSize);
      newGroups.push(group);
    }

    if (shuffledStudents.length > 0) {
      shuffledStudents.forEach((student, index) => {
        newGroups[index % newGroups.length].push(student);
      });
    }

    setGroups(newGroups);
  };

  const getStepStyle = (step) => {
    if (step === activeStep) return "bg-primary text-white";
    if (step < activeStep) return "bg-secondary text-white";
    return "bg-gray-200 text-gray-500";
  };

  const getContentStyle = (step) => {
    if (step > activeStep) return "opacity-50 pointer-events-none";
    return "";
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 flex flex-col space-y-6">
      <h1 className="text-4xl font-bold text-primary mb-8">Group Maker</h1>

      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 flex items-start">
            <div
              className={`rounded-full w-12 h-12 flex items-center justify-center mr-4 ${getStepStyle(
                1
              )}`}
            >
              <span className="text-2xl font-bold">1</span>
            </div>
            <div className={`flex-grow ${getContentStyle(1)}`}>
              <h2 className="text-2xl font-semibold mb-4">Select Class</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {classes.map((cls) => (
                  <Button
                    key={cls.id}
                    onClick={() => handleClassSelect(cls)}
                    variant="outline"
                    className={`h-auto py-2 justify-start ${
                      selectedClass?.id === cls.id
                        ? "bg-primary-100 text-primary-600 border-primary-300"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {cls.name}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-start">
            <div
              className={`rounded-full w-12 h-12 flex items-center justify-center mr-4 ${getStepStyle(
                2
              )}`}
            >
              <span className="text-2xl font-bold">2</span>
            </div>
            <div className={`flex-grow ${getContentStyle(2)}`}>
              <h2 className="text-2xl font-semibold mb-2">
                Today's Attendance
              </h2>
              <p className="mb-4 text-gray-500">
                Click the checkbox next to absent students
              </p>
              {selectedClass && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedClass.students.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`student-${student.id}`}
                          checked={absentStudents.has(student.id)}
                          onCheckedChange={() =>
                            handleStudentAbsence(student.id)
                          }
                        />
                        <label
                          htmlFor={`student-${student.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {student.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={handleContinueToGrouping}
                    className="mt-4"
                    variant="outline"
                  >
                    Continue
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-start">
            <div
              className={`rounded-full w-12 h-12 flex items-center justify-center mr-4 ${getStepStyle(
                3
              )}`}
            >
              <span className="text-2xl font-bold">3</span>
            </div>
            <div className={`flex-grow ${getContentStyle(3)}`}>
              <h2 className="text-2xl font-semibold mb-4">
                Select Grouping Method
              </h2>
              <div className="flex flex-wrap gap-4">
                {["partners", "threes", "fours"].map((method) => (
                  <Button
                    key={method}
                    onClick={() => handleGroupingMethodSelect(method)}
                    variant="outline"
                    disabled={!selectedClass}
                    className={`h-auto py-2 ${
                      groupingMethod === method
                        ? "bg-primary-100 text-primary-600 border-primary-300"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {method === "partners"
                      ? "Partners"
                      : `Groups of ${method === "threes" ? "3" : "4"}`}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-start">
            <div
              className={`rounded-full w-12 h-12 flex items-center justify-center mr-4 ${getStepStyle(
                4
              )}`}
            >
              <span className="text-2xl font-bold">4</span>
            </div>
            <div className={`flex-grow ${getContentStyle(4)}`}>
              <h2 className="text-2xl font-semibold mb-4">Generate Groups</h2>
              <div className="flex space-x-4">
                <Button
                  onClick={generateGroups}
                  disabled={!groupingMethod || !selectedClass}
                  variant="outline"
                >
                  Generate Groups
                </Button>
                <Button
                  onClick={shuffleGroups}
                  disabled={groups.length === 0}
                  variant="outline"
                >
                  Shuffle Groups
                </Button>
              </div>
              {groups.length > 0 && (
                <div className="mt-6 space-y-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Generated Groups
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map((group, index) => (
                      <Card key={index} className="overflow-hidden max-w-xs">
                        <CardContent className="p-0">
                          <div className="bg-primary text-white py-2 px-4">
                            <h4 className="text-lg font-semibold">
                              Group {index + 1}
                            </h4>
                          </div>
                          <ul className="divide-y divide-gray-200">
                            {group.map((student) => (
                              <li
                                key={student.id}
                                className="py-3 px-4 flex items-center"
                              >
                                <div className="bg-secondary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                                  {student.name.charAt(0).toUpperCase()}
                                </div>
                                <span>{student.name}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Groups;
