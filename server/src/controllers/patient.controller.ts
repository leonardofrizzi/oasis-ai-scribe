import { Request, Response } from "express";
import { prisma } from "../config/db";
import { Patient } from "../models/patient";

export async function getPatients(_req: Request, res: Response) {
  try {
    const patients: Patient[] = await prisma.patient.findMany();
    return res.json(patients);
  } catch (err) {
    console.error("Error fetching patients:", err);
    return res.status(500).json({ error: "Failed to fetch patients" });
  }
}