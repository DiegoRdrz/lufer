import { Link } from 'react-router-dom';

interface ServiceCardProps {
  title: string;
  description?: string;
  images?: string[];
  link?: string;
  buttonText?: string;
}

export const ServiceCard = ({
  title,
  description = "Sin descripción disponible.",
  images = [],
  link = '/',
  buttonText = ""
}: ServiceCardProps) => {
  return (
    <div className="service-card">
      <div className="service-card__images">
        {images.map((src, i) => (
          <img
            className="service-card__image"
            key={i}
            src={src}
            alt={`${title} imagen ${i + 1}`}
          />
        ))}
      </div>
      <div className="service-card__description">
        <h3 className="service-card__title">{title}</h3>
        {description !== "Sin descripción disponible." && (
          <p className="service-card__text">{description}</p>
        )}
        {buttonText !== "" && (
          <Link to={link} className="service-card__button">
            {buttonText}
          </Link>
        )}
      </div>
    </div>
  );
};
