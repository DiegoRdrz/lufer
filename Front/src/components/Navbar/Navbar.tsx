import { useState } from 'react';
import { Link } from 'react-router-dom';
import useOutsideInteraction from '../hooks/useOutsideInteraction';
import onsenLogo from '../../assets/img/Dogo-Onsen-logo.png';
import Options from './Options';
import LogInBtn from './LogInBtn';
import ProfileBtn from './ProfileBtn';
import './Navbar.css';

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem('loggedUser') || 'null');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useOutsideInteraction<HTMLDivElement>(
    isMenuOpen,
    () => setIsMenuOpen(false)
  );

  return (
    <>
      <nav className='navbar'>
        <Link to='/'>
          <img className='navbar__logo' src={ onsenLogo }/>
        </Link>
        <div className='navbar__options--desktop'>
          <Options authUser={user} />
          {!user ? <LogInBtn /> : <ProfileBtn isPhone={false} />}
        </div>
        <div ref={menuRef} className={`navbar__options--mobile ${isMenuOpen ? 'open' : ''}`}>
          <Options authUser={user} />
          {!user ? <LogInBtn /> : <ProfileBtn isPhone={true} />}
        </div>
      </nav>
    </>
  )
}

