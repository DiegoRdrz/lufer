import { useEffect, useState } from 'react';
import BañoCard from './BañoCard';
import { API_URL } from '../../lib/api';
import type { Baño } from '../../types/baño'; // ✅ Usamos tipo centralizado
import './BañosService.css';

export default function BañosService() {
  const [baños, setBaños] = useState<Baño[]>([]);

  useEffect(() => {
    const fetchBaños = async () => {
      try {
        const res = await fetch(`${API_URL}/api/banos`);
        const data = await res.json();
        setBaños(data);
      } catch (error) {
        console.error('Error al cargar baños:', error);
      }
    };

    fetchBaños();
  }, []);

  return (
    <div className='bañosContainer'>
      <h2>Baños del Onsen</h2>
      <div className='bañosGrid'>
        <BañoCard baños={baños} />
      </div>
    </div>
  );
}
