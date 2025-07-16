import Perfil from '../components/Profile/Profile';

const ProfilePage = () => {
  // Simula un usuario actual
  const usuario = JSON.parse(localStorage.getItem('loggedUser') || 'null');

  return <Perfil {...usuario} />;
};

export default ProfilePage;