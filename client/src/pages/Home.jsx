import React, { useEffect, useState } from "react";
import ToDo from "../components/ToDo.jsx";
import CreateForm from "../components/CreateForm.jsx";
import { io } from "socket.io-client";

import api from "../api";

// Sort todos by title and state
// purely for display purposes
const sortToDos = (todos) =>
  todos
    .sort((a, b) => (a.title > b.title ? 1 : -1))
    .sort((a, b) => a.state - b.state);

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);

  // Wrap api functions with error handling
  const [fetchToDos, createToDo, toggleToDo, deleteToDo] = [
    async (...args) => {
      const todos = await api.getToDos(args);
      setTodos(todos);
    },
    api.createToDo,
    api.toggleToDo,
    api.deleteToDo,
  ].map((fn) => async (...args) => {
    try {
      await fn(...args);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  });

  useEffect(() => {
    console.log("connecting socket...");
    const socket = io(process.env.BACKEND_URL);

    // Connection events
    socket.on("connect", () => {
      console.log("connected/reconnected");
      // Clear error message
      setError("");
      // Fetch todos from server
      // We need to refetch on reconnect in case we missed any events
      fetchToDos();
    });
    socket.on("connect_error", (err) => {
      console.log("connect_error", err);
      setError("Failed to connect to server, retrying...");
    });
    socket.on("disconnect", (reason) => {
      console.log("disconnected");
      // If server disconnects, reconnect
      if (reason === "io server disconnect") {
        socket.connect();
      }
      setError("Disconnected from server, reconnecting...");
    });

    // ToDo events
    socket.on("todo.create", (todo) => {
      setTodos((todos) => [...todos, todo]);
    });
    socket.on("todo.update", (todo) => {
      setTodos((todos) => todos.map((t) => (t.id === todo.id ? todo : t)));
    });
    socket.on("todo.delete", (id) => {
      setTodos((todos) => todos.filter((t) => t.id !== id));
    });

    return () => socket.close();
  }, []);

  return (
    <>
      <h1>ToDo List</h1>
      <br />
      <CreateForm onCreate={createToDo} />
      <br />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {sortToDos(todos).map((todo) => (
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
