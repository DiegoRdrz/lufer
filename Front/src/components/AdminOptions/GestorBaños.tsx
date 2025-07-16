import { useEffect, useState } from "react";
import { API_URL } from "../../lib/api";
import type { Baño } from "../../types/baño";
import "./Gestor.css";
import SelectorImagen from "../SelectorImagen";

export default function GestorBaños() {

  const [showSelector, setShowSelector] = useState(false);
  const [selectorIndex, setSelectorIndex] = useState<number | null>(null);

  const [banos, setBanos] = useState<Baño[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchBanos();
  }, []);

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
    const confirmar = confirm("¿Estás seguro de eliminar este baño?");
    if (!confirmar) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/banos/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
      });
      

      if (!res.ok) throw new Error("Error al eliminar");

      setBanos((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Error al eliminar baño:", error);
    }
  };

const handleGuardar = async (index: number) => {
  const bano = banos[index];

  try {
    const token = localStorage.getItem("token");

    let res;
    let metodo: "POST" | "PUT";
    let url: string;

    // Detectamos si es un nuevo baño (ID temporal generado con Date.now)
    const esNuevo = String(bano.id).length > 10;

    if (esNuevo) {
      metodo = "POST";
      url = `${API_URL}/api/banos`;
    } else {
      metodo = "PUT";
      url = `${API_URL}/api/banos/${bano.id}`;
    }

    res = await fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bano),
    });

    if (!res.ok) throw new Error("Error al guardar baño");

    const actualizado = await res.json();

    setBanos((prev) => {
      if (esNuevo) {
        // Reemplazamos el temporal por el que vino del backend
        const sinTemporal = prev.filter((b) => b.id !== bano.id);
        return [actualizado, ...sinTemporal];
      } else {
        return prev.map((b) => (b.id === actualizado.id ? actualizado : b));
      }
    });

    setEditIndex(null);
  } catch (error) {
    console.error("Error al guardar baño:", error);
  }
};

  const handleNuevo = () => {
    const nuevo: Baño = {
      id: Date.now(), // ID temporal hasta que se guarde en backend
      nombre: "",
      descripcion: "",
      precio: 0,
      imagen: "",
    };
    setBanos((prev) => [nuevo, ...prev]);
    setEditIndex(0);
  };

  const handleChange = (index: number, campo: keyof Baño, valor: string | number) => {
    const copia = [...banos];
    (copia[index][campo] as string | number) = valor;
    setBanos(copia);
  };

  const imagenesDisponibles = [
    "balneario1.jpg",
    "balneario2.jpg",
    "baño_almas.jpg",
    "baño_dragon.jpg",
    "baño_hechizo.jpg",
    "baño_loto.jpg",
    "baño_luna.jpg",
    "baño_lunar.png",
    "baño.jpg"
  ];
  
  const basePath = "/src/assets/img/baños";

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
          {banos.map((bano, index) => (
            <tr key={bano.id}>
              {editIndex === index ? (
                <>
                  <td>
                    <input className="gestor__input" value={bano.nombre} onChange={(e) => handleChange(index, "nombre", e.target.value)} />
                  </td>
                  <td>
                    <input className="gestor__input" value={bano.descripcion} onChange={(e) => handleChange(index, "descripcion", e.target.value)} />
                  </td>
                  <td>
                    <input className="gestor__input" type="number" value={bano.precio} onChange={(e) => handleChange(index, "precio", Number(e.target.value))} />
                  </td>
                  <td>
                    <button
                      className="gestor__image-button"
                      onClick={() => {
                        setSelectorIndex(index);
                        setShowSelector(true);
                      }}
                    >
                      {bano.imagen ? "Cambiar imagen" : "Seleccionar imagen"}
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{bano.nombre}</td>
                  <td>{bano.descripcion}</td>
                  <td>${bano.precio}</td>
                  <td>{bano.imagen}</td>
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
                    <button className="gestor__delete-button" onClick={() => handleEliminar(bano.id)}>Eliminar</button>
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
