import type { Baño } from '../../types/baño'; // ✅ Usamos tipo correcto

interface BañoCardProps {
  baños: Baño[];
}

const BañoCard = ({ baños }: BañoCardProps) => {
  return (
    <>
      {baños.map((baño) => (
        <div className='bañoCard' key={baño.id}>
          <div className='bañoCard__inner'>
            <div className='bañoCard__front'>
              <img src={baño.imagen || '/src/assets/img/default.png'} alt={baño.nombre} />
              <h3>{baño.nombre}</h3>
              <strong>{`$${baño.precio} Dragmas`}</strong>
            </div>
            <div className='bañoCard__back'>
              <p>{baño.descripcion}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default BañoCard;
