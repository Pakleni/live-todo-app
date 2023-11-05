import express from "express";
import ToDoController from "../controllers/todo.controller.js";

const todoRouter = express.Router();

todoRouter.get("/", ToDoController.getAll);
todoRouter.post("/", ToDoController.create);
todoRouter.put("/:id", ToDoController.update);
todoRouter.delete("/:id", ToDoController.delete);

export default todoRouter;
