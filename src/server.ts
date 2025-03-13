import { Hono } from "hono";
import { serve } from "@hono/node-server"; // ✅ Fix for Node.js
import * as dotenv from "dotenv"; // ✅ Fix dotenv import
import tasksRoutes from "./routes/tasks";
import categoriesRoutes from "./routes/categories";
import authRoutes from "./routes/auth";

dotenv.config(); // ✅ Load environment variables

const app = new Hono();

app.get("/", (c) => c.text("Welcome to the To-Do API!"));
app.route("/tasks", tasksRoutes);
app.route("/categories", categoriesRoutes);
app.route("/auth", authRoutes);

// ✅ Use `serve` for Node.js compatibility
serve({
  fetch: app.fetch,
  port: 3000,
});

console.log("✅ Server is running on http://localhost:3000");


