import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todo el personal de limpieza con su baño asignado
export const getPersonalLimpieza = async (_req: Request, res: Response) => {
  try {
    const personal = await prisma.personalLimpieza.findMany({
      include: { baño: true },
    });
    res.json(personal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener personal de limpieza" });
  }
};

// Crear personal de limpieza
export const createPersonalLimpieza = async (req: Request, res: Response) => {
  const { nombre, tarea, bañoId } = req.body;

  try {
    const nuevoPersonal = await prisma.personalLimpieza.create({
      data: { nombre, tarea, bañoId: Number(bañoId) },
    });
    res.status(201).json(nuevoPersonal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear personal de limpieza" });
  }
};

// Actualizar personal de limpieza
export const updatePersonalLimpieza = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, tarea, bañoId } = req.body;

  try {
    const actualizado = await prisma.personalLimpieza.update({
      where: { id: Number(id) },
      data: { nombre, tarea, bañoId: Number(bañoId) },
    });
    res.json(actualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar personal de limpieza" });
  }
};

// Eliminar personal de limpieza
export const deletePersonalLimpieza = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.personalLimpieza.delete({ where: { id: Number(id) } });
    res.json({ message: "Personal eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar personal de limpieza" });
  }
};
