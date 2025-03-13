import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";

const app = new Hono();
const prisma = new PrismaClient();

// ✅ Get all tasks (No JWT)
app.get("/", async (c) => {
  const tasks = await prisma.task.findMany();
  return c.json(tasks);
});

// ✅ Create a new task (No JWT)
app.post("/", async (c) => {
  const { title, description, categoryId, userId } = await c.req.json();

  if (!userId) {
    return c.json({ error: "Missing userId" }, 400);
  }

  const task = await prisma.task.create({
    data: { title, description, status: "incomplete", userId, categoryId },
  });

  return c.json(task);
});

// ✅ Update a task (No JWT)
app.put("/:id", async (c) => {
  const taskId = c.req.param("id");
  const { title, description, status, userId } = await c.req.json();

  const task = await prisma.task.updateMany({
    where: { id: taskId, userId },
    data: { title, description, status },
  });

  return task.count ? c.json({ message: "Task updated!" }) : c.json({ error: "Task not found" }, 404);
});

// ✅ Delete a task (No JWT)
app.delete("/:id", async (c) => {
  const taskId = c.req.param("id");

  const task = await prisma.task.deleteMany({
    where: { id: taskId },
  });

  return task.count ? c.json({ message: "Task deleted!" }) : c.json({ error: "Task not found" }, 404);
});

export default app;


