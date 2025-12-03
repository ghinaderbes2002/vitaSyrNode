import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRoute from "./routes/admin/auth/authRoute.js";
import servicesRoute from "./routes/admin/servicesRoutes.js";
import productsRoute from "./routes/admin/productsRoute.js";
import blogRoute from "./routes/admin/blogRoute.js";
import successStoriesRoute from "./routes/admin/successStoriesRoutes.js";
import jobsRoute from "./routes/admin/jobsRoute.js";
import partnershipsRoute from "./routes/admin/partnershipsRoute.js";
import casesRoute from "./routes/admin/casesRoute.js";
import partnersRoute from "./routes/admin/partnersRoute.js";
import appointmentsRoute from "./routes/admin/appointmentsRoutes.js";
import contactRoute from "./routes/admin/contactRoutes.js";



const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

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



app.listen(3000, () => console.log("Server running on port 3000"));
