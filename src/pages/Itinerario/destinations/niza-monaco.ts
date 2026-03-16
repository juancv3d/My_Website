import { Destination } from './types';

export const nizaMonaco: Destination[] = [
  {
    id: 'niza',
    name: 'Niza',
    country: 'Francia',
    coordinates: [43.7102, 7.2620],
    dates: '1-2 may',
    nights: 2,
    history: `Niza fue fundada por los griegos en el siglo IV a.C. como Nikaia (victoria). Perteneció al Condado de Saboya y al Reino de Cerdeña antes de unirse a Francia en 1860 tras un referéndum.

En el siglo XIX, aristócratas británicos y rusos la convirtieron en destino de invierno de la alta sociedad, creando la famosa Promenade des Anglais. La Riviera Francesa nació aquí, y artistas como Matisse, Chagall y Renoir encontraron inspiración en su luz mediterránea única.`,
    highlights: [
      'Promenade des Anglais - el paseo marítimo más famoso del mundo',
      'Vieux Nice - casco antiguo con ambiente italiano',
      'Colina del Castillo con vistas panorámicas',
      'Mercado de flores de Cours Saleya',
      'Luz mediterránea que inspiró a los impresionistas',
    ],
    pointsOfInterest: [
      {
        name: 'Promenade des Anglais',
        description: 'Icónico paseo marítimo de 7 km bordeado de hoteles Belle Époque y palmeras, con la bahía de los Ángeles.',
        type: 'landmark',
        tip: 'Alquila una bici o simplemente pasea. El atardecer es mágico.',
      },
      {
        name: 'Vieux Nice (Casco Antiguo)',
        description: 'Laberinto de callejuelas con arquitectura italiana, mercados, restaurantes y ambiente animado.',
        type: 'neighborhood',
        tip: 'Prueba la socca (crepe de garbanzos) en Chez Pipo o Chez René.',
      },
      {
        name: 'Colline du Château',
        description: 'Parque en la colina con ruinas del castillo y las mejores vistas panorámicas de Niza.',
        type: 'viewpoint',
        tip: 'Sube por las escaleras o el ascensor gratuito. Cascada artificial bonita.',
      },
      {
        name: 'Cours Saleya',
        description: 'Mercado de flores, frutas y verduras de martes a domingo. Antigüedades los lunes.',
        type: 'landmark',
        tip: 'Ve por la mañana. Los restaurantes son turísticos pero el ambiente vale la pena.',
      },
      {
        name: 'Musée Matisse',
        description: 'Colección dedicada a Henri Matisse, quien vivió en Niza 37 años.',
        type: 'museum',
        tip: 'Entrada gratuita. En los jardines de Cimiez, combinable con las ruinas romanas.',
      },
      {
        name: 'Musée Marc Chagall',
        description: 'Museo dedicado a las obras bíblicas de Chagall, diseñado específicamente para su arte.',
        type: 'museum',
        tip: 'Entrada ~€10. Imprescindible para fans de Chagall.',
      },
      {
        name: 'Place Masséna',
        description: 'Plaza principal con edificios ocres, fuentes y las famosas estatuas de luz de Jaume Plensa.',
        type: 'landmark',
        tip: 'Punto de partida perfecto para explorar. Tranvía pasa por aquí.',
      },
    ],
    transports: [
      {
        type: 'train',
        from: 'Florencia',
        to: 'Niza',
        duration: '5-6h',
        price: '€50-80',
        link: 'https://www.trenitalia.com',
        notes: 'Ruta panorámica por la costa. Cambio en Génova o Ventimiglia.',
      },
      {
        type: 'flight',
        from: 'Niza',
        to: 'Barcelona',
        duration: '1h 20min',
        price: '€50-120',
        link: 'https://www.vueling.com',
        notes: 'Vueling, easyJet o Ryanair. Aeropuerto muy cerca del centro.',
      },
    ],
    activities: [
      { date: '1 may', description: 'Llegada desde Florencia, Promenade, Vieux Nice, Colina del Castillo', isBase: true },
      { date: '2 may', description: 'Excursión a Mónaco en tren' },
    ],
    tips: [
      'La French Riviera Pass (~€26) incluye transporte y algunas atracciones',
      'El tren a Mónaco sale cada 20-30 min (~€4.50, 25 min)',
      'La salade niçoise auténtica NO lleva patata cocida',
      'Playa de piedras, no de arena - lleva chanclas de agua',
    ],
  },
  {
    id: 'monaco',
    name: 'Mónaco',
    country: 'Mónaco',
    coordinates: [43.7384, 7.4246],
    dates: '2 may',
    nights: 0,
    weather: { temp: '18°C', condition: 'sunny' },
    history: `Mónaco es el segundo país más pequeño del mundo (2 km²) y el más densamente poblado. Los Grimaldi gobiernan desde 1297, convirtiéndola en la monarquía reinante más antigua de Europa.

El Príncipe Carlos III salvó al principado de la bancarrota en 1863 abriendo el Casino de Montecarlo. Grace Kelly, actriz de Hollywood, se convirtió en Princesa de Mónaco en 1956. Hoy es sinónimo de lujo, Fórmula 1 y yates multimillonarios.`,
    highlights: [
      'Casino de Montecarlo - templo del lujo',
      'Palacio del Príncipe y cambio de guardia',
      'Puerto de Mónaco con superyates',
      'Museo Oceanográfico de Jacques Cousteau',
      'Circuito de F1 en las calles',
    ],
    pointsOfInterest: [
      {
        name: 'Casino de Montecarlo',
        description: 'El casino más famoso del mundo, diseñado por Charles Garnier (arquitecto de la Ópera de París).',
        type: 'landmark',
        tip: 'Entrada ~€17 a las salas de juego (pasaporte requerido). Código de vestimenta estricto.',
      },
      {
        name: 'Palais Princier',
        description: 'Residencia oficial de los Grimaldi desde el siglo XIII. Cambio de guardia a las 11:55.',
        type: 'landmark',
        tip: 'Visita interior en verano (~€10). La plaza tiene vistas espectaculares.',
      },
      {
        name: 'Musée Océanographique',
        description: 'Museo marino fundado por el Príncipe Alberto I, dirigido por Jacques Cousteau durante 30 años.',
        type: 'museum',
        tip: 'Entrada ~€18. Acuarios espectaculares y vistas desde la terraza.',
      },
      {
        name: 'Port Hercule',
        description: 'Puerto principal con superyates de millonarios. Durante el GP de F1, los paddocks están aquí.',
        type: 'landmark',
        tip: 'Pasea y admira los yates. Algunos restaurantes son accesibles.',
      },
      {
        name: 'Monaco-Ville (Le Rocher)',
        description: 'Casco antiguo en la roca con callejuelas, la catedral y el palacio.',
        type: 'neighborhood',
        tip: 'Aquí está enterrada Grace Kelly en la Catedral.',
      },
      {
        name: 'Jardín Exótico',
        description: 'Jardín de cactus en un acantilado con vistas y cuevas prehistóricas.',
        type: 'landmark',
        tip: 'Entrada ~€7.20. Vistas increíbles del principado.',
      },
    ],
    transports: [
      {
        type: 'train',
        from: 'Niza',
        to: 'Monaco Monte-Carlo',
        duration: '25 min',
        price: '€4.50',
        link: 'https://www.sncf-connect.com',
        notes: 'Trenes cada 20-30 min. Estación subterránea espectacular.',
      },
    ],
    activities: [
      { date: '2 may', description: 'Tren desde Niza, Casino, Palacio, Museo Oceanográfico, regreso' },
    ],
    tips: [
      'Mónaco es MUY caro - lleva snacks y agua',
      'El bus #1 conecta todas las atracciones principales',
      'Puedes caminar todo el principado en una hora',
      'No se necesita pasaporte (está en el espacio Schengen)',
      'El cambio de guardia es a las 11:55 exactas',
    ],
  },
];
