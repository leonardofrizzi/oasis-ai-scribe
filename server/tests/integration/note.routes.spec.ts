jest.mock("../../src/services/transcribe.service", () => ({
  transcribeAudio: jest.fn().mockResolvedValue("stubbed transcript"),
}));

import request from "supertest";
import express from "express";
import noteRoutes from "../../src/routes/note.routes";
import { connectDB } from "../../src/config/db";

const app = express();
app.use(express.json());
app.use("/notes", noteRoutes);

beforeAll(async () => {
  await connectDB();
});

describe("Notes API", () => {
  let noteId: number;

  it("POST /notes should create a new note", async () => {
    const res = await request(app)
      .post("/notes")
      .field("patientId", 1)
      .attach("audio", Buffer.from("test"), "test.wav");

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    noteId = res.body.id;
  });

  it("PATCH /notes/:id should update note", async () => {
    const res = await request(app)
      .patch(`/notes/${noteId}`)
      .send({ transcriptText: "updated", oasisFields: { M1800: "1" } });

    expect(res.status).toBe(200);
    expect(res.body.transcriptText).toBe("updated");
    expect(res.body.oasisFields.M1800).toBe("1");
  });

  it("DELETE /notes/:id should remove note", async () => {
    const res = await request(app).delete(`/notes/${noteId}`);
    expect(res.status).toBe(204);
  });
});