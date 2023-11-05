const baseURL = process.env.BACKEND_URL;

const getToDos = async () => {
  const response = await fetch(`${baseURL}/todo`);
  return response.json();
};

const toggleToDo = async (todo) => {
  const response = await fetch(`${baseURL}/todo/${todo.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: todo.title,
      state: !todo.state,
    }),
  });
  return response.json();
};

const deleteToDo = async (todo) => {
  const response = await fetch(`${baseURL}/todo/${todo.id}`, {
    method: "DELETE",
  });
  return response.json();
};

const createToDo = async (todo) => {
  const response = await fetch(`${baseURL}/todo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });
  return response.json();
};

export default {
  getToDos,
  toggleToDo,
  deleteToDo,
  createToDo,
};
