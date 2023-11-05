import React from "react";

const ToDoForm = ({ onCreate }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const todo = {
          title: e.target.elements[0].value,
          state: false,
        };
        onCreate(todo);
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
  );
};

export default ToDoForm;
