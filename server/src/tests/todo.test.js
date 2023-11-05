import { nanoid } from "nanoid";
import request from "supertest";
import redis from "../redis.js";
import app from "../app.js";

describe("ToDo Controller", () => {
  beforeAll(async () => {
    await redis.flushall();
  });

  afterAll(async () => {
    await redis.flushall(); // clear Redis database after running tests
    await redis.quit();
  });

  describe("API endpoints", () => {
    it("should return an empty array when there are no ToDos", async () => {
      const response = await request(app).get("/todo");
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("should return an array of ToDos when there are ToDos", async () => {
      const todo1 = { id: nanoid(), title: "Buy groceries", completed: false };
      const todo2 = { id: nanoid(), title: "Do laundry", completed: true };
      await redis.hset(`todos`, todo1.id, JSON.stringify(todo1));
      await redis.hset(`todos`, todo2.id, JSON.stringify(todo2));

      const response = await request(app).get("/todo");
      expect(response.status).toBe(200);
      expect(response.body).toContainEqual(todo1);
      expect(response.body).toContainEqual(todo2);
    });

    it("should create a new ToDo", async () => {
      const newTodo = { title: "Clean the house", completed: false };
      const response = await request(app).post("/todo").send(newTodo);
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(newTodo);

      const todoFromRedis = await redis.hget(`todos`, response.body.id);
      expect(JSON.parse(todoFromRedis)).toMatchObject(newTodo);
    });

    it("should update an existing ToDo", async () => {
      const todo = { id: nanoid(), title: "Walk the dog", completed: false };
      await redis.hset(`todos`, todo.id, JSON.stringify(todo));

      const updatedTodo = { title: "Walk the cat", completed: true };
      const response = await request(app)
        .put(`/todo/${todo.id}`)
        .send(updatedTodo);
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        ...todo,
        ...updatedTodo,
      });

      const todoFromRedis = await redis.hget(`todos`, todo.id);
      expect(JSON.parse(todoFromRedis)).toMatchObject({
        ...todo,
        ...updatedTodo,
      });
    });

    it("should delete an existing ToDo", async () => {
      const todo = {
        id: nanoid(),
        title: "Water the plants",
        completed: false,
      };
      await redis.hset(`todos`, todo.id, JSON.stringify(todo));

      const response = await request(app).delete(`/todo/${todo.id}`);
      expect(response.status).toBe(200);

      const todoFromRedis = await redis.hget(`todos`, todo.id);
      expect(todoFromRedis).toBeNull();
    });
  });
});
