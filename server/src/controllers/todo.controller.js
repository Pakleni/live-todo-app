import { nanoid } from "nanoid";
import redis from "../redis.js";
import emitter from "../emitter.js";

const emitAll = async () => {
  const todos = await redis.hvals("todos");
  emitter.emit("todos", JSON.stringify(todos));
};

const ToDo = {
  getAll: async (req, res) => {
    const todos = await redis.hvals("todos");
    res.send(todos.map((todo) => JSON.parse(todo)));
  },
  create: async (req, res) => {
    const todo = req.body;

    todo.id = nanoid();

    await redis.hset("todos", todo.id, JSON.stringify(todo));
    emitAll();

    res.send(todo);
  },
  update: async (req, res) => {
    const todo = req.body;
    const { id } = req.params;

    todo.id = id;

    await redis.hset("todos", id, JSON.stringify(todo));
    emitAll();

    res.send(todo);
  },
  delete: async (req, res) => {
    const { id } = req.params;

    await redis.hdel("todos", id);
    emitAll();

    res.send({ id });
  },
};

export default ToDo;
