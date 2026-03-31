import { Destination } from './types';

export const barcelona: Destination = {
  id: 'barcelona',
  name: 'Barcelona',
  country: 'España',
  coordinates: [41.3874, 2.1686],
  dates: '4-5 may',
  nights: 1,
  weather: { temp: '21°C', condition: 'sunny' },
  history: `Barcelona fue fundada por los romanos como Barcino en el siglo I a.C. Capital del Condado de Barcelona y la Corona de Aragón, fue una potencia mediterránea medieval que rivalizó con Génova y Venecia.

A finales del siglo XIX, el Modernismo catalán transformó la ciudad. Antoni Gaudí, Lluís Domènech i Montaner y Josep Puig i Cadafalch crearon edificios únicos que hoy son Patrimonio de la Humanidad. La Sagrada Familia, comenzada en 1882, sigue en construcción y es el monumento más visitado de España.`,
  highlights: [
    'Sagrada Familia - obra maestra inacabada de Gaudí',
    'Park Güell - jardín surrealista de mosaicos',
    'Barrio Gótico - laberinto medieval',
    'La Rambla - el paseo más famoso de España',
    'Casa Batlló y La Pedrera - joyas modernistas',
  ],
  pointsOfInterest: [
    {
      name: 'Sagrada Familia',
      description: 'Basílica de Gaudí, en construcción desde 1882. Fachadas del Nacimiento y la Pasión, interior de columnas-bosque.',
      type: 'church',
      tip: 'RESERVA ONLINE OBLIGATORIA con semanas de antelación. ~€26, con torres ~€36. 2h mínimo.',
    },
    {
      name: 'Park Güell',
      description: 'Jardín de Gaudí con mosaicos de trencadís, el dragón, el banco ondulado y vistas de la ciudad.',
      type: 'landmark',
      tip: 'Reserva online (~€10). Zona monumental requiere entrada, el resto es gratis.',
    },
    {
      name: 'Casa Batlló',
      description: 'Casa modernista de Gaudí en Passeig de Gràcia. Fachada de huesos y dragón, interior onírico.',
      type: 'landmark',
      tip: 'Entrada ~€35. Audioguía con realidad aumentada incluida. Muy recomendable.',
    },
    {
      name: 'La Pedrera (Casa Milà)',
      description: 'Última obra civil de Gaudí. Azotea con chimeneas-guerreros y vistas espectaculares.',
      type: 'landmark',
      tip: 'Entrada ~€25. La visita nocturna de verano es especial.',
    },
    {
      name: 'Barrio Gótico',
      description: 'Casco antiguo medieval con la Catedral, Plaza del Rey, callejuelas y restos romanos.',
      type: 'neighborhood',
      tip: 'Piérdete sin mapa. Busca la Plaza Sant Felip Neri y el Call judío.',
    },
    {
      name: 'La Rambla',
      description: 'Paseo de 1.2 km desde Plaza Cataluña hasta el puerto. Artistas, quioscos de flores, terrazas.',
      type: 'landmark',
      tip: 'Evita restaurantes turísticos. La Boquería (mercado) sí merece la pena.',
    },
    {
      name: 'Mercado de la Boquería',
      description: 'Mercado de 1840 con frutas, jamones, mariscos, zumos y pinchos. Patrimonio gastronómico.',
      type: 'landmark',
      tip: 'Ve temprano (antes de las 11). Los puestos del fondo son más baratos.',
    },
    {
      name: 'Barceloneta',
      description: 'Barrio marinero del siglo XVIII con playa urbana, restaurantes de mariscos y chiringuitos.',
      type: 'beach',
      tip: 'Prueba una paella o fideuà. Los chiringuitos de playa son geniales al atardecer.',
    },
    {
      name: 'Montjuïc',
      description: 'Montaña con castillo, Fundación Miró, Pueblo Español, jardines y vistas del puerto.',
      type: 'viewpoint',
      tip: 'Teleférico desde el puerto o Barceloneta. La Fuente Mágica los fines de semana.',
    },
    {
      name: 'Barrio de Gràcia',
      description: 'Antiguo pueblo anexado a Barcelona. Plazas con terrazas, tiendas independientes, ambiente bohemio.',
      type: 'neighborhood',
      tip: 'Plaza del Sol para el vermut del mediodía. Ambiente local, menos turístico.',
    },
  ],
  transports: [
    {
      type: 'flight',
      from: 'Niza (NCE)',
      to: 'Barcelona (BCN)',
      duration: '1h 20min',
      price: '~€50-120',
      link: 'https://www.vueling.com',
      notes: 'Vueling. Pedido: 1123-116-110. Salida 07:50, llegada 09:10.',
    },
    {
      type: 'train',
      from: 'Barcelona (Sants)',
      to: 'Madrid (Atocha)',
      duration: '3h 02min',
      price: '€35',
      link: 'https://www.ouigo.com',
      notes: 'OUIGO 06570. Localizador: AQ44HJ. Salida 17:40, llegada 20:42.',
    },
  ],
  activities: [
    { date: '4 may', description: 'Llegada desde Niza (09:10), Barrio Gótico, La Rambla, Boquería, Barceloneta', isBase: true },
    { date: '5 may', description: 'Sagrada Familia (mañana), Park Güell. Tren OUIGO a Madrid (17:40→20:42)' },
  ],
  tips: [
    'RESERVA Sagrada Familia con mucha antelación - se agota',
    'La T-Casual (€11.35) da 10 viajes en metro/bus',
    'Cuidado con carteristas en La Rambla y metro',
    'Los restaurantes turísticos cerca de la Rambla son mediocres y caros',
    'El vermut antes de comer es tradición catalana',
    'Barcelona tiene playa - lleva bañador',
  ],
};
