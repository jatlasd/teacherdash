"use client";

import { useState, useEffect } from "react";
import { addTodo } from "@/app/actions/todoActions";
import TodoItem from "./TodoItem";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/todos");
      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  }

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

  const handleTodoUpdate = (updatedTodo) => {
    setTodos(todos.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo))
  }

  const handleTodoDelete = (todoId) => {
    setTodos(todos.filter(todo => todo.id !== todoId))
  }

  return (
    <div>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <button onClick={handleAddTodo}>Add Todo</button>
      <ul>
        {todos.map((todo) => (
          <TodoItem 
            key={todo.id} 
            todo={todo} 
            onUpdate={handleTodoUpdate}
            onDelete={handleTodoDelete}
          />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
