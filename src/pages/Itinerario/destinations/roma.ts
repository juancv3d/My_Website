import { Destination } from './types';

export const roma: Destination = {
  id: 'roma',
  name: 'Roma',
  country: 'Italia',
  coordinates: [41.9028, 12.4964],
  dates: '25-26 abr',
  nights: 1,
  weather: { temp: '21°C', condition: 'sunny' },
  history: `Roma, la Ciudad Eterna, fue la capital del Imperio Romano que dominó el Mediterráneo durante siglos. Fundada según la leyenda por Rómulo en el 753 a.C., fue el centro del poder más grande de la antigüedad.

Tras la caída del imperio, Roma se convirtió en sede del papado y centro de la cristiandad. El Renacimiento la transformó con obras de Miguel Ángel, Rafael y Bernini. Hoy combina ruinas antiguas, arte barroco y una vibrante vida moderna en cada esquina.`,
  highlights: [
    'Coliseo Romano - el anfiteatro más famoso del mundo',
    'Vaticano - Capilla Sixtina y Basílica de San Pedro',
    'Fontana di Trevi - la fuente más célebre de Roma',
    'Panteón - templo romano mejor conservado',
    'Piazza Navona y sus fuentes barrocas',
  ],
  pointsOfInterest: [
    {
      name: 'Coliseo',
      description: 'Anfiteatro del siglo I d.C. con capacidad para 50.000 espectadores. Símbolo de Roma y del Imperio Romano.',
      type: 'landmark',
      tip: 'RESERVA ONLINE OBLIGATORIA. Entrada combinada con Foro Romano y Palatino ~€18. Mínimo 2h.',
    },
    {
      name: 'Foro Romano y Palatino',
      description: 'Centro político y religioso de la Roma antigua. Ruinas de templos, basílicas y arcos triunfales.',
      type: 'landmark',
      tip: 'Incluido con entrada del Coliseo. Dedica al menos 1.5h.',
    },
    {
      name: 'Fontana di Trevi',
      description: 'Fuente barroca de 1762 diseñada por Nicola Salvi. Tradición de lanzar una moneda para volver a Roma.',
      type: 'landmark',
      tip: 'Ve temprano por la mañana o de noche para evitar multitudes.',
    },
    {
      name: 'Panteón',
      description: 'Templo romano del 125 d.C. con la cúpula de hormigón no armado más grande del mundo. Tumba de Rafael.',
      type: 'church',
      tip: 'Entrada gratuita con reserva online. El óculo abierto es impresionante cuando llueve.',
    },
    {
      name: 'Piazza Navona',
      description: 'Plaza barroca sobre el antiguo estadio de Domiciano. Fuente de los Cuatro Ríos de Bernini.',
      type: 'landmark',
      tip: 'Perfecta para un café o gelato. Los restaurantes son caros pero el ambiente vale.',
    },
    {
      name: 'Trastevere',
      description: 'Barrio bohemio con callejuelas empedradas, trattorias auténticas y vida nocturna animada.',
      type: 'neighborhood',
      tip: 'El mejor barrio para cenar. Prueba la pasta cacio e pepe o la carbonara.',
    },
    {
      name: 'Basílica de San Pedro',
      description: 'La iglesia más grande del mundo. Cúpula de Miguel Ángel, La Piedad, baldaquino de Bernini.',
      type: 'church',
      tip: 'Entrada gratuita. Subir a la cúpula ~€10. Código de vestimenta estricto.',
    },
    {
      name: 'Plaza de España',
      description: 'Escalinata de 135 peldaños y fuente de Bernini. Zona de compras de lujo alrededor.',
      type: 'landmark',
      tip: 'No se puede sentar en las escaleras (multa). Bonita de noche.',
    },
  ],
  transports: [
    {
      type: 'flight',
      from: 'Madrid',
      to: 'Roma (FCO)',
      duration: '2h 30min',
      price: '€144.40',
      link: 'https://wizzair.com',
      notes: 'Wizz Air W46012. Confirmación: KNKJVW. FCO a Roma centro ~45 min en tren Leonardo Express.',
    },
    {
      type: 'train',
      from: 'Roma Tiburtina',
      to: 'Salerno',
      duration: '2h 20min',
      price: '€39.80',
      link: 'https://www.italotreno.it',
      notes: 'Italo 9947. Código: WYI5VL. Salida 19:12, llegada 21:32.',
    },
  ],
  activities: [
    { date: '25 abr', description: 'Llegada desde Madrid (11:55 FCO), traslado al centro, Coliseo, Foro Romano, Trastevere', isBase: true },
    { date: '26 abr', description: 'Fontana di Trevi, Panteón, Piazza Navona, Plaza de España. Tren Italo 9947 a Salerno 19:12' },
  ],
  tips: [
    'El Leonardo Express (€14) conecta FCO con Roma Termini en 32 min',
    'Roma se recorre a pie - lleva zapatos muy cómodos',
    'Cuidado con carteristas en el metro y zonas turísticas',
    'Prueba la supplì (croqueta de arroz) y la pizza al taglio',
    'El agua de las fuentes públicas (nasoni) es potable y gratis',
    'Reserva el Coliseo y Vaticano con antelación - se agotan',
  ],
};
