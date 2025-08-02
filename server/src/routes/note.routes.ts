import { Router } from "express";
import { getNotes, getNoteById } from "../controllers/note.controller";

const router = Router();

router.get("/", getNotes);
router.get("/:id", getNoteById);

export default router;