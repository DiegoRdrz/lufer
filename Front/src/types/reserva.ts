import type { Baño } from './baño';
import type { Jabon } from './jabon';
import type { Menu } from './menu';

export interface Reserva {
  id: number;
  fecha: string;
  bañoId: number;
  jabonId?: number | null;
  menuId?: number | null;
  baño?: Baño; // incluir esto para que puedas acceder a .precio
  jabon?: Jabon;
  menu?: Menu;
  total?: number;
}