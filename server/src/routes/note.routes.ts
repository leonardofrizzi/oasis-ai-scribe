import { Router } from "express";
import multer from "multer";
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
} from "../controllers/note.controller";
import { checkPatientExists } from "../middleware/checkPatientExists";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getNotes);
router.get("/:id", getNoteById);
router.post(
  "/",
  upload.single("audio"),
  checkPatientExists,
  createNote
);
router.patch("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;