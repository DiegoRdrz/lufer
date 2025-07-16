import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Cargar datos desde JSON
  const baños = JSON.parse(fs.readFileSync(path.join(__dirname, '../../Front/src/data/baños.json'), 'utf-8'));
  const jabones = JSON.parse(fs.readFileSync(path.join(__dirname, '../../Front/src/data/jabones.json'), 'utf-8'));
  const menus = JSON.parse(fs.readFileSync(path.join(__dirname, '../../Front/src/data/menu.json'), 'utf-8'));
  const usuarios = JSON.parse(fs.readFileSync(path.join(__dirname, '../../Front/src/data/users.json'), 'utf-8'));

  // Insertar baños
  for (const baño of baños) {
    await prisma.baño.create({
      data: {
        nombre: baño.nombre,
        descripcion: baño.descripcion,
        precio: baño.precio,
        imagen: baño.imagen,
      },
    });
  }

  // Insertar jabones
  for (const jabon of jabones) {
    await prisma.jabon.create({
      data: {
        nombre: jabon.nombre,
        descripcion: jabon.descripcion,
        precio: jabon.precio,
        imagen: jabon.imagen,
      },
    });
  }

  // Insertar menús
  for (const menu of menus) {
    await prisma.menu.create({
      data: {
        nombre: menu.nombre,
        descripcion: Array.isArray(menu.descripcion) ? menu.descripcion : [menu.descripcion],
        precio: menu.precio,
        imagen: menu.imagen,
      },
    });
  }

  // Insertar usuarios con contraseña hasheada
  for (const user of usuarios) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    await prisma.usuario.create({
      data: {
        nombre: user.nombre,
        email: user.email,
        password: hashedPassword,
        tipo: user.tipo,
        imagen: user.imagen,
        descripcion: user.descripcion,
        rol: user.rol.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER',
      },
    });
  }

  console.log('Datos insertados correctamente con contraseñas hasheadas.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
