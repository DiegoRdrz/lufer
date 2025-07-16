import { useEffect, useState } from 'react';
import JabonCard from './JabonCard';
import { API_URL } from '../../lib/api';
import type { Jabon } from '../../types/jabon';
import './JabonesService.css';

export default function JabonService() {
  const [jabones, setJabones] = useState<Jabon[]>([]);

  useEffect(() => {
    const fetchJabones = async () => {
      try {
        const res = await fetch(`${API_URL}/api/jabones`);
        const data = await res.json();
        setJabones(data);
      } catch (error) {
        console.error('Error al cargar jabones:', error);
      }
    };

    fetchJabones();
  }, []);

  return (
    <div className='jabonContainer'>
      <h2>Jabones del Onsen</h2>
      <div className='jabonGrid'>
        <JabonCard jabones={jabones} />
      </div>
    </div>
  );
}
