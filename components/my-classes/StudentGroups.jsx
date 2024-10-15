import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Save, X, Edit2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  createGroup,
  updateGroups,
  deleteGroup,
} from "@/app/actions/classGroupActions";
import { useToast } from "@/hooks/use-toast";

const StudentGroups = ({ cls }) => {
  const [groups, setGroups] = useState([]);
  const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [unassignedStudents, setUnassignedStudents] = useState([]);
  const [originalStudentOrder, setOriginalStudentOrder] = useState([]);
  const [groupAssignments, setGroupAssignments] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredGroupId, setHoveredGroupId] = useState(null);
  const { toast } = useToast();
  const [isEditGroupDialogOpen, setIsEditGroupDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [editedGroupName, setEditedGroupName] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  const fetchGroups = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/classes/${cls.id}/groups`);
      if (!response.ok) {
        throw new Error("Failed to fetch groups");
      }
      const data = await response.json();
      setGroups(data);

      const initialAssignments = {};
      data.forEach((group) => {
        initialAssignments[group.id] = group.students || [];
      });
      setGroupAssignments(initialAssignments);

      const assignedStudentIds = new Set(
        data.flatMap((group) => group.students?.map((s) => s.id) || [])
      );
      const unassigned = cls.students.filter(
        (student) => !assignedStudentIds.has(student.id)
      );
      setUnassignedStudents(unassigned);
      setOriginalStudentOrder(cls.students.map((s) => s.id));
      setHasChanges(false); // Reset changes flag after fetching
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setIsLoading(false);
    }
  }, [cls.id, cls.students]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    try {
      const result = await createGroup({ name: newGroupName, classId: cls.id });
      if (result.success) {
        setNewGroupName("");
        setIsCreateGroupDialogOpen(false);
        fetchGroups();
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const handleDragStart = (e, student) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(student));
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e, groupId) => {
    if (groupId !== "unassigned") {
      setHoveredGroupId(groupId);
    }
  };

  const handleDragLeave = (e, groupId) => {
    if (groupId !== "unassigned" && groupId === hoveredGroupId) {
      setHoveredGroupId(null);
    }
  };

  const handleDrop = (e, groupId) => {
    e.preventDefault();
    const student = JSON.parse(e.dataTransfer.getData("text"));

    setGroupAssignments((prev) => {
      const newAssignments = { ...prev };

      Object.keys(newAssignments).forEach((gId) => {
        newAssignments[gId] = newAssignments[gId].filter(
          (s) => s.id !== student.id
        );
      });

      if (groupId) {
        newAssignments[groupId] = [...(newAssignments[groupId] || []), student];
      }

      return newAssignments;
    });

    setUnassignedStudents((prev) => {
      let updatedUnassigned;
      if (groupId) {
        updatedUnassigned = prev.filter((s) => s.id !== student.id);
      } else {
        updatedUnassigned = prev.some((s) => s.id === student.id)
          ? prev
          : [...prev, student];
      }
      return updatedUnassigned.sort(
        (a, b) =>
          originalStudentOrder.indexOf(a.id) -
          originalStudentOrder.indexOf(b.id)
      );
    });

    setIsDragging(false);
    setHoveredGroupId(null);
    setHasChanges(true); // Set changes flag
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const groupsToUpdate = groups.map((group) => ({
        id: group.id,
        name: group.name,
        students: groupAssignments[group.id] || [],
      }));

      const result = await updateGroups({
        groups: groupsToUpdate,
        classId: cls.id,
      });

      if (result.success) {
        toast({
          title: "Success",
          description: "Groups updated successfully",
        });
        fetchGroups(); // Refresh the groups after saving
        setHasChanges(false); // Reset changes flag after successful save
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error saving group assignments:", error);
      toast({
        title: "Error",
        description: "Failed to save group assignments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveStudent = (groupId, student) => {
    setGroupAssignments((prev) => {
      const newAssignments = { ...prev };
      newAssignments[groupId] = newAssignments[groupId].filter(
        (s) => s.id !== student.id
      );
      return newAssignments;
    });

    setUnassignedStudents((prev) => {
      const updatedUnassigned = [...prev, student];
      return updatedUnassigned.sort(
        (a, b) =>
          originalStudentOrder.indexOf(a.id) -
          originalStudentOrder.indexOf(b.id)
      );
    });

    // Check if we've reverted to the original state
    setTimeout(() => {
      const currentAssignments = { ...groupAssignments };
      currentAssignments[groupId] = currentAssignments[groupId].filter(s => s.id !== student.id);
      
      const isOriginalState = groups.every(group => {
        const currentStudents = currentAssignments[group.id] || [];
        const originalStudents = group.students || [];
        return currentStudents.length === originalStudents.length &&
          currentStudents.every(s => originalStudents.some(os => os.id === s.id));
      });

      setHasChanges(!isOriginalState);
    }, 0);
  };

  const handleEditGroup = (group) => {
    setEditingGroup(group);
    setEditedGroupName(group.name);
    setIsEditGroupDialogOpen(true);
  };

  const handleUpdateGroupName = async (e) => {
    e.preventDefault();
    if (!editedGroupName.trim() || !editingGroup) return;

    try {
      const result = await updateGroup({
        groupId: editingGroup.id,
        newName: editedGroupName,
        students: groupAssignments[editingGroup.id] || [],
        classId: cls.id,
      });
      if (result.success) {
        setGroups((prevGroups) =>
          prevGroups.map((g) =>
            g.id === editingGroup.id ? { ...g, name: editedGroupName } : g
          )
        );
        setIsEditGroupDialogOpen(false);
        toast({
          title: "Success",
          description: "Group name updated successfully",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error updating group name:", error);
      toast({
        title: "Error",
        description: "Failed to update group name",
        variant: "destructive",
      });
    }
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      const result = await deleteGroup(groupId);
      if (result.success) {
        setGroups(groups.filter((group) => group.id !== groupId));
        setGroupAssignments((prev) => {
          const newAssignments = { ...prev };
          delete newAssignments[groupId];
          return newAssignments;
        });
        // Move students from the deleted group back to unassigned
        const deletedGroupStudents = groupAssignments[groupId] || [];
        setUnassignedStudents((prev) =>
          [...prev, ...deletedGroupStudents].sort(
            (a, b) =>
              originalStudentOrder.indexOf(a.id) -
              originalStudentOrder.indexOf(b.id)
          )
        );
        toast({
          title: "Success",
          description: "Group deleted successfully",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error deleting group:", error);
      toast({
        title: "Error",
        description: "Failed to delete group",
        variant: "destructive",
      });
    } finally {
      setDeleteConfirmation(null);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading groups...</div>;
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between mx-5">
        <Button onClick={() => setIsCreateGroupDialogOpen(true)} className="bg-primary hover:bg-primary-700">
          <Plus className="mr-2 h-4 w-4" />
          Create New Group
        </Button>
        <Button onClick={handleSave} disabled={isLoading || !hasChanges} className="bg-primary hover:bg-primary-700">
          <Save className="mr-2 h-4 w-4" />
          Save Assignments
        </Button>
      </div>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <Card className="w-full md:w-1/3 lg:w-3/10">
          <CardHeader>
            <CardTitle>Unassigned Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[60vh] overflow-auto pr-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="space-y-2">
                {unassignedStudents.map((student) => (
                  <div
                    key={student.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, student)}
                    className="p-2 bg-primary/10 rounded cursor-move flex justify-between items-center text-sm"
                  >
                    <span>{student.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <ScrollArea className="h-[60vh] w-full md:w-2/3 lg:w-7/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {groups.map((group) => (
              <Card
                key={group.id}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, group.id)}
                onDragLeave={(e) => handleDragLeave(e, group.id)}
                onDrop={(e) => handleDrop(e, group.id)}
                className={`p-4 ${
                  hoveredGroupId === group.id
                    ? "border-dashed border-2 border-primary"
                    : ""
                }`}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2 border-b mb-5">
                  <CardTitle className="text-primary font-bold text-lg">{group.name}</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditGroup(group)}
                      className="h-8 w-8 p-0 text-primary"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirmation(group)}
                      className="h-8 w-8 p-0 text-secondary"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {groupAssignments[group.id]?.map((student) => (
                    <div
                      key={student.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, student)}
                      className="p-2 mb-2 bg-primary/50 rounded cursor-move flex justify-between items-center text-sm"
                    >
                      <span>{student.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveStudent(group.id, student)}
                        className="h-6 w-6 p-0 ml-1"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      <Dialog
        open={isCreateGroupDialogOpen}
        onOpenChange={setIsCreateGroupDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateGroup}>
            <Input
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Enter group name"
              className="mb-4"
            />
            <DialogFooter>
              <Button type="submit">Create Group</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEditGroupDialogOpen}
        onOpenChange={setIsEditGroupDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Group Name</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateGroupName}>
            <Input
              value={editedGroupName}
              onChange={(e) => setEditedGroupName(e.target.value)}
              placeholder="Enter new group name"
              className="mb-4"
            />
            <DialogFooter>
              <Button type="submit">Update Group Name</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteConfirmation}
        onOpenChange={() => setDeleteConfirmation(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the group "
              {deleteConfirmation?.name}"? This action cannot be undone.
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
              onClick={() => handleDeleteGroup(deleteConfirmation.id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentGroups;