import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPerfil = async (req: Request, res: Response) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.user!.id },  // req.user.id viene del middleware auth
      select: {
        id: true,
        nombre: true,
        email: true,
        descripcion: true,
        tipo: true,
        imagen: true,
      },
    });

    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener perfil" });
  }
};

export const getTodosLosUsuarios = async (_req: Request, res: Response) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        email: true,
        password: true,
        nombre: true,
        tipo: true,
        imagen: true,
        descripcion: true,
        rol: true,
      },
    });

    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios", error });
  }
};

// Crear usuario
export const crearUsuario = async (req: Request, res: Response) => {
  try {
    const { email, password, nombre, tipo, imagen, descripcion, rol } = req.body;

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        email,
        password,
        nombre,
        tipo,
        imagen,
        descripcion,
        rol,
      },
    });

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear usuario" });
  }
};

// Actualizar usuario
export const actualizarUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, password, nombre, tipo, imagen, descripcion, rol } = req.body;

    const actualizado = await prisma.usuario.update({
      where: { id: Number(id) },
      data: {
        email,
        password,
        nombre,
        tipo,
        imagen,
        descripcion,
        rol,
      },
    });

    res.json(actualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

// Eliminar usuario
export const eliminarUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.usuario.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};
