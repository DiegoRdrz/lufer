import { useEffect, useState } from 'react';
import type { Reserva } from '../types/reserva';
import type { Jabon } from '../types/jabon';
import type { Menu } from '../types/menu';
import type { Baño } from '../types/baño';
import './Reservas.css';
import { API_URL } from '../lib/api';
import Navbar from '../components/Navbar/Navbar';

const Reservas: React.FC = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  // Estados de edición por reserva (usamos objetos para guardar por id)
  const [nuevaFecha, setNuevaFecha] = useState<{ [id: number]: string }>({});
  const [nuevoJabonId, setNuevoJabonId] = useState<{ [id: number]: number | null }>({});
  const [nuevoMenuId, setNuevoMenuId] = useState<{ [id: number]: number | null }>({});
  const [nuevoBañoId, setNuevoBañoId] = useState<{ [id: number]: number | null }>({});

  const [jabones, setJabones] = useState<Jabon[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [baños, setBaños] = useState<Baño[]>([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resReservas, resJabones, resMenus, resBanos] = await Promise.all([
          fetch(`${API_URL}/api/reservas/mis-reservas`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${API_URL}/api/jabones`),
          fetch(`${API_URL}/api/menus`),
          fetch(`${API_URL}/api/banos`)
        ]);

        const dataReservas = await resReservas.json();
        const dataJabones = await resJabones.json();
        const dataMenus = await resMenus.json();
        const dataBanos = await resBanos.json();

        if (resReservas.ok) {
          setReservas(dataReservas);
          setJabones(dataJabones);
          setMenus(dataMenus);
          setBaños(dataBanos);
        } else {
          console.error('Error al cargar reservas:', dataReservas.message);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    fetchData();
  }, [token]);

  const handleCancelar = async (id: number) => {
    const confirmar = confirm("¿Estás seguro de que deseas cancelar esta reserva?");
    if (!confirmar) return;

    try {
      const res = await fetch(`${API_URL}/api/reservas/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setReservas((prev) => prev.filter((reserva) => reserva.id !== id));
      } else {
        const data = await res.json();
        alert(`Error al cancelar reserva: ${data.message}`);
      }
    } catch (error) {
      alert('Error al cancelar reserva');
      console.error(error);
    }
  };

  const handleModificar = (id: number) => {
    const reserva = reservas.find(r => r.id === id);
    if (!reserva) return;

    setEditandoId(id);
    setNuevaFecha(prev => ({ ...prev, [id]: reserva.fecha.split('T')[0] }));
    setNuevoJabonId(prev => ({ ...prev, [id]: reserva.jabonId ?? null }));
    setNuevoMenuId(prev => ({ ...prev, [id]: reserva.menuId ?? null }));
    setNuevoBañoId(prev => ({ ...prev, [id]: reserva.bañoId ?? null }));
  };

  const handleGuardar = async (id: number) => {
    const fecha = nuevaFecha[id];
    const jabonId = nuevoJabonId[id];
    const menuId = nuevoMenuId[id];
    const bañoId = nuevoBañoId[id];

    if (!fecha) {
      alert('La fecha no puede estar vacía');
      return;
    }

    const bañoSeleccionado = baños.find(b => b.id === bañoId);
    const jabonSeleccionado = jabones.find(j => j.id === jabonId);
    const menuSeleccionado = menus.find(m => m.id === menuId);

    const total =
      (bañoSeleccionado?.precio || 0) +
      (jabonSeleccionado?.precio || 0) +
      (menuSeleccionado?.precio || 0);

    try {
      const res = await fetch(`${API_URL}/api/reservas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          fecha,
          jabonId,
          menuId,
          bañoId,
          total
        })
      });

      if (res.ok) {
        const actualizada = await res.json();
        setReservas(prev =>
          prev.map(r => (r.id === id ? { ...r, ...actualizada } : r))
        );
        setEditandoId(null);
      } else {
        const data = await res.json();
        alert(`Error al guardar cambios: ${data.message}`);
      }
    } catch (error) {
      alert('Error al guardar cambios');
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="reservas-container">
        <h2>Mis reservas</h2>
        <ul>
          {reservas.map((reserva) => {
            const editando = editandoId === reserva.id;

            // Para mostrar total dinámico al editar:
            const bañoSeleccionado = baños.find(b => b.id === (editando ? (nuevoBañoId[reserva.id] ?? reserva.bañoId) : reserva.bañoId));
            const jabonSeleccionado = jabones.find(j => j.id === (editando ? (nuevoJabonId[reserva.id] ?? reserva.jabonId) : reserva.jabonId));
            const menuSeleccionado = menus.find(m => m.id === (editando ? (nuevoMenuId[reserva.id] ?? reserva.menuId) : reserva.menuId));

            const total =
              (bañoSeleccionado?.precio || 0) +
              (jabonSeleccionado?.precio || 0) +
              (menuSeleccionado?.precio || 0);

            return (
              <li key={reserva.id} className="reserva-card">
                <p><strong>Servicio:</strong> {
                  editando ? (
                    <select
                      value={nuevoBañoId[reserva.id] ?? ''}
                      onChange={(e) => {
                        const nuevoId = e.target.value ? Number(e.target.value) : null;
                        setNuevoBañoId(prev => ({ ...prev, [reserva.id]: nuevoId }));
                      }}
                    >
                      <option value="">-- Selecciona baño --</option>
                      {baños.map((b) => (
                        <option key={b.id} value={b.id}>{b.nombre}</option>
                      ))}
                    </select>
                  ) : (
                    reserva.baño?.nombre || 'N/A'
                  )
                }</p>

                <p><strong>Fecha:</strong> {
                  editando ? (
                    <input
                      type="date"
                      value={nuevaFecha[reserva.id] ?? ''}
                      onChange={(e) => setNuevaFecha(prev => ({ ...prev, [reserva.id]: e.target.value }))}
                    />
                  ) : (
                    new Date(reserva.fecha).toLocaleDateString()
                  )
                }</p>

                <p><strong>Jabón especial:</strong> {
                  editando ? (
                    <select
                      value={nuevoJabonId[reserva.id] ?? ''}
                      onChange={(e) =>
                        setNuevoJabonId(prev => ({ ...prev, [reserva.id]: e.target.value ? Number(e.target.value) : null }))
                      }
                    >
                      <option value="">Ninguno</option>
                      {jabones.map((j) => (
                        <option key={j.id} value={j.id}>{j.nombre}</option>
                      ))}
                    </select>
                  ) : (
                    reserva.jabon?.nombre || 'Ninguno'
                  )
                }</p>

                <p><strong>Banquete:</strong> {
                  editando ? (
                    <select
                      value={nuevoMenuId[reserva.id] ?? ''}
                      onChange={(e) =>
                        setNuevoMenuId(prev => ({ ...prev, [reserva.id]: e.target.value ? Number(e.target.value) : null }))
                      }
                    >
                      <option value="">Ninguno</option>
                      {menus.map((m) => (
                        <option key={m.id} value={m.id}>{m.nombre}</option>
                      ))}
                    </select>
                  ) : (
                    reserva.menu?.nombre || 'Ninguno'
                  )
                }</p>

                <p><strong>Total:</strong> ${total.toFixed(2)}</p>

                <div className="reserva-btns">
                  {editando ? (
                    <>
                      <button className="btn-guardar" onClick={() => handleGuardar(reserva.id)}>Guardar</button>
                      <button className="btn-cancelar" onClick={() => setEditandoId(null)}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button className="btn-modificar" onClick={() => handleModificar(reserva.id)}>Modificar</button>
                      <button className="btn-cancelar" onClick={() => handleCancelar(reserva.id)}>Cancelar</button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Reservas;
