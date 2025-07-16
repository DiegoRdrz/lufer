import { Request, Response, NextFunction } from "express";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.rol !== "ADMIN") {
    return res.status(403).json({ message: "Acceso solo para administradores" });
  }
  next();
};
