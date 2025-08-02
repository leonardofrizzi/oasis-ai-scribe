import { RequestHandler, Response } from "express";
import { prisma } from "../config/db";

export const getPatients: RequestHandler = async (_req, res) => {
  const patients = await prisma.patient.findMany({
    select: {
      id: true,
      name: true,
      dob: true,
      createdAt: true
    }
  });
  return res.json(patients);
};

export const getPatientById: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  const patient = await prisma.patient.findUnique({
    where: { id }
  });
  if (!patient) {
    return res.status(404).json({ error: "Patient not found" });
  }
  return res.json(patient);
};

export const getPatientNotes: RequestHandler = async (req, res) => {
  const patientId = Number(req.params.id);
  const notes = await prisma.note.findMany({
    where: { patientId },
    select: {
      id: true,
      transcriptRaw: true,
      transcriptText: true,
      oasisFields: true,
      createdAt: true
    }
  });
  return res.json(notes);
};