import { useEffect, useState } from 'react';
import MenuCard from './MenuCard';
import { API_URL } from '../../lib/api';
import type { Menu } from '../../types/menu';
import './MenuService.css';

export default function MenuService() {
  const [menus, setMenus] = useState<Menu[]>([]);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await fetch(`${API_URL}/api/menus`);
        const data = await res.json();
        setMenus(data);
      } catch (error) {
        console.error('Error al cargar menús:', error);
      }
    };

    fetchMenus();
  }, []);

  return (
    <div className='menuContainer'>
      <h2>Menú del Onsen</h2>
      <div className='menuGrid'>
        <MenuCard menus={menus} />
      </div>
    </div>
  );
}
