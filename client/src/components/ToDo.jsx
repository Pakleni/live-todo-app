import React, { useState } from "react";

// Single ToDo component
const ToDo = ({ todo, onToggle, onDelete }) => {
  const { title, state } = todo;

  const [disabled, setDisabled] = useState(false);

  const toggleToDo = async () => {
    if (disabled) return;
    setDisabled(true);
    await onToggle(todo);
    setDisabled(false);
  };

  const deleteToDo = async () => {
    if (disabled) return;
    setDisabled(true);
    await onDelete(todo);
    setDisabled(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        flexBasis: "20%",
        padding: "10px",
        border: "1px solid black",
        borderRadius: "5px",
        margin: "5px",
        fontFamily: "monospace",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <span
        onClick={toggleToDo}
        style={{
          textDecoration: state ? "line-through" : "none",
          color: state ? "gray" : "black",
        }}
      >
        [{state ? "✔" : " "}] {title}
      </span>
      <span
        onClick={deleteToDo}
        style={{
          color: "red",
        }}
      >
        Delete
      </span>
    </div>
  );
};

export default ToDo;
