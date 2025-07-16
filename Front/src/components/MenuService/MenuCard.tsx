import type { Menu } from '../../types/menu';

interface MenuCardProps {
  menus: Menu[];
}

const MenuCard = ({ menus }: MenuCardProps) => {
  return (
    <>
      {menus.map((menu) => (
        <div className='menuCard' key={menu.id}>
          <img src={menu.imagen || '/src/assets/img/default.png'} alt={menu.nombre} />
          <h3>{menu.nombre}</h3>
          <p>
            {Array.isArray(menu.descripcion)
              ? menu.descripcion.join(' ')
              : menu.descripcion}
          </p>
          <strong>{`$${menu.precio} Dragmas`}</strong>
        </div>
      ))}
    </>
  );
};

export default MenuCard;
