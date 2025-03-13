import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";  // ✅ Fix import issue
import * as jwt from "jsonwebtoken"; // ✅ Fix import issue

const app = new Hono();
const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || "default_secret";

// ✅ Register a new user
app.post("/register", async (c) => {
  const { email, password, role } = await c.req.json();
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, role: role || "user" },
  });

  return c.json(user);
});

// ✅ Login user
app.post("/login", async (c) => {
  const { email, password } = await c.req.json();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: "1h" });
  return c.json({ token });
});

export default app;

