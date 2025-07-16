import { useState } from 'react';
import { Link } from 'react-router-dom';
import useOutsideInteraction from '../hooks/useOutsideInteraction';

export default function LogInBtn() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const modalRef = useOutsideInteraction<HTMLDivElement>(
        isModalOpen,
        () => setIsModalOpen(false)
    );

    return (
        <>
        <button className='navbar__notLogged--btn' onClick={ () => setIsModalOpen(!isModalOpen) }>
            Log in
            <span id='btn--arrow'>&#11167;</span>
        </button>
        <div ref={ modalRef } className={ `loginModal${isModalOpen ? ' open' : ''}` }>
            <button className='loginModal__btn--close' onClick={ () => setIsModalOpen(!isModalOpen) }>&times;</button>
            <h3>Perfil</h3>
            <p className='loginModal__content'>
                Un perfil permite realizar reservas y mejorar su experiencia
            </p>
            <div className='loginModal__btns'>
                <Link to='/login' className='loginModal__btn--login'>Iniciar sesión</Link>
                <Link to='/signup' className='loginModal__btn--signup'>Registrarse</Link>
            </div>
        </div>
        </>
    );
}