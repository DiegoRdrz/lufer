import { Link } from 'react-router-dom';
import notFoundIcon from '../../assets/img/NotFoundIcon.png';
import './NotFound.css';

export default function NotFound() {
  return (
    <main className='notFound'>
        <img 
            src={ notFoundIcon } 
            className='notFound__img' />
        <div className='notFound__description'>
            <h1 className='notFound__title'>404</h1>
            <p className='notFound__message'>La página que buscas no existe</p>
            <Link to='/' className='notFound__btn'>Volver al inicio</Link>
        </div>
    </main>
  );
}