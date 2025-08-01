import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

dotenv.config();
const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("Failed to connect to Postgres:", err);
    process.exit(1);
  });