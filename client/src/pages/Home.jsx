import React from "react";
import ToDo from "../components/ToDo.jsx";

const Home = ({ socket }) => {
  const todos = [
    {
      id: 1,
      title: "To Do 1",
      state: true,
    },
    {
      id: 2,
      title: "To Do 2",
      state: false,
    },
    {
      id: 3,
      title: "To Do 3",
      state: true,
    },
  ];

  return (
    <>
      <h1>ToDo List</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const title = e.target.elements[0].value;
          socket.emit("addToDo", title);
          e.target.reset();
        }}
      >
        <input
          type="text"
          style={{
            width: "300px",
            height: "30px",
            fontSize: "20px",
            fontFamily: "monospace",
          }}
        />
        <button
          type="submit"
          style={{
            width: "100px",
            height: "30px",
            fontSize: "20px",
            fontFamily: "monospace",
          }}
        >
          Add
        </button>
      </form>
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
              title={todo.title}
              state={todo.state}
              onClick={() => {
                socket.emit("toggleToDo", todo.id);
              }}
              onDelete={() => {
                socket.emit("deleteToDo", todo.id);
              }}
            />
          ))}
      </div>
    </>
  );
};

export default Home;
