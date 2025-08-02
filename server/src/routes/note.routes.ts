import { Router } from "express";
import multer from "multer";
import {
  getNotes,
  getNoteById,
  createNote
} from "../controllers/note.controller";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getNotes);
router.get("/:id", getNoteById);
router.post("/", upload.single("audio"), createNote);

export default router;