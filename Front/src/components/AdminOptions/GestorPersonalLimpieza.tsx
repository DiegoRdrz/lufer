import { useEffect, useState } from "react";
import { API_URL } from "../../lib/api";
import type { Baño } from "../../types/baño"; // Para la lista de baños
import "./Gestor.css";

interface PersonalLimpieza {
  id: number;
  nombre: string;
  tarea: string;
  bañoId: number;
  baño?: Baño; // Para mostrar el nombre del baño
}

export default function GestorPersonalLimpieza() {
  const [personal, setPersonal] = useState<PersonalLimpieza[]>([]);
  const [banos, setBanos] = useState<Baño[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchPersonal();
    fetchBanos();
  }, []);

  const fetchPersonal = async () => {
    try {
      const res = await fetch(`${API_URL}/api/personal`);
      const data = await res.json();
      setPersonal(data);
    } catch (error) {
      console.error("Error al cargar personal de limpieza:", error);
    }
  };

  const fetchBanos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/banos`);
      const data = await res.json();
      setBanos(data);
    } catch (error) {
      console.error("Error al cargar baños:", error);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este personal?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/personal/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Error al eliminar");

      setPersonal((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error al eliminar personal de limpieza:", error);
    }
  };

  const handleGuardar = async (index: number) => {
    const p = personal[index];

    try {
      const token = localStorage.getItem("token");
      let metodo: "POST" | "PUT";
      let url: string;

      const esNuevo = String(p.id).length > 10;

      if (esNuevo) {
        metodo = "POST";
        url = `${API_URL}/api/personal`;
      } else {
        metodo = "PUT";
        url = `${API_URL}/api/personal/${p.id}`;
      }

      const res = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(p),
      });

      if (!res.ok) throw new Error("Error al guardar personal");

      const actualizado = await res.json();

      setPersonal((prev) => {
        if (esNuevo) {
          const sinTemporal = prev.filter((el) => el.id !== p.id);
          return [actualizado, ...sinTemporal];
        } else {
          return prev.map((el) => (el.id === actualizado.id ? actualizado : el));
        }
      });

      setEditIndex(null);
    } catch (error) {
      console.error("Error al guardar personal de limpieza:", error);
    }
  };

  const handleNuevo = () => {
    const nuevo: PersonalLimpieza = {
      id: Date.now(),
      nombre: "",
      tarea: "",
      bañoId: banos.length > 0 ? banos[0].id : 0,
    };
    setPersonal((prev) => [nuevo, ...prev]);
    setEditIndex(0);
  };

  const handleChange = (index: number, campo: keyof PersonalLimpieza, valor: string | number) => {
    const copia = [...personal];
    copia[index][campo] = valor as never;
    setPersonal(copia);
  };

  return (
    <div className="gestor">
      <div className="gestor__header">
        <h2>Gestión de Baños</h2>
        <button className="gestor__add-button" onClick={handleNuevo}>
          <span style={{ fontSize: "20px", fontWeight: "bold" }}>+</span> Nuevo
        </button>
      </div>
      
      <table className="gestor__table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tarea</th>
            <th>Baño</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {personal.map((p, index) => (
            <tr key={p.id}>
              {editIndex === index ? (
                <>
                  <td>
                    <input
                      className="gestor__input"
                      value={p.nombre}
                      onChange={(e) => handleChange(index, "nombre", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className="gestor__input"
                      value={p.tarea}
                      onChange={(e) => handleChange(index, "tarea", e.target.value)}
                      placeholder="Limbiar"
                    />
                  </td>
                  <td>
                    <select
                      className="gestor__input"
                      value={p.bañoId}
                      onChange={(e) => handleChange(index, "bañoId", Number(e.target.value))}
                    >
                      {banos.map((b) => (
                        <option key={b.id} value={b.id}>{b.nombre}</option>
                      ))}
                    </select>
                  </td>
                </>
              ) : (
                <>
                  <td>{p.nombre}</td>
                  <td>{p.tarea}</td>
                  <td>{p.baño ? p.baño.nombre : "—"}</td>
                </>
              )}
              <td>
                {editIndex === index ? (
                  <>
                    <button className="gestor__edit-button" onClick={() => handleGuardar(index)}>Guardar</button>
                    <button className="gestor__delete-button" onClick={() => setEditIndex(null)}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button className="gestor__edit-button" onClick={() => setEditIndex(index)}>Editar</button>
                    <button className="gestor__delete-button" onClick={() => handleEliminar(p.id)}>Eliminar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
