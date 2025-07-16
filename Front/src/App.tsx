import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Menu from './pages/Menu';
import NotFoundError from './pages/NotFoundError';
import Jabones from './pages/Jabones';
import Baños from './pages/Baños';
import useScrollToTop from './components/hooks/useScrollToTop';
import SignUp from './pages/signUp';
import LogIn from './pages/LogIn';
import Profile from './pages/ProfilePage';
import users from './data/users.json';
import Reservas from './pages/Reservas';
import FlujoReserva from './pages/FlujoReserva';
import AdminOptions from './pages/AdminOptions';

function AppRoutes() {
    const user = users.find(u => u.rol === 'USER');
    useScrollToTop();

    return (
        <Routes>
            <Route path='/' element={ <HomePage /> } /> 
            <Route path='/menu' element={ <Menu /> } />
            <Route path='/jabones' element={ <Jabones /> } />
            <Route path='/baños' element={ <Baños /> } />
            <Route path='/login' element={ <LogIn /> } />
            <Route path='/signup' element={ <SignUp /> } />
            <Route path='*' element={ <NotFoundError /> } />
            <Route path="/reservar" element={<FlujoReserva />} />
            <Route path="/reservas" element={<Reservas />} />
            <Route path="/profile" element={ <Profile /> }/>
            <Route path="/admin-options" element={ <AdminOptions /> } />
        </Routes>
    );
}

export default function App() {

    return (
        <Router>
            <AppRoutes />
        </Router>
    );
}