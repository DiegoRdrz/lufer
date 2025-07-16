import { useEffect, useState } from "react";
import { API_URL } from "../../lib/api";
import type { Usuario } from "../../types/usuario";
import "./Gestor.css";
import bcrypt from "bcryptjs"; // al inicio
import SelectorImagen from "../SelectorImagen";

export default function GestorUsuarios() {
  const [showSelector, setShowSelector] = useState(false);
  const [selectorIndex, setSelectorIndex] = useState<number | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al cargar usuarios");
      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  const handleEliminar = async (id: number) => {
    const confirmar = confirm("¿Estás seguro de eliminar este usuario?");
    if (!confirmar) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al eliminar");

      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  const handleGuardar = async (index: number) => {
    let usuario = usuarios[index];
    const esNuevo = String(usuario.id).length > 10;
  
    try {
      const token = localStorage.getItem("token");
  
      // 👉 Solo si es nuevo o cambió la contraseña (opcionalmente podrías validar que no esté vacía)
      if (usuario.password && !usuario.password.startsWith("$2b$")) {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(usuario.password, salt);
        usuario = { ...usuario, password: hashed };
      }
  
      const res = await fetch(
        esNuevo ? `${API_URL}/api/users` : `${API_URL}/api/users/${usuario.id}`,
        {
          method: esNuevo ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(usuario),
        }
      );
  
      if (!res.ok) throw new Error("Error al guardar usuario");
  
      const actualizado = await res.json();
  
      setUsuarios((prev) => {
        if (esNuevo) {
          const sinTemporal = prev.filter((u) => u.id !== usuario.id);
          return [actualizado, ...sinTemporal];
        } else {
          return prev.map((u) => (u.id === actualizado.id ? actualizado : u));
        }
      });
  
      setEditIndex(null);
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    }
  };
  

  const handleNuevo = () => {
    const nuevo: Usuario = {
      id: Date.now(),
      nombre: "",
      email: "",
      password: "",
      tipo: "",
      imagen: "",
      descripcion: "",
      rol: "USER",
    };
    setUsuarios((prev) => [nuevo, ...prev]);
    setEditIndex(0); // editar el nuevo de una
  };

  const handleChange = (index: number, campo: keyof Usuario, valor: string) => {
    const copia = [...usuarios];
    (copia[index][campo] as string) = valor;
    setUsuarios(copia);
  };

  const imagenesDisponibles = [
    "fachada.png",
    "images (1).jpg",
    "monstruo.png",
    "no-image.jpg",
  ];
  const basePath = "/src/assets/img";

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
            <th>ID</th>
            <th>Email</th>
            <th>Contraseña</th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Imagen</th>
            <th>Descripción</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario, index) => (
            <tr key={usuario.id}>
              {editIndex === index ? (
                <>
                  <td>{usuario.id}</td>
                  <td><input className="gestor__input" value={usuario.email} onChange={(e) => handleChange(index, "email", e.target.value)} /></td>
                  <td><input className="gestor__input" value={usuario.password} onChange={(e) => handleChange(index, "password", e.target.value)} /></td>
                  <td><input className="gestor__input" value={usuario.nombre} onChange={(e) => handleChange(index, "nombre", e.target.value)} /></td>
                  <td><input className="gestor__input" value={usuario.tipo} onChange={(e) => handleChange(index, "tipo", e.target.value)} /></td>
                  <td>
                    <button
                      className="gestor__image-button"
                      onClick={() => {
                        setSelectorIndex(index);
                        setShowSelector(true);
                      }}
                    >
                      {usuario.imagen ? "Cambiar imagen" : "Seleccionar imagen"}
                    </button>
                  </td>
                  <td><input className="gestor__input" value={usuario.descripcion} onChange={(e) => handleChange(index, "descripcion", e.target.value)} /></td>
                  <td>
                    <select value={usuario.rol} onChange={(e) => handleChange(index, "rol", e.target.value)}>
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                </>
              ) : (
                <>
                  <td>{usuario.id}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.password}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.tipo}</td>
                  <td>{usuario.imagen}</td>
                  <td>{usuario.descripcion}</td>
                  <td>{usuario.rol}</td>
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
                    <button className="gestor__delete-button" onClick={() => handleEliminar(usuario.id)}>Eliminar</button>
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
