import { Router } from "express";
import {
  getBaños,
  getBañoById,
  createBaño,
  updateBaño,
  deleteBaño,
} from "../controllers/bañoController";
import { verifyToken } from "../middleware/verifyToken";
import { isAdmin } from "../middleware/isAdmin";

const router = Router();

router.get("/", getBaños);
router.get("/:id", getBañoById);

// Estas requieren token y rol admin
router.post("/", verifyToken, isAdmin, createBaño);
router.put("/:id", verifyToken, isAdmin, updateBaño);
router.delete("/:id", verifyToken, isAdmin, deleteBaño);

export default router;
