import request from "supertest";
import express from "express";
import patientRoutes from "../../src/routes/patient.routes";
import { connectDB } from "../../src/config/db";

const app = express();
app.use(express.json());
app.use("/patients", patientRoutes);

beforeAll(async () => {
  await connectDB();
});

describe("GET /patients", () => {
  it("returns list of seeded patients", async () => {
    const res = await request(app).get("/patients");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe("GET /patients/:id", () => {
  it("returns 200 for existing patient", async () => {
    const res = await request(app).get("/patients/1");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", 1);
  });
  it("returns 404 for non-existing patient", async () => {
    const res = await request(app).get("/patients/9999");
    expect(res.status).toBe(404);
  });
});

describe("GET /patients/:id/notes", () => {
  it("returns empty array if no notes", async () => {
    const res = await request(app).get("/patients/1/notes");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});