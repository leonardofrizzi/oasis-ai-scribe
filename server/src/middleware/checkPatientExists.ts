import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";

export async function checkPatientExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = Number(req.body.patientId);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "patientId must be an integer" });
  }
  const patient = await prisma.patient.findUnique({ where: { id } });
  if (!patient) {
    return res.status(400).json({ error: "Invalid patientId" });
  }
  next();
}