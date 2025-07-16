import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: obtener todos los baños
export const getBaños = async (_req: Request, res: Response) => {
  const baños = await prisma.baño.findMany();
  res.json(baños);
};

// GET: obtener baño por ID
export const getBañoById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const baño = await prisma.baño.findUnique({ where: { id: Number(id) } });
  if (!baño) return res.status(404).json({ message: "Baño no encontrado" });
  res.json(baño);
};

// POST: crear un baño (admin)
export const createBaño = async (req: Request, res: Response) => {
  const { nombre, descripcion, precio, imagen } = req.body;

  const nuevoBaño = await prisma.baño.create({
    data: { nombre, descripcion, precio: Number(precio), imagen },
  });

  res.status(201).json(nuevoBaño);
};

// PUT: actualizar baño por ID
export const updateBaño = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, imagen } = req.body;

  try {
    const bañoActualizado = await prisma.baño.update({
      where: { id: Number(id) },
      data: { nombre, descripcion, precio: Number(precio), imagen },
    });

    res.json(bañoActualizado);
  } catch {
    res.status(404).json({ message: "No se pudo actualizar el baño" });
  }
};

// DELETE: eliminar baño
export const deleteBaño = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.baño.delete({ where: { id: Number(id) } });
    res.json({ message: "Baño eliminado" });
  } catch {
    res.status(404).json({ message: "No se pudo eliminar el baño" });
  }
};
