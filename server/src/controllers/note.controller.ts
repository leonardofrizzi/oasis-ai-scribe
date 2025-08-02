import { Request, Response } from "express";
import { prisma } from "../config/db";
import { Note } from "../models/note";

export async function getNotes(_req: Request, res: Response) {
  try {
    const notes = await prisma.note.findMany({
      select: {
        id: true,
        patientId: true,
        transcriptRaw: true,
        createdAt: true
      }
    });
    return res.json(notes);
  } catch (err) {
    console.error("Error fetching notes:", err);
    return res.status(500).json({ error: "Failed to fetch notes" });
  }
}

export async function getNoteById(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const note = await prisma.note.findUnique({
      where: { id },
      include: { patient: true }
    });
    if (!note) return res.status(404).json({ error: "Note not found" });
    return res.json(note);
  } catch (err) {
    console.error("Error fetching note:", err);
    return res.status(500).json({ error: "Failed to fetch note" });
  }
}