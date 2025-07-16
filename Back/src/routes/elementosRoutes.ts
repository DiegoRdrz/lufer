import { Router } from "express";


import { verifyToken } from "../middleware/verifyToken";
import { isAdmin } from "../middleware/isAdmin";


import {
  getElementosLimpieza,
  createElementoLimpieza,
  updateElementoLimpieza,
  deleteElementoLimpieza,
} from "../controllers/elementosController";

const router = Router();

// Rutas Elementos Limpieza
router.get("/", getElementosLimpieza);
router.post("/", verifyToken, isAdmin, createElementoLimpieza);
router.put(":id", verifyToken, isAdmin, updateElementoLimpieza);
router.delete("/:id", verifyToken, isAdmin, deleteElementoLimpieza);

export default router;

