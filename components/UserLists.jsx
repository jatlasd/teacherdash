"use client";

import { useState, useEffect } from "react";
import {
  createList,
  fetchUserLists,
  deleteList,
  updateListItems,
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
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";

function UserLists() {
  const [lists, setLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState("");
  const [expandedListId, setExpandedListId] = useState(null);
  const [isAddNewList, setIsAddNewList] = useState(false);

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
      if (expandedListId === listId) {
        setExpandedListId(null);
      }
    } else {
      console.error("Failed to delete list:", result.error);
    }
  };

  const handleToggleList = (listId) => {
    setExpandedListId(prevId => prevId === listId ? null : listId);
  };

  const handleTextareaChange = async (listId, content) => {
    const updatedLists = lists.map(list => 
      list.id === listId ? { ...list, items: [content] } : list
    );
    setLists(updatedLists);

    // Debounce the API call (you might want to implement a proper debounce function)
    setTimeout(async () => {
      const result = await updateListItems(listId, [content]);
      if (!result.success) {
        console.error("Failed to update list:", result.error);
      }
    }, 500);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-white transition-colors p-2 hover:bg-white/10 rounded">
          My Lists
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-5xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">My Lists</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 mb-4 w-1/2">
          {isAddNewList ? (
            <>
              <Input
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                placeholder="New list title"
              />
              <Button onClick={handleCreateList}>Add List</Button>
            </>
          ) : (
            <Button onClick={() => setIsAddNewList(true)}>New List</Button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {lists.map((list) => (
            <div
              key={list.id}
              className={`p-4 bg-yellow-200 border border-yellow-300 rounded-lg shadow-md cursor-pointer ${
                expandedListId === list.id ? 'h-auto' : 'h-16'
              }`}
              onClick={() => handleToggleList(list.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg">{list.title}</h3>
                <div className="flex items-center">
                  {expandedListId === list.id && (
                    <button
                      onClick={(e) => handleDeleteList(list.id, e)}
                      className="text-white mr-2"
                    >
                      <Trash2 className="text-secondary" />
                    </button>
                  )}
                  {expandedListId === list.id ? (
                    <ChevronUp className="text-primary" />
                  ) : (
                    <ChevronDown className="text-primary" />
                  )}
                </div>
              </div>
              {expandedListId === list.id && (
                <textarea
                  className="w-full h-32 p-2 bg-yellow-100 border border-yellow-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  value={list.items[0] || ''}
                  onChange={(e) => handleTextareaChange(list.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UserLists;
