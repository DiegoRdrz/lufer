export type Rol = 'ADMIN' | 'USER';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password: string;
  tipo?: string;
  imagen?: string;
  descripcion?: string;
  rol: Rol;
}
