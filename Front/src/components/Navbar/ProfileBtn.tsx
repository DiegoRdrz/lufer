import { useState } from 'react';
import useOutsideInteraction from '../hooks/useOutsideInteraction';
import { Link, useNavigate } from 'react-router-dom';

interface ProfileBtnProps {
    isPhone: boolean
}

const ProfileBtn = ({isPhone}: ProfileBtnProps) => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const modalRef = useOutsideInteraction<HTMLDivElement>(
        isModalOpen,
        () => setIsModalOpen(false)
    );
    return (
        <>
            { !isPhone ?
            <>
            <i
                className='fa-solid fa-circle-user icon'
                onClick={() => setIsModalOpen(!isModalOpen)} />
            </>
            :
            <>
            <button
                className='profileBtn'
                onClick={() => setIsModalOpen(!isModalOpen)}>
                    Perfil <i className='fa-solid fa-chevron-down'/>
            </button>
            </> }
            <div ref={modalRef} className={`profile-modal${isModalOpen ? ' open' : ''}`}>
                <i 
                    className='fa-solid fa-xmark profileModal__btn--close'
                    onClick={() => setIsModalOpen(!isModalOpen)}/>
                <Link to=''></Link> 
                <Link to='/reservas' className='profileModal__btn'>Mis reservas</Link>
                <Link to='/profile' className='profileModal__btn'>Mi perfil</Link>
                <button
                    className='profileModal__btn--closeSession'
                    onClick={() => {
                        localStorage.removeItem('loggedUser');
                        navigate('/');
                    }}>
                    Cerrar sesión
                </button>
            </div>
        </>
    );
}

export default ProfileBtn;