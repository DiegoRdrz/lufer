import { Link } from 'react-router-dom';
import type { Usuario } from '../../types/usuario'; // ajusta el path si está en otra carpeta

interface OptionsProps {
  authUser: Usuario | null;
}

export default function Options({ authUser }: OptionsProps) {
  return (
    <>
      <Link to="/baños" className="navbar__btn--option" id="bañosBtn">Baños</Link>
      <Link to="/menu" className="navbar__btn--option" id="menuBtn">Menú</Link>
      <Link to="/jabones" className="navbar__btn--option" id="jabonesBtn">Jabones</Link>

      {authUser?.rol === 'USER' && (
        <Link to="/reservar" className="navbar__btn--option" id="reservarBtn">
          Reservar
        </Link>
      )}

      {authUser?.rol === 'ADMIN' && (
        <Link to="/admin-options" className="navbar__btn--option" id="adminBtn">
          adminPanel
        </Link>
      )}
    </>
  );
}
