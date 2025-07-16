import "./SelectorImagen.css";

interface SelectorImagenProps {
  imagenes: string[];
  basePath: string; // <-- Ruta base como prop
  onSeleccionar: (ruta: string) => void;
  onCerrar: () => void;
}

export default function SelectorImagen({ imagenes, basePath, onSeleccionar, onCerrar }: SelectorImagenProps) {
  // Detenemos la propagación para evitar que click dentro cierre el modal padre
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div className="selector-imagen-overlay" onClick={onCerrar}>
      <div className="selector-imagen-modal" onClick={handleModalClick}>
        <h3>Selecciona una imagen</h3>
        <div className="selector-imagen-grid">
          {imagenes.map((img) => (
            <img
              key={img}
              src={`${basePath}/${img}`} // usa basePath aquí
              alt={img}
              className="selector-imagen-item"
              onClick={() => onSeleccionar(`${basePath}/${img}`)}
            />
          ))}
        </div>
        <button className="selector-imagen-cerrar" onClick={onCerrar}>Cerrar</button>
      </div>
    </div>
  );
}
