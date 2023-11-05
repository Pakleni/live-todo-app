import express from "express";
import cors from "cors";
import todoRouter from "./routers/todo.routes.js";

// create express app
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

// register routers
const router = express.Router();
router.use("/todo", todoRouter);
app.use("/", router);

export default app;
