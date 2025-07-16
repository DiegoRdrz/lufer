import { Router, Request, Response } from "express";
import { verifyToken } from "../middleware/verifyToken";
import { isAdmin } from "../middleware/isAdmin";
import { getPerfil, getTodosLosUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario } from "../controllers/usuarioController";

const router = Router();

router.get('/me', verifyToken, (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "No autorizado" });
  }

  // Aquí devuelves la info que tienes en el token
  return res.json({
    id: req.user.id,
    rol: req.user.rol,
  });
});

router.get("/perfil", verifyToken, getPerfil);
router.get("/", verifyToken, isAdmin, getTodosLosUsuarios);

router.post("/", verifyToken, isAdmin, crearUsuario);
router.put("/:id", verifyToken, actualizarUsuario);
router.delete("/:id", verifyToken, isAdmin, eliminarUsuario);

export default router;