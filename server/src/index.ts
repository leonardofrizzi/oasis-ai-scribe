import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import patientRoutes from "./routes/patient.routes";
import noteRoutes from "./routes/note.routes";

dotenv.config();
const app = express();
app.use(express.json());

app.get("/", (_req, res) => res.send("API is running"));
app.use("/patients", patientRoutes);
app.use("/notes", noteRoutes);

const PORT = process.env.PORT || 4000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}).catch(err => {
  console.error("DB connection failed:", err);
  process.exit(1);
});