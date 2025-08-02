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
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid note id" });
  }
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
  const patientId = Number(req.body.patientId);

  const file = req.file;
  if (isNaN(patientId)) {
    return res.status(400).json({ error: "patientId is required and must be a number" });
  }
  if (!file) {
    return res.status(400).json({ error: "Audio file is required" });
  }
  const raw = file.buffer.toString("base64");
  const text = await transcribeAudio(file.buffer, file.originalname, file.mimetype);
  const oasisFields = extractOasisFields(text);
  const note = await prisma.note.create({
    data: {
      patientId,
      transcriptRaw: raw,
      transcriptText: text,
      oasisFields
    }
  });
  return res.status(201).json(note);
};

export const updateNote: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid note id" });
  }
  const { transcriptText, oasisFields } = req.body;
  const data: { transcriptText?: string; oasisFields?: Record<string, any> } = {};
  if (transcriptText !== undefined) data.transcriptText = transcriptText;
  if (oasisFields !== undefined) data.oasisFields = oasisFields;
  try {
    const updated = await prisma.note.update({
      where: { id },
      data
    });
    return res.json(updated);
  } catch (err: any) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Note not found" });
    }
    console.error("Error updating note:", err);
    return res.status(500).json({ error: "Failed to update note" });
  }
};

export const deleteNote: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid note id" });
  }
  try {
    await prisma.note.delete({ where: { id } });
    return res.sendStatus(204);
  } catch (err: any) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Note not found" });
    }
    console.error("Error deleting note:", err);
    return res.status(500).json({ error: "Failed to delete note" });
  }
};