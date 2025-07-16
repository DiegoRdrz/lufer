import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { API_URL } from '../../lib/api'; // 🔁 Ruta base de tu backend

export default function LogInForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error en el inicio de sesión');
      }

      // Guardamos usuario y token si se devuelve
      localStorage.setItem('loggedUser', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      // Redirección según rol
      if (data.user.rol === 'ADMIN') {
        navigate('/admin-options');
        window.location.reload();
      } else {
        navigate('/');
        window.location.reload();
      }

    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  return (
    <main className='mainForm'>
      <form className='Form' onSubmit={handleSubmit}>
        <h2>Inicio de sesión</h2>
        <div className='login_Form'>
          <input
            type='email'
            className='Form__input'
            id='email'
            name='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type='password'
            className='Form__input'
            id='password'
            name='password'
            placeholder='Contraseña'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMsg && <p className='Form__error'>{errorMsg}</p>}
        <input type='submit' className='Form__btn' value='Iniciar sesión' />
        <div className='alreadyHave'>
          <p>Aún no tienes una cuenta?</p>
          <Link to='/signup' className='alreadyHave__btn'>
            Regístrate
          </Link>
        </div>
      </form>
    </main>
  );
}
