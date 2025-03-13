import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";

const app = new Hono();
const prisma = new PrismaClient();

// ✅ Get all categories (No JWT)
app.get("/", async (c) => {
  const categories = await prisma.category.findMany();
  return c.json(categories);
});

// ✅ Create a category (No JWT)
app.post("/", async (c) => {
  const { name } = await c.req.json();

  const category = await prisma.category.create({ data: { name } });

  return c.json(category);
});

export default app;
