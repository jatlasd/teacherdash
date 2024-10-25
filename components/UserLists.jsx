"use client";

import { useState, useEffect, useRef } from "react";
import {
  createList,
  fetchUserLists,
  deleteList,
  updateListItems,
  updateListColor,
} from "@/app/actions/userListActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Pencil, Pipette } from "lucide-react";

const colors = [
  "#FFE4B5", "#FFCFE6", "#B5EAD7", "#C7CEEA",
  "#FFDAB9", "#E0BBE4", "#FFF4CC", "#D4F0F0",
];

function UserLists() {
  const [lists, setLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState("");
  const [focusedListId, setFocusedListId] = useState(null);
  const [isAddNewList, setIsAddNewList] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const colorPickerRef = useRef(null);

  useEffect(() => {
    const fetchLists = async () => {
      const result = await fetchUserLists();
      if (result.success) {
        setLists(result.data);
      } else {
        console.error("Failed to fetch lists:", result.error);
      }
    };

    fetchLists();
  }, []);

  useEffect(() => {
    if (!focusedListId) setIsEditing(false);
  }, [focusedListId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setIsColorPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCreateList = async () => {
    if (!newListTitle.trim()) return;

    const result = await createList({ title: newListTitle });
    if (result.success) {
      setLists([...lists, result.data]);
      setNewListTitle("");
    } else {
      console.error("Failed to create list:", result.error);
    }
    setIsAddNewList(false);
  };

  const handleDeleteList = async (listId, e) => {
    e.stopPropagation();
    const result = await deleteList(listId);
    if (result.success) {
      setLists(lists.filter((list) => list.id !== listId));
      if (focusedListId === listId) {
        setFocusedListId(null);
      }
    } else {
      console.error("Failed to delete list:", result.error);
    }
  };

  const handleFocusList = (listId) => {
    setFocusedListId(listId);
  };

  const handleTextareaChange = async (listId, content) => {
    const updatedLists = lists.map((list) =>
      list.id === listId ? { ...list, items: [content] } : list
    );
    setLists(updatedLists);

    setTimeout(async () => {
      const result = await updateListItems(listId, [content]);
      if (!result.success) {
        console.error("Failed to update list:", result.error);
      }
    }, 500);
  };

  const handleColorChange = async (listId, color) => {
    const updatedLists = lists.map((list) =>
      list.id === listId ? { ...list, color } : list
    );
    setLists(updatedLists);
    setIsColorPickerOpen(false);
    setTimeout(async () => {
      const result = await updateListColor(listId, color);
      if (!result.success) {
        console.error("Failed to update list color:", result.error);
      }
    }, 500);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-white transition-colors p-2 hover:bg-white/10 rounded">
          My Lists
        </button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-5xl p-6">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-primary">
            My Lists
          </DialogTitle>
        </DialogHeader>
        {focusedListId === null ? (
          <>
            <div className="flex items-center space-x-2 mb-4 w-1/2">
              {isAddNewList ? (
                <>
                  <Input
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    placeholder="New list title"
                  />
                  <Button
                    onClick={handleCreateList}
                    className="bg-primary hover:bg-primary-700 transition-colors"
                  >
                    Add List
                  </Button>
                  <Button
                    onClick={() => setIsAddNewList(false)}
                    className="bg-secondary hover:bg-secondary-600 transition-colors"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsAddNewList(true)}
                  className="bg-primary hover:bg-primary-700 transition-colors"
                >
                  New List
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {lists.length > 0 && lists.map((list) => (
                <div
                  key={list.id}
                  className="p-4 border rounded-lg shadow-md cursor-pointer h-16 flex justify-center items-center"
                  onClick={() => handleFocusList(list.id)}
                  style={{ backgroundColor: list.color || '#FFE4B5' }}
                >
                  <h3 className="font-bold text-lg">{list.title}</h3>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div 
            className="p-4 border rounded-lg shadow-md"
            style={{ backgroundColor: lists.find(list => list.id === focusedListId)?.color || '#FFE4B5' }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg">
                {lists.find((list) => list.id === focusedListId).title}
              </h3>
              <div className="flex items-center space-x-2">
                {isEditing ? (
                  <>
                    <Trash2
                      className="text-secondary cursor-pointer"
                      onClick={(e) => handleDeleteList(focusedListId, e)}
                    />
                    <div className="relative" ref={colorPickerRef}>
                      <Pipette
                        className="text-primary cursor-pointer"
                        onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                      />
                      {isColorPickerOpen && (
                        <div className="absolute right-0 mt-2 p-3 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                          <div className="grid grid-cols-4 gap-3 w-[200px]">
                            {colors.map((color, index) => (
                              <div
                                key={index}
                                className="w-8 h-8 cursor-pointer rounded-full border border-gray-300 transition-transform hover:scale-110"
                                style={{ backgroundColor: color }}
                                onClick={() => handleColorChange(focusedListId, color)}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <Pencil
                    className="text-primary cursor-pointer"
                    onClick={() => setIsEditing(true)}
                  />
                )}
              </div>
            </div>
            <textarea
              className="w-full h-32 p-2 rounded resize-none focus:outline-none  bg-white/50 focus:bg-white/80 focus:shadow-inner"
              // style={{ 
              //   backgroundColor: `${lists.find((list) => list.id === focusedListId)?.color}` || '#FFE4B580'
              // }}
              value={lists.find((list) => list.id === focusedListId)?.items[0] || ""}
              onChange={(e) => handleTextareaChange(focusedListId, e.target.value)}
            />
            <Button
              onClick={() => setFocusedListId(null)}
              className="mt-4 bg-secondary hover:bg-secondary-600 transition-colors"
            >
              Back
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default UserLists;
