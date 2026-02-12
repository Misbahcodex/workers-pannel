import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const workerHash = await hash("worker123", 10);
  const adminHash = await hash("admin123", 10);

  const worker = await prisma.user.upsert({
    where: { email: "worker@company.com" },
    update: {},
    create: {
      email: "worker@company.com",
      passwordHash: workerHash,
      name: "Demo Worker",
      role: "WORKER",
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@company.com" },
    update: {},
    create: {
      email: "admin@company.com",
      passwordHash: adminHash,
      name: "Demo Admin",
      role: "ADMIN",
    },
  });

  await prisma.workerProfile.upsert({
    where: { userId: worker.id },
    update: {},
    create: {
      userId: worker.id,
      department: "Operations",
      emergencyContact: "+1 555-0100",
      phone: "+1 555-0101",
    },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.shift.create({
    data: {
      workerId: worker.id,
      date: today,
      startTime: "09:00",
      endTime: "17:00",
      role: "Field Staff",
      location: "Site A",
      department: "Operations",
      createdBy: admin.id,
    },
  });

  await prisma.announcement.create({
    data: {
      title: "Welcome to the Worker Dashboard",
      body: "Use this dashboard to view your shifts, request leave, submit reports, and stay updated with announcements.",
      important: true,
      authorId: admin.id,
      createdBy: admin.id,
    },
  });

  console.log("Seeded:", { worker: worker.email, admin: admin.email });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
