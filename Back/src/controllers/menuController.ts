import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: todos los menús
export const getMenus = async (_req: Request, res: Response) => {
  const menus = await prisma.menu.findMany();
  res.json(menus);
};

// GET: menú por ID
export const getMenuById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const menu = await prisma.menu.findUnique({ where: { id: Number(id) } });
  if (!menu) return res.status(404).json({ message: "Menú no encontrado" });
  res.json(menu);
};

// POST: crear menú (solo admin)
export const createMenu = async (req: Request, res: Response) => {
  const { nombre, descripcion, precio, imagen } = req.body;

  const nuevoMenu = await prisma.menu.create({
    data: {
      nombre,
      descripcion, // es tipo JSON
      precio: Number(precio),
      imagen,
    },
  });

  res.status(201).json(nuevoMenu);
};


// PUT: actualizar menú
export const updateMenu = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, imagen } = req.body;

  try {
    const actualizado = await prisma.menu.update({
      where: { id: Number(id) },
      data: { nombre, descripcion, precio: Number(precio), imagen },
    });

    res.json(actualizado);
  } catch {
    res.status(404).json({ message: "No se pudo actualizar el menú" });
  }
};

// DELETE: eliminar menú
export const deleteMenu = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.menu.delete({ where: { id: Number(id) } });
    res.json({ message: "Menú eliminado" });
  } catch {
    res.status(404).json({ message: "No se pudo eliminar el menú" });
  }
};
