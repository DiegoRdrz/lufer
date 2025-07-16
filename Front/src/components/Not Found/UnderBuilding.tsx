import { Link } from 'react-router-dom';
import './UnderBuilding.css';
import alertIcon from '../../assets/img/AlertIcon.png';
import workerWithShovelIcon from '../../assets/img/WorkerWithShovelIcon.png';

export default function UnderBuilding() {
    return (
        <>
            <main className='underBuilding'>
                <div className='banner'>
                    <img
                        className='banner__icon' 
                        src={ alertIcon }/>
                    <p className='banner__text-1'>WEBSITE<br />UNDER</p>
                    <p className='banner__text-2'>CONSTRUCTION</p>
                </div>
                <div className='comeBackLater'>
                    <img
                        className='comeBackLater__img'
                        src={ workerWithShovelIcon }
                    />
                    <div className='comeBackLater__content'>
                        <span>Por favor vuelva más tarde</span>
                        <Link to='/' className='comeBackLater__btn'>Volver</Link>
                    </div>
                </div>
            </main>
        </>
    );
}