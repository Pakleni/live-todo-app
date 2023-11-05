import React, { useEffect, useState } from "react";
import ToDo from "../components/ToDo.jsx";
import ToDoForm from "../components/ToDoForm.jsx";

import api from "../api";

const Home = ({ socket }) => {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);

  const fetchToDos = async () => {
    try {
      const todos = await api.getToDos();
      setTodos(todos);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch ToDos on first render
  useEffect(() => {
    fetchToDos();
  }, []);

  const createToDo = async (todo) => {
    try {
      await api.createToDo(todo);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleToDo = async (todo) => {
    try {
      await api.toggleToDo(todo);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteToDo = async (todo) => {
    try {
      await api.deleteToDo(todo);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("todos", (todos) => {
      setTodos(JSON.parse(todos).map((todo) => JSON.parse(todo)));
    });
  }, [socket]);

  return (
    <>
      <h1>ToDo List</h1>
      <ToDoForm onCreate={createToDo} />
      <br />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {todos
          .sort((a, b) => (a.state === b.state ? 0 : a.state ? 1 : -1))
          .map((todo) => (
            <ToDo
              key={todo.id}
              todo={todo}
              onToggle={toggleToDo}
              onDelete={deleteToDo}
            />
          ))}
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
};

export default Home;
