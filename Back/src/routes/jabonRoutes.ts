import { Router } from "express";
import {
  getJabones,
  getJabonById,
  createJabon,
  updateJabon,
  deleteJabon,
} from "../controllers/jabonController";
import { verifyToken } from "../middleware/verifyToken";
import { isAdmin } from "../middleware/isAdmin";

const router = Router();

router.get("/", getJabones);
router.get("/:id", getJabonById);
router.post("/", verifyToken, isAdmin, createJabon);
router.put("/:id", verifyToken, isAdmin, updateJabon);
router.delete("/:id", verifyToken, isAdmin, deleteJabon);

export default router;
