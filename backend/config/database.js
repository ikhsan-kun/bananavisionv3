const { PrismaClient } = require("@prisma/client");

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is required before PrismaClient initialization",
  );
}

const prisma = new PrismaClient();

if (process.env.NODE_ENV === "development") {
  prisma.$on("query", (e) => console.log("Prisma query:", e));
}

prisma
  .$connect()
  .then(() => console.log("done: Database connected"))
  .catch((err) => console.error("errr: Database connection failed:", err));

module.exports = prisma;
