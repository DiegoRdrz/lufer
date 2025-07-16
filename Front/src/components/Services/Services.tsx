import { ServiceCard } from './ServiceCard';
import './Services.css'

export default function Services() {
	const BañosImages = [
		'../src/assets/img/baños/baño_dragon.jpg',
		'../src/assets/img/baños/baño_almas.jpg',
		'../src/assets/img/baños/baño_hechizo.jpg',
		'../src/assets/img/baños/baño_luna.jpg'
	];
	const BanqueteImages = [
		'../src/assets/img/menus/sinfonia.jpg',
		'../src/assets/img/menus/elixir.jpg',
		'../src/assets/img/menus/nectar.jpg',
		'../src/assets/img/menus/banquete.png'
	];

	const JabonesImages = [
		'../src/assets/img/jabones/jabon rayo.jpg',
		'../src/assets/img/jabones/jabon_fenix.jpg',
		'../src/assets/img/jabones/jabon_infra.jpg',
		'../src/assets/img/jabones/jabon_loto.jpg'
	];

	const BañosDescription = 
	`Sumérgete en un oasis de serenidad. Nuestros baños han sido cuidadosamente diseñados 
  	para conectar cuerpo y alma con la naturaleza. Rodeados de jardines encantados, aguas 
  	termales místicas y el susurro de la tranquilidad, aquí encontrarás el descanso que tanto mereces.`
	;

	const BanqueteDescription = 
	`Disfruta de una experiencia culinaria única. Nuestro banquete está diseñado para deleitar tus sentidos, 
  	ofreciendo una fusión de sabores que celebran la riqueza de la naturaleza. Cada plato es una obra maestra, 
  	preparada con ingredientes frescos y locales, que te transportará a un mundo de placer gastronómico.`
	;

	const JabonesDescription = 
	`Descubre la magia de nuestros jabones artesanales. Elaborados con ingredientes naturales y fragancias envolventes, 
  	cada jabón es una invitación a un viaje sensorial. Deja que la suavidad y el aroma de nuestros jabones transformen 
  	tu rutina diaria en un ritual de bienestar y cuidado personal.`
	;

    return (
			<>
				<main className="main">

					<ServiceCard title="Baños" images={BañosImages} description={BañosDescription} link='/baños' buttonText='Ver más' />
					<ServiceCard title="Banquete" images={BanqueteImages} description={BanqueteDescription} link='/menu' buttonText='Ver más' />
					<ServiceCard title="Jabones" images={JabonesImages} description={JabonesDescription} link='/jabones' buttonText='Ver más' />
				</main>
			</>
    );
}