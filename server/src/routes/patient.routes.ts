import { Router } from "express";
import {
  getPatients,
  getPatientById,
  getPatientNotes
} from "../controllers/patient.controller";

const router = Router();

router.get("/", getPatients);
router.get("/:id/notes", getPatientNotes);
router.get("/:id", getPatientById);

export default router;