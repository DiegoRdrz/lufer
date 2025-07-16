import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { API_URL } from '../../lib/api';
import './Form.css';

export default function SignUpForm() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre,
          email,
          password,
          tipo: 'Humano', // puedes hacerlo seleccionable luego si quieres
          imagen: '/src/assets/img/no-image.jpg',
          descripcion: 'Nuevo usuario'
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al registrar usuario');
      }

      setSuccessMsg('Usuario registrado correctamente');
      setErrorMsg('');
      navigate('/login');

    } catch (err: any) {
      setErrorMsg(err.message);
      setSuccessMsg('');
    }
  };

  return (
    <main className='mainForm'>
      <form className='Form' onSubmit={handleSubmit}>
        <h2>Formulario de Registro</h2>
        <div className='signupForm__basicInfo'>
          <input
            type='text'
            className='Form__input'
            placeholder='Nombre'
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className='signupForm__contactInfo'>
          <input
            type='email'
            className='Form__input'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className='signupForm__password'>
          <input
            type='password'
            className='Form__input'
            placeholder='Contraseña'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {errorMsg && <p className='Form__error'>{errorMsg}</p>}
        {successMsg && <p className='Form__success'>{successMsg}</p>}

        <input type='submit' className='Form__btn' value='Registrarse' />

        <div className='alreadyHave'>
          <p>¿Ya tienes una cuenta?</p>
          <Link to='/login' className='alreadyHave__btn'>Inicia sesión</Link>
        </div>
      </form>
    </main>
  );
}
