import { useEffect, useState } from "react";
import { API_URL } from "../../lib/api";  // O la ruta correcta de tu env o configuración
import "./Gestor.css";

interface ElementoLimpieza {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
}

export default function GestorElementosLimpieza() {
  const [elementos, setElementos] = useState<ElementoLimpieza[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchElementos();
  }, []);

  const fetchElementos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/elementos`);
      const data = await res.json();
      setElementos(data);
    } catch (error) {
      console.error("Error al cargar elementos de limpieza:", error);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este elemento?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/elementos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al eliminar");

      setElementos((prev) => prev.filter((el) => el.id !== id));
    } catch (error) {
      console.error("Error al eliminar elemento de limpieza:", error);
    }
  };

  const handleGuardar = async (index: number) => {
    const elemento = elementos[index];

    try {
      const token = localStorage.getItem("token");
      let metodo: "POST" | "PUT";
      let url: string;

      // Detectar si es un nuevo elemento (ID temporal generado con Date.now)
      const esNuevo = String(elemento.id).length > 10;

      if (esNuevo) {
        metodo = "POST";
        url = `${API_URL}/api/elementos`;
      } else {
        metodo = "PUT";
        url = `${API_URL}/api/elementos/${elemento.id}`;
      }

      const res = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(elemento),
      });

      if (!res.ok) throw new Error("Error al guardar elemento");

      const actualizado = await res.json();

      setElementos((prev) => {
        if (esNuevo) {
          const sinTemporal = prev.filter((el) => el.id !== elemento.id);
          return [actualizado, ...sinTemporal];
        } else {
          return prev.map((el) => (el.id === actualizado.id ? actualizado : el));
        }
      });

      setEditIndex(null);
    } catch (error) {
      console.error("Error al guardar elemento de limpieza:", error);
    }
  };

  const handleNuevo = () => {
    const nuevo: ElementoLimpieza = {
      id: Date.now(), // ID temporal
      nombre: "",
      descripcion: "",
      precio: 0,
    };
    setElementos((prev) => [nuevo, ...prev]);
    setEditIndex(0);
  };

  const handleChange = (index: number, campo: keyof ElementoLimpieza, valor: string | number) => {
    const copia = [...elementos];
    copia[index][campo] = valor as never;
    setElementos(copia);
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
            <th>Descripción</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {elementos.map((el, index) => (
            <tr key={el.id}>
              {editIndex === index ? (
                <>
                  <td>
                    <input
                      className="gestor__input"
                      value={el.nombre}
                      onChange={(e) => handleChange(index, "nombre", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className="gestor__input"
                      value={el.descripcion}
                      onChange={(e) => handleChange(index, "descripcion", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className="gestor__input"
                      type="number"
                      value={el.precio}
                      onChange={(e) => handleChange(index, "precio", Number(e.target.value))}
                    />
                  </td>
                </>
              ) : (
                <>
                  <td>{el.nombre}</td>
                  <td>{el.descripcion}</td>
                  <td>${el.precio.toFixed(2)}</td>
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
                    <button className="gestor__delete-button" onClick={() => handleEliminar(el.id)}>Eliminar</button>
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
