import "../pages/AdminOptions.css";
import GestorBaños from '../components/AdminOptions/GestorBaños';
import GestorJabones from '../components/AdminOptions/GestorJabones';
import GestorUsuarios from '../components/AdminOptions/GestorUsuarios';
import GestorMenu from '../components/AdminOptions/GestorMenu';
import GestorPersonalLimpieza from '../components/AdminOptions/GestorPersonalLimpieza';
import GestorElementosLimpieza from '../components/AdminOptions/GestorElementosLimpieza';
import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar';  // <-- Importa Navbar

export default function AdminOptions() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('loggedUser') || 'null');

  useEffect(() => {
    if (!user || user.rol !== 'ADMIN') {
      navigate('/');
    }
  }, []);

  const adminOptions = [
    { title: "Gestion de Baños", component: <GestorBaños /> },
    { title: "Gestion de Jabones", component: <GestorJabones /> },
    { title: "Gestion de Usuarios", component: <GestorUsuarios /> },
    { title: "Gestion de Menu", component: <GestorMenu /> },
    { title: "Gestion de Elementos de limpieza", component: <GestorElementosLimpieza /> },
    { title: "Gestion de Personal de limpieza", component: <GestorPersonalLimpieza /> },
  ];

  const [selectedOption, setSelectedOption] = React.useState<string | null>("Gestion de Baños");

  return (
    <>
      <Navbar /> {/* Aquí se carga el navbar */}
      <div className="admin-options">
        <div className="admin-options__sidebar">
          <h2 className="admin-options__sidebar-title">Opciones</h2>
          <ul className="admin-options__sidebar-list">
            {adminOptions.map((item, i) => (
              <li className="admin-options__sidebar-item" key={i}>
                <button className="admin-options__sidebar-button" onClick={() => setSelectedOption(item.title)}>{item.title}</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="admin-options__content">
          {adminOptions.find(option => option.title === selectedOption)?.component}
        </div>
      </div>
    </>
  );
}
