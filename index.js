import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express from "express";
import appointmentsRoute from "./routes/admin/appointmentsRoutes.js";
import authRoute from "./routes/admin/auth/authRoute.js";
import blogRoute from "./routes/admin/blogRoute.js";
import casesRoute from "./routes/admin/casesRoute.js";
import contactRoute from "./routes/admin/contactRoutes.js";
import jobsRoute from "./routes/admin/jobsRoute.js";
import partnershipsRoute from "./routes/admin/partnershipsRoute.js";
import partnersRoute from "./routes/admin/partnersRoute.js";
import productsRoute from "./routes/admin/productsRoute.js";
import servicesRoute from "./routes/admin/servicesRoutes.js";
import successStoriesRoute from "./routes/admin/successStoriesRoutes.js";
import sponsorshipRoute from "./routes/admin/sponsorshipRoutes.js";




const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Health check endpoint for Docker
app.get("/health", async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
      uptime: process.uptime(),
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      database: "disconnected",
      error: error.message,
    });
  }
});

app.use("/auth", authRoute);
app.use("/services", servicesRoute);
app.use("/products", productsRoute);
app.use("/blog", blogRoute);
app.use("/partners", partnersRoute);
app.use("/cases", casesRoute);
app.use("/appointments", appointmentsRoute);
app.use("/successStories", successStoriesRoute);
app.use("/jobs", jobsRoute);
app.use("/partnerships", partnershipsRoute);
app.use("/contact", contactRoute);
app.use("/sponsorship", sponsorshipRoute);


const PORT = process.env.PORT || 3010;

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    await prisma.$disconnect();
    console.log('HTTP server closed');
  });
});
