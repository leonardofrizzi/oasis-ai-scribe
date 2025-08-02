import { RequestHandler, Response } from "express";
import { prisma } from "../config/db";
import { transcribeAudio } from "../services/transcribe.service";
import { extractOasisFields } from "../services/oasis.service";

export const getNotes: RequestHandler = async (_req, res) => {
  const notes = await prisma.note.findMany({
    select: {
      id: true,
      patientId: true,
      transcriptRaw: true,
      transcriptText: true,
      oasisFields: true,
      createdAt: true
    }
  });
  return res.json(notes);
};

export const getNoteById: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  const note = await prisma.note.findUnique({
    where: { id },
    include: { patient: true }
  });
  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }
  return res.json(note);
};

export const createNote: RequestHandler = async (req, res) => {
  const { patientId } = req.body;
  const file = (req as any).file;
  if (!patientId) {
    return res.status(400).json({ error: "patientId is required" });
  }
  if (!file) {
    return res.status(400).json({ error: "Audio file is required" });
  }
  const raw = file.buffer.toString("base64");
  const text = await transcribeAudio(file.buffer, file.originalname, file.mimetype);
  const oasisFields = extractOasisFields(text);
  const note = await prisma.note.create({
    data: {
      patientId: Number(patientId),
      transcriptRaw: raw,
      transcriptText: text,
      oasisFields
    }
  });
  return res.status(201).json(note);
};