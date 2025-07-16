import { Router } from "express";
import {
  createReserva,
  getMisReservas,
  getTodasLasReservas,
  deleteReserva,
  updateReserva,
} from "../controllers/reservaController";
import { verifyToken } from "../middleware/verifyToken";
import { isAdmin } from "../middleware/isAdmin";

const router = Router();

// Usuario normal
router.post("/", verifyToken, createReserva);
router.get("/mis-reservas", verifyToken, getMisReservas);
router.put("/:id", verifyToken, updateReserva);


// Admin
router.get("/", verifyToken, isAdmin, getTodasLasReservas);
router.delete("/:id", verifyToken, deleteReserva);

export default router;
