import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todos los elementos de limpieza
export const getElementosLimpieza = async (_req: Request, res: Response) => {
  try {
    const elementos = await prisma.elementoLimpieza.findMany();
    res.json(elementos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener elementos de limpieza" });
  }
};

// Crear elemento de limpieza
export const createElementoLimpieza = async (req: Request, res: Response) => {
  const { nombre, descripcion, precio } = req.body;

  try {
    const nuevoElemento = await prisma.elementoLimpieza.create({
      data: { nombre, descripcion, precio: Number(precio) },
    });
    res.status(201).json(nuevoElemento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear elemento de limpieza" });
  }
};

// Actualizar elemento de limpieza
export const updateElementoLimpieza = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, descripcion, precio } = req.body;

  try {
    const actualizado = await prisma.elementoLimpieza.update({
      where: { id: Number(id) },
      data: { nombre, descripcion, precio: Number(precio) },
    });
    res.json(actualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar elemento de limpieza" });
  }
};

// Eliminar elemento de limpieza
export const deleteElementoLimpieza = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.elementoLimpieza.delete({ where: { id: Number(id) } });
    res.json({ message: "Elemento eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar elemento de limpieza" });
  }
};
