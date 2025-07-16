import type { Jabon } from '../../types/jabon';

interface JabonCardProps {
  jabones: Jabon[];
}

export default function JabonCard({ jabones }: JabonCardProps) {
  return (
    <>
      {jabones.map((jabon) => (
        <div className='jabonCard' key={jabon.id}>
          <div className='jabonCard__inner'>
            <div className='jabonCard__front'>
              <img src={jabon.imagen || '/src/assets/img/default.png'} alt={jabon.nombre} />
              <h3>{jabon.nombre}</h3>
              <strong>{`$${jabon.precio} Dragmas`}</strong>
            </div>
            <div className='jabonCard__back'>
              <p>{jabon.descripcion}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
