"use client";

import { useState, useEffect } from "react";
import { addTodo } from "@/app/actions/todoActions";
import TodoItem from "./TodoItem";
import { Check, ChevronDown, ChevronUp, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const TodoList = () => {
  const [isTodoOpen, setIsTodoOpen] = useState(false);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/todos");
      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      const result = await addTodo({ todo: newTodo });
      if (result.success) {
        setTodos([...todos, result.data]);
        setNewTodo("");
      } else {
        console.error("Failed to add todo:", result.error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  const handleTodoUpdate = (updatedTodo) => {
    setTodos(
      todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
    );
  };

  const handleTodoDelete = (todoId) => {
    setTodos(todos.filter((todo) => todo.id !== todoId));
  };

  const toggleTodoList = () => {
    setIsTodoOpen(!isTodoOpen);
  };

  return (
    <div className="mr-3 border-2 rounded-xl p-3 flex flex-col w-64">
      <div className="flex justify-between items-center mb-2 relative">
        <div className="absolute right-0">
          <button
            onClick={toggleTodoList}
            className="text-primary hover:text-primary-700 transition-colors duration-200"
          >
            {isTodoOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
        <h1 className="text-2xl font-semibold text-primary px-4 border-b border-b-primary mx-auto">Todos</h1>
      </div>
      {isTodoOpen && (
        <>
          <div className="flex flex-col space-y-2 mb-2">
            <textarea
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAddTodo();
                }
              }}
              className="resize-none min-h-[2.5rem] max-h-32 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Add new todo..."
            />
            <Button
              onClick={handleAddTodo}
              className="bg-primary text-white hover:bg-primary-700 transition-colors duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Todo
            </Button>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="flex flex-col gap-y-2">
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onUpdate={handleTodoUpdate}
                  onDelete={handleTodoDelete}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TodoList;
