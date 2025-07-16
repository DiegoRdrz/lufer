export interface Menu {
    id: number;
    nombre: string;
    descripcion: string[]; // Prisma lo guarda como JSON
    precio: number;
    imagen?: string;
  }
  