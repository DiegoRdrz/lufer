import { Router } from "express";
import {
    getPersonalLimpieza,
    createPersonalLimpieza,
    updatePersonalLimpieza,
    deletePersonalLimpieza,
  } from "../controllers/personalController";

const router = Router();

import { verifyToken } from "../middleware/verifyToken";
import { isAdmin } from "../middleware/isAdmin";

router.get("/", getPersonalLimpieza);
router.post("/", verifyToken, isAdmin, createPersonalLimpieza);
router.put("/:id", verifyToken, isAdmin, updatePersonalLimpieza);
router.delete("/:id", verifyToken, isAdmin, deletePersonalLimpieza);

export default router;