import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: todos los jabones
export const getJabones = async (_req: Request, res: Response) => {
  const jabones = await prisma.jabon.findMany();
  res.json(jabones);
};

// GET: jabón por ID
export const getJabonById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const jabon = await prisma.jabon.findUnique({ where: { id: Number(id) } });
  if (!jabon) return res.status(404).json({ message: "Jabón no encontrado" });
  res.json(jabon);
};

// POST: crear jabón (solo admin)
export const createJabon = async (req: Request, res: Response) => {
  const { nombre, descripcion, precio, imagen } = req.body;

  const nuevo = await prisma.jabon.create({
    data: { nombre, descripcion, precio: Number(precio), imagen },
  });

  res.status(201).json(nuevo);
};

// PUT: actualizar jabón por ID
export const updateJabon = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, imagen } = req.body;

  try {
    const actualizado = await prisma.jabon.update({
      where: { id: Number(id) },
      data: { nombre, descripcion, precio: Number(precio), imagen },
    });

    res.json(actualizado);
  } catch {
    res.status(404).json({ message: "No se pudo actualizar el jabón" });
  }
};

// DELETE: eliminar jabón
export const deleteJabon = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.jabon.delete({ where: { id: Number(id) } });
    res.json({ message: "Jabón eliminado" });
  } catch {
    res.status(404).json({ message: "No se pudo eliminar el jabón" });
  }
};
