import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import patientRoutes from "./routes/patient.routes";
import noteRoutes from "./routes/note.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.send("API is running"));
app.use("/patients", patientRoutes);
app.use("/notes", noteRoutes);

connectDB().catch((err) => {
  console.error("DB connection failed:", err);
  process.exit(1);
});

export default app;