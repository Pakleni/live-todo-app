import React, { useEffect, useState } from "react";

// Single ToDo component
const ToDo = ({ title, state, onToggle, onDelete }) => {
  const [stateText, setButtonText] = useState(state ? "✔" : " ");
  const [textDecoration, setTextDecoration] = useState(
    state ? "line-through" : "none",
  );
  const [color, setColor] = useState(state ? "gray" : "black");

  useEffect(() => {
    setButtonText(state ? "✔" : " ");
    setTextDecoration(state ? "line-through" : "none");
    setColor(state ? "gray" : "black");
  }, [state]);

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
      }}
    >
      <span
        onClick={onToggle}
        style={{
          textDecoration,
          color,
        }}
      >
        [{stateText}] {title}
      </span>
      <span
        onClick={onDelete}
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
