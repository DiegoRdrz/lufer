import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Usuario logueado crea una reserva
export const createReserva = async (req: Request, res: Response) => {
  const { fecha, bañoId, jabonId, menuId, total } = req.body;  // total agregado

  if (!bañoId) {
    return res.status(400).json({ message: "El baño es obligatorio" });
  }

  try {
    const reserva = await prisma.reserva.create({
      data: {
        fecha: new Date(fecha),
        usuarioId: req.user!.id,
        bañoId,
        jabonId: jabonId || null,
        menuId: menuId || null,
        total: total ?? 0, // asigna total o 0 si no viene
      },
      include: {
        baño: true,
        jabon: true,
        menu: true,
      },
    });

    res.status(201).json(reserva);
  } catch (error) {
    res.status(500).json({ message: "Error al crear reserva", error });
  }
};


// ✅ Usuario ve sus propias reservas
export const getMisReservas = async (req: Request, res: Response) => {
  const reservas = await prisma.reserva.findMany({
    where: { usuarioId: req.user!.id },
    include: {
      baño: true,
      jabon: true,
      menu: true,
    },
  });

  res.json(reservas);
};

// ✅ Admin ve todas las reservas
export const getTodasLasReservas = async (_req: Request, res: Response) => {
  const reservas = await prisma.reserva.findMany({
    include: {
      usuario: true,
      baño: true,
      jabon: true,
      menu: true,
    },
  });

  res.json(reservas);
};

export const updateReserva = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { fecha, jabonId, menuId, total } = req.body;  // total agregado

  try {
    const actualizada = await prisma.reserva.update({
      where: { id: Number(id) },
      data: {
        fecha: new Date(fecha),
        jabonId: jabonId || null,
        menuId: menuId || null,
        total: total ?? 0,  // asigna total o 0 si no viene
      },
      include: {
        baño: true,
        jabon: true,
        menu: true,
      },
    });

    res.json(actualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "No se pudo actualizar la reserva" });
  }
};


  

// (opcional) Eliminar reserva
export const deleteReserva = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.reserva.delete({ where: { id: Number(id) } });
    res.json({ message: "Reserva eliminada" });
  } catch {
    res.status(404).json({ message: "No se pudo eliminar la reserva" });
  }
};
