"use client";

import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { editTodo, deleteTodo } from "@/app/actions/todoActions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const TodoItem = ({ todo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.todo);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleCheckboxClick = async () => {
    const result = await editTodo({ id: todo.id, completed: !todo.completed });
    if (result.success) {
      onUpdate(result.data);
    }
  };

  const handleEdit = async () => {
    if (isEditing) {
      const result = await editTodo({ id: todo.id, todo: editedText });
      if (result.success) {
        onUpdate(result.data);
        setIsEditing(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleDelete = async () => {
    const result = await deleteTodo({ id: todo.id });
    if (result.success) {
      onDelete(todo.id);
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={handleCheckboxClick}
      />
      {isEditing ? (
        <input
          type="text"
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          className="flex-grow p-1 border rounded"
        />
      ) : (
        <span
          className={`flex-grow ${
            todo.completed ? "line-through text-gray-400" : ""
          }`}
        >
          {todo.todo}
        </span>
      )}
      <Button size="icon" variant="ghost" onClick={handleEdit}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogTrigger asChild>
          <Button size="icon" variant="ghost">
            <Trash2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this todo?
            </DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TodoItem;
