import { PrismaClient, User, Task, Category, Tag } from "@prisma/client";
import * as bcrypt from "bcryptjs";  

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ✅ Create an admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin: User = await prisma.user.create({
    data: {
      email: "admin@test.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  // ✅ Create normal users
  const users: User[] = [];
  for (let i = 1; i <= 5; i++) {
    const user: User = await prisma.user.create({
      data: {
        email: `user${i}@test.com`,
        password: await bcrypt.hash("password123", 10),
        role: "user",
      },
    });
    users.push(user);
  }

  // ✅ Create categories
  const categories = ["Work", "Personal", "Fitness", "Education", "Shopping"];
  await prisma.category.createMany({
    data: categories.map((name) => ({ name })),
  });

  // ✅ Fetch categories
  const allCategories: Category[] = await prisma.category.findMany();

  // ✅ Create tasks (Each user gets 6 tasks)
  const tasks: Task[] = [];
  for (const user of users) {
    for (let i = 1; i <= 6; i++) {
      const task: Task = await prisma.task.create({
        data: {
          title: `Task ${i} for ${user.email}`,
          description: `This is task ${i} for user ${user.email}`,
          status: i % 2 === 0 ? "complete" : "incomplete",
          userId: user.id,
          categoryId: allCategories[i % allCategories.length].id,
        },
      });
      tasks.push(task);
    }
  }

  // ✅ Create tags
  const tags = ["Urgent", "Home", "Office", "Important", "Later"];
  await prisma.tag.createMany({
    data: tags.map((name) => ({ name })),
  });

  // ✅ Fetch all tags
  const allTags: Tag[] = await prisma.tag.findMany();

  // ✅ Assign unique tags to tasks (Each task gets 2 different tags)
  for (const task of tasks) {
    const availableTags = [...allTags]; // Copy the tags array to avoid duplicates
    const selectedTags: Tag[] = [];

    while (selectedTags.length < 2 && availableTags.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableTags.length);
      selectedTags.push(availableTags[randomIndex]);
      availableTags.splice(randomIndex, 1); // Remove the selected tag to avoid duplicates
    }

    for (const tag of selectedTags) {
      await prisma.taskTag.create({
        data: {
          taskId: task.id,
          tagId: tag.id,
        },
      });
    }
  }

  // ✅ Create UserSettings for each user
  for (const user of users) {
    await prisma.userSettings.create({
      data: {
        userId: user.id,
        darkMode: false,
        language: "en",
      },
    });
  }

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
