import Navbar from "../Navbar/Navbar";
import "./Profile.css";
import "./Reservations.css";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useOutsideInteraction from "../hooks/useOutsideInteraction";
import { API_URL } from "../../lib/api";
import type { Reserva } from "../../types/reserva";
import type { Usuario } from "../../types/usuario";
import SelectorImagen from "../SelectorImagen"; 

export default function Profile() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [editUser, setEditUser] = useState<Usuario | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSelector, setShowSelector] = useState(false);

  const modalRef = useOutsideInteraction<HTMLDivElement>(
    isModalOpen && !showSelector,
    () => setIsModalOpen(false)
  );

  useEffect(() => {
    const fetchPerfilYReservas = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const [perfilRes, reservasRes] = await Promise.all([
          fetch(`${API_URL}/api/users/perfil`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/reservas/mis-reservas`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!perfilRes.ok) throw new Error("Error al obtener perfil");
        if (!reservasRes.ok) throw new Error("Error al obtener reservas");

        const perfilData = await perfilRes.json();
        const reservasData = await reservasRes.json();

        setUsuario(perfilData);
        setEditUser(perfilData);
        setReservas(reservasData);
      } catch (error) {
        console.error("Error al cargar perfil y reservas:", error);
      }
    };

    fetchPerfilYReservas();
  }, []);

  const handleGuardar = async () => {
    if (!editUser) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/users/${editUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editUser),
      });

      if (!res.ok) throw new Error("Error al actualizar perfil");

      const actualizado = await res.json();
      setUsuario(actualizado);
      setEditUser(actualizado);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
    }
  };

  const handleChange = (campo: keyof Usuario, valor: string) => {
    if (!editUser) return;
    setEditUser({ ...editUser, [campo]: valor });
  };

  const imagenesDisponibles = [
    "fachada.png",
    "images (1).jpg",
    "monstruo.png",
    "no-image.jpg",
  ];
  const basePath = "/src/assets/img";

  if (!usuario || !editUser) return null;


  
  return (
    <>
      <Navbar />
      <div className="profile-layout">
        <div className="profile">
          <div className="profile__content">
            <img src={usuario.imagen} alt={`profile picture of ${usuario.nombre}`} className="profile__image" />
            <div className="profile__info">
              <h2 className="profile__name">{usuario.nombre}</h2>
              <p className="profile__type">Tipo {usuario.tipo}</p>
              <p className="profile__email">{usuario.email}</p>
              <p className="profile__description">{usuario.descripcion}</p>
              <button className="profile__edit-button" onClick={() => setIsModalOpen(true)}>
                Editar perfil
              </button>
              <div className={`editProfile${isModalOpen ? " open" : ""}`}>
                <div ref={modalRef} className="editProfileModal">
                  <div className="editProfile__heading">
                    <i className="fas fa-xmark" onClick={() => setIsModalOpen(false)} />
                  </div>
                  <form
                    className="editProfile__form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleGuardar();
                    }}
                  >
                    <input type="text" className="form__input" placeholder="Nombre" value={editUser.nombre} onChange={(e) => handleChange("nombre", e.target.value)} />
                    <input type="text" className="form__input" placeholder="Descripción" value={editUser.descripcion} onChange={(e) => handleChange("descripcion", e.target.value)} />
                    <input type="password" className="form__input" placeholder="Contraseña" onChange={(e) => handleChange("password", e.target.value)} />
                    <input type="text" className="form__input" placeholder="Imagen" value={editUser.imagen} readOnly />
                    <button type="button" onClick={() => setShowSelector(true)}>Seleccionar imagen</button>
                    <input type="submit" className="form__btn" value="Actualizar" />
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className="profile__reservations">
            <div className="profile__reservations-container">
              {reservas.map((reserva) => (
                <div key={reserva.id} className="profile__reservation-card">
                  <h3 className="profile__reservation-service">{reserva.baño?.nombre}</h3>
                  <time className="profile__reservation-date" dateTime={reserva.fecha}>
                    {`Fecha: ${new Date(reserva.fecha).toLocaleDateString()}`}
                  </time>
                  <p className="profile__reservation-total">
                    {`Total: $${reserva.total?.toFixed(2) ?? "0.00"}`}
                  </p>
                </div>
              ))}
            </div>
            <Link className="profile__reservations-link" to="/reservas">
              <button className="profile__reservations-button">Ver todas las reservas</button>
            </Link>
          </div>
        </div>
      </div>

      {showSelector && (
        <SelectorImagen
          imagenes={imagenesDisponibles}
          basePath={basePath}
          onSeleccionar={(ruta) => {
            handleChange("imagen", ruta);
            setShowSelector(false);
          }}
          onCerrar={() => setShowSelector(false)}
        />
      )}
    </>
  );
}

