import { useEffect, useState } from 'react';
import './FlujoReserva.css'; 
import type { Jabon } from '../types/jabon';
import type { Menu } from '../types/menu';
import type { Baño } from '../types/baño';
import { fetchAuthUser } from '../services/auth';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || '';

const FlujoReserva = () => {
  const navigate = useNavigate();
  const [baños, setBaños] = useState<Baño[]>([]);
  const [jabones, setJabones] = useState<Jabon[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);

  const [baño, setBaño] = useState('');
  const [jabonEspecial, setJabonEspecial] = useState(false);
  const [jabonSeleccionado, setJabonSeleccionado] = useState('');
  const [banquete, setBanquete] = useState(false);
  const [menuSeleccionado, setMenuSeleccionado] = useState('');
  const [fecha, setFecha] = useState('');

  const [authUser, setAuthUser] = useState<{ id: number; rol: string } | null>(null);

  useEffect(() => {
    async function fetchDatos() {
      try {
        const [resBaños, resJabones, resMenus] = await Promise.all([
          fetch(`${API_URL}/api/banos`),
          fetch(`${API_URL}/api/jabones`),
          fetch(`${API_URL}/api/menus`)
        ]);

        if (!resBaños.ok || !resJabones.ok || !resMenus.ok) {
          throw new Error('Error al cargar datos');
        }

        setBaños(await resBaños.json());
        setJabones(await resJabones.json());
        setMenus(await resMenus.json());
      } catch (error) {
        console.error(error);
      }
    }

    async function loadAuthUser() {
      const user = await fetchAuthUser();
      setAuthUser(user);
    }

    fetchDatos();
    loadAuthUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!baño || !fecha) {
      alert('Por favor, selecciona baño y fecha');
      return;
    }

    if (!authUser) {
      alert('Debes estar autenticado para hacer una reserva');
      return;
    }

    const reservaPayload = {
      bañoId: Number(baño),
      jabonId: jabonEspecial && jabonSeleccionado ? Number(jabonSeleccionado) : null,
      menuId: banquete && menuSeleccionado ? Number(menuSeleccionado) : null,
      fecha,
      usuarioId: authUser.id,
      total
    };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/reservas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(reservaPayload)
      });

      if (res.ok) {
        alert('Reserva realizada con éxito');
        navigate('/reservas'); // Redirige al historial de reservas
      } else {
        const data = await res.json();
        alert(`Error: ${data.message || 'No se pudo realizar la reserva'}`);
      }
    } catch (error) {
      alert('Error al conectar con el servidor');
      console.error(error);
    }
  };

  // -----------------------------
  // Cálculo del total con baño dinámico
  // -----------------------------
  const bañoObj = baños.find((b) => b.id === Number(baño));
  const jabonObj = jabones.find((j) => j.id === Number(jabonSeleccionado));
  const menuObj = menus.find((m) => m.id === Number(menuSeleccionado));

  const total =
    (bañoObj?.precio || 0) +
    (jabonEspecial && jabonObj ? jabonObj.precio : 0) +
    (banquete && menuObj ? menuObj.precio : 0);

  return (
    <div className="flujo">
      <div className="flujo-container">
        <h2>Reservar</h2>
        <form className="flujo-form" onSubmit={handleSubmit}>
          <label>
            Selecciona un baño:
            <select value={baño} onChange={(e) => setBaño(e.target.value)} required>
              <option value="">-- Selecciona --</option>
              {baños.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nombre} (${b.precio})
                </option>
              ))}
            </select>
          </label>

          <label>
            ¿Deseas jabones especiales?
            <input
              type="checkbox"
              checked={jabonEspecial}
              onChange={() => {
                setJabonEspecial(!jabonEspecial);
                setJabonSeleccionado('');
              }}
            />
          </label>

          {jabonEspecial && (
            <label>
              Selecciona un jabón especial:
              <select
                value={jabonSeleccionado}
                onChange={(e) => setJabonSeleccionado(e.target.value)}
              >
                <option value="">-- Selecciona --</option>
                {jabones.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.nombre} (${j.precio})
                  </option>
                ))}
              </select>
            </label>
          )}

          <label>
            ¿Deseas incluir banquete?
            <input
              type="checkbox"
              checked={banquete}
              onChange={() => {
                setBanquete(!banquete);
                setMenuSeleccionado('');
              }}
            />
          </label>

          {banquete && (
            <label>
              Selecciona un menú:
              <select
                value={menuSeleccionado}
                onChange={(e) => setMenuSeleccionado(e.target.value)}
              >
                <option value="">-- Selecciona --</option>
                {menus.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre} (${m.precio})
                  </option>
                ))}
              </select>
            </label>
          )}

          <label>
            Selecciona la fecha:
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </label>

          {/* Total a pagar */}
          <p style={{ fontWeight: 'bold', fontSize: '18px', marginTop: '1rem' }}>
            Total a pagar: ${total.toFixed(2)}
          </p>
          <div className="botones-container">
            <button type="submit" className="flujo-btn">Confirmar reserva</button>
            <button type="button" className="flujo-btn cancelar" onClick={() => navigate('/')}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FlujoReserva;
