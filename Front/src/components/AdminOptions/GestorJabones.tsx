import { useEffect, useState } from "react";
import { API_URL } from "../../lib/api";
import type { Jabon } from "../../types/jabon";
import "./Gestor.css";
import SelectorImagen from "../SelectorImagen";

export default function GestorJabones() {
  const [showSelector, setShowSelector] = useState(false);
  const [selectorIndex, setSelectorIndex] = useState<number | null>(null);

  const [jabones, setJabones] = useState<Jabon[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchJabones();
  }, []);

  const fetchJabones = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/jabones`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al cargar jabones");
      const data = await res.json();
      setJabones(data);
    } catch (error) {
      console.error("Error al cargar jabones:", error);
    }
  };

  const handleEliminar = async (id: number) => {
    const confirmar = confirm("¿Estás seguro de eliminar este jabón?");
    if (!confirmar) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/jabones/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al eliminar");

      setJabones((prev) => prev.filter((j) => j.id !== id));
    } catch (error) {
      console.error("Error al eliminar jabón:", error);
    }
  };

  const handleGuardar = async (index: number) => {
    const jabon = jabones[index];
  
    try {
      const token = localStorage.getItem("token");
  
      const esNuevo = String(jabon.id).length > 10;
  
      const res = await fetch(
        esNuevo
          ? `${API_URL}/api/jabones`
          : `${API_URL}/api/jabones/${jabon.id}`,
        {
          method: esNuevo ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(jabon),
        }
      );
  
      if (!res.ok) throw new Error("Error al guardar jabón");
  
      const actualizado = await res.json();
  
      setJabones((prev) => {
        if (esNuevo) {
          // Reemplazar el temporal por el que vino del backend
          const sinTemporal = prev.filter((j) => j.id !== jabon.id);
          return [actualizado, ...sinTemporal];
        } else {
          return prev.map((j) => (j.id === actualizado.id ? actualizado : j));
        }
      });
  
      setEditIndex(null);
    } catch (error) {
      console.error("Error al guardar cambios:", error);
    }
  };
  

  const handleNuevo = () => {
    const nuevo: Jabon = {
      id: Date.now(),
      nombre: "",
      descripcion: "",
      precio: 0,
      imagen: "",
    };
    setJabones((prev) => [nuevo, ...prev]);
    setEditIndex(0);
  };

  const handleChange = (index: number, campo: keyof Jabon, valor: string | number) => {
    const copia = [...jabones];
    (copia[index] as any)[campo] = valor;
    setJabones(copia);
  };

  const imagenesDisponibles = [
    "jabon rayo.jpg",
    "jabon_fenix.jpg",
    "jabon_infra.jpg",
    "jabon_loto.jpg",
    "jabon_sauce.jpg",
    "jabon_silver.jpg"
  ];
  
  const basePath = "/src/assets/img/jabones"; // ajusta si tu ruta es distinta

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
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {jabones.map((jabon, index) => (
            <tr key={jabon.id}>
              {editIndex === index ? (
                <>
                  <td>
                    <input
                      className="gestor__input"
                      value={jabon.nombre}
                      onChange={(e) => handleChange(index, "nombre", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className="gestor__input"
                      value={jabon.descripcion}
                      onChange={(e) => handleChange(index, "descripcion", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="gestor__input"
                      value={jabon.precio}
                      onChange={(e) => handleChange(index, "precio", Number(e.target.value))}
                    />
                  </td>
                  <td>
                    <button
                      className="gestor__image-button"
                      onClick={() => {
                        setSelectorIndex(index);
                        setShowSelector(true);
                      }}
                    >
                      {jabon.imagen ? "Cambiar imagen" : "Seleccionar imagen"}
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{jabon.nombre}</td>
                  <td>{jabon.descripcion}</td>
                  <td>${jabon.precio}</td>
                  <td>{jabon.imagen}</td>
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
                    <button className="gestor__delete-button" onClick={() => handleEliminar(jabon.id)}>Eliminar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showSelector && selectorIndex !== null && (
        <SelectorImagen
          imagenes={imagenesDisponibles}
          basePath={basePath}
          onSeleccionar={(ruta) => {
            handleChange(selectorIndex, "imagen", ruta);
            setShowSelector(false);
            setSelectorIndex(null);
          }}
          onCerrar={() => {
            setShowSelector(false);
            setSelectorIndex(null);
          }}
        />
      )}
    </div>
  );
}