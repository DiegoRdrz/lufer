import { useEffect, useState } from "react";
import { API_URL } from "../../lib/api";
import type { Menu } from "../../types/menu";
import "./Gestor.css";
import SelectorImagen from "../SelectorImagen"; // ajusta la ruta si es diferente

export default function GestorMenu() {
  const [showSelector, setShowSelector] = useState(false);
  const [selectorIndex, setSelectorIndex] = useState<number | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [descText, setDescText] = useState<string>(""); // para el textarea de descripción en string

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/menus`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al cargar menús");
      const data = await res.json();
      setMenus(data);
    } catch (error) {
      console.error("Error al cargar menús:", error);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este menú?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/menus/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al eliminar menú");
      setMenus((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Error al eliminar menú:", error);
    }
  };

  const handleEditar = (index: number) => {
    setEditIndex(index);
    // Convertir descripción JSON a string para textarea
    setDescText(JSON.stringify(menus[index].descripcion, null, 2));
  };

  const handleGuardar = async (index: number) => {
    const menu = menus[index];
    let descripcionJSON;
  
    try {
      descripcionJSON = JSON.parse(descText);
    } catch {
      alert("La descripción debe ser un JSON válido");
      return;
    }
  
    const actualizado = {
      ...menu,
      descripcion: descripcionJSON,
    };
  
    const esNuevo = String(menu.id).length > 10;
  
    try {
      const token = localStorage.getItem("token");
  
      const res = await fetch(
        esNuevo
          ? `${API_URL}/api/menus`
          : `${API_URL}/api/menus/${menu.id}`,
        {
          method: esNuevo ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(actualizado),
        }
      );
  
      if (!res.ok) throw new Error("Error al guardar menú");
  
      const data = await res.json();
  
      setMenus((prev) => {
        if (esNuevo) {
          const sinTemporal = prev.filter((m) => m.id !== menu.id);
          return [data, ...sinTemporal];
        } else {
          return prev.map((m) => (m.id === data.id ? data : m));
        }
      });
  
      setEditIndex(null);
    } catch (error) {
      console.error("Error al guardar menú:", error);
    }
  };
  

  const handleNuevo = () => {
    const nuevo: Menu = {
      id: Date.now(),
      nombre: "",
      descripcion: [], // objeto vacío para json
      precio: 0,
      imagen: "",
    };
    setMenus((prev) => [nuevo, ...prev]);
    setEditIndex(0);
    setDescText("{}");
  };

  const handleChange = (
    index: number,
    campo: keyof Menu,
    valor: string | number
  ) => {
    const copia = [...menus];
    (copia[index] as any)[campo] = valor;
    setMenus(copia);
  };

  const imagenesDisponibles = [
    "banquete.png",
    "elixir.jpg",
    "nectar.jpg",
    "sinfonia.jpg",
  ];
  
  const basePath = "/src/assets/img/menus";

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
            <th>Descripción (JSON)</th>
            <th>Precio</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {menus.map((menu, index) => (
            <tr key={menu.id}>
              {editIndex === index ? (
                <>
                  <td>
                    <input
                      className="gestor__input"
                      value={menu.nombre}
                      onChange={(e) => handleChange(index, "nombre", e.target.value)}
                    />
                  </td>
                  <td>
                    <textarea
                      className="gestor__textarea"
                      value={descText}
                      onChange={(e) => setDescText(e.target.value)}
                      rows={5}
                    />
                  </td>
                  <td>
                    <input
                      className="gestor__input"
                      type="number"
                      value={menu.precio}
                      onChange={(e) =>
                        handleChange(index, "precio", Number(e.target.value))
                      }
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
                      {menu.imagen ? "Cambiar imagen" : "Seleccionar imagen"}
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{menu.nombre}</td>
                  <td>
                    <pre style={{ whiteSpace: "pre-wrap", maxHeight: 100, overflowY: "auto" }}>
                      {JSON.stringify(menu.descripcion, null, 2)}
                    </pre>
                  </td>
                  <td>{menu.precio}</td>
                  <td>{menu.imagen}</td>
                </>
              )}
              <td>
                {editIndex === index ? (
                  <>
                    <button
                      className="gestor__edit-button"
                      onClick={() => handleGuardar(index)}
                    >
                      Guardar
                    </button>
                    <button
                      className="gestor__delete-button"
                      onClick={() => setEditIndex(null)}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="gestor__edit-button"
                      onClick={() => handleEditar(index)}
                    >
                      Editar
                    </button>
                    <button
                      className="gestor__delete-button"
                      onClick={() => handleEliminar(menu.id)}
                    >
                      Eliminar
                    </button>
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
