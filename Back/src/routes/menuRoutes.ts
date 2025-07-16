import { Router } from "express";
import {
  getMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
} from "../controllers/menuController";
import { verifyToken } from "../middleware/verifyToken";
import { isAdmin } from "../middleware/isAdmin";

const router = Router();

router.get("/", getMenus);
router.get("/:id", getMenuById);
router.post("/", verifyToken, isAdmin, createMenu);
router.put("/:id", verifyToken, isAdmin, updateMenu);
router.delete("/:id", verifyToken, isAdmin, deleteMenu);

export default router;
