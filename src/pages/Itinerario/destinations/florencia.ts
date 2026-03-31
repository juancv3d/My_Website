import { Destination } from './types';

export const florencia: Destination = {
  id: 'florencia',
  name: 'Florencia',
  country: 'Italia',
  coordinates: [43.7696, 11.2558],
  dates: '30 abr - 1 may',
  nights: 2,
  weather: { temp: '19°C', condition: 'partly-cloudy' },
  history: `Florencia es la cuna del Renacimiento, el movimiento cultural que transformó Europa entre los siglos XIV y XVII. Bajo el mecenazgo de la familia Medici, genios como Leonardo da Vinci, Miguel Ángel, Botticelli y Brunelleschi crearon obras maestras que definieron el arte occidental.

La ciudad fue capital de Italia de 1865 a 1871. Dante Alighieri, padre de la lengua italiana, nació aquí y escribió la Divina Comedia. Cada calle, cada plaza, respira historia y arte. Florencia no es solo una ciudad - es un museo al aire libre donde el Renacimiento sigue vivo.`,
  highlights: [
    'Duomo con la cúpula de Brunelleschi',
    'Galería Uffizi - arte renacentista incomparable',
    'Ponte Vecchio - puente medieval con joyerías',
    'David de Miguel Ángel en la Galleria dell\'Accademia',
    'Piazza della Signoria y Palazzo Vecchio',
  ],
  pointsOfInterest: [
    {
      name: 'Duomo (Santa Maria del Fiore)',
      description: 'Catedral gótica coronada por la cúpula de Brunelleschi, la más grande de ladrillo jamás construida. El baptisterio tiene las famosas puertas del Paraíso de Ghiberti.',
      type: 'church',
      tip: 'Reserva online para subir a la cúpula (~€30). La catedral es gratis pero hay fila.',
    },
    {
      name: 'Galleria degli Uffizi',
      description: 'Una de las colecciones de arte más importantes del mundo. Botticelli (Nacimiento de Venus, Primavera), Leonardo, Rafael, Caravaggio.',
      type: 'museum',
      tip: 'RESERVA OBLIGATORIA online. Mínimo 3 horas. Martes cerrado.',
    },
    {
      name: 'Galleria dell\'Accademia',
      description: 'Hogar del David de Miguel Ángel (1501-1504), la escultura más famosa del mundo.',
      type: 'museum',
      tip: 'Reserva online para evitar filas de 2+ horas. 1-2 horas es suficiente.',
    },
    {
      name: 'Ponte Vecchio',
      description: 'Puente medieval del siglo XIV con joyerías. Único puente de Florencia que sobrevivió la WWII.',
      type: 'landmark',
      tip: 'Pasea al atardecer. Las joyerías son caras pero bonitas de ver.',
    },
    {
      name: 'Piazza della Signoria',
      description: 'Plaza principal con esculturas al aire libre, Palazzo Vecchio y Loggia dei Lanzi. Centro político desde la Edad Media.',
      type: 'landmark',
      tip: 'Réplica del David aquí (el original estaba aquí hasta 1873).',
    },
    {
      name: 'Palazzo Pitti y Jardines Boboli',
      description: 'Palacio renacentista de los Medici con múltiples museos y jardines italianos espectaculares.',
      type: 'museum',
      tip: 'Entrada combinada ~€22. Los jardines son perfectos para descansar.',
    },
    {
      name: 'San Lorenzo y Capillas Mediceas',
      description: 'Iglesia de los Medici con la Sacristía Nueva diseñada por Miguel Ángel y sus famosas esculturas.',
      type: 'church',
      tip: 'El mercado de San Lorenzo afuera es bueno para souvenirs de cuero.',
    },
    {
      name: 'Piazzale Michelangelo',
      description: 'Mirador con la vista panorámica más famosa de Florencia, especialmente al atardecer.',
      type: 'viewpoint',
      tip: 'Sube andando por los jardines o en bus 12/13. Lleva vino para el atardecer.',
    },
  ],
  transports: [
    {
      type: 'train',
      from: 'Salerno',
      to: 'Florencia (Firenze S.M.)',
      duration: '3h 55min',
      price: '€75.80',
      link: 'https://www.italotreno.it',
      notes: 'Italo 8158. Código: MC4T3P. Salida 17:22, llegada 21:17.',
    },
    {
      type: 'flight',
      from: 'Florencia (FLR)',
      to: 'Niza (NCE)',
      duration: '3h (1 cambio)',
      price: '~€100-150',
      link: 'https://www.ita-airways.com',
      notes: 'ITA Airways. Pedido: 1122-428-852. Salida 15:30, llegada 18:30.',
    },
  ],
  activities: [
    { date: '30 abr', description: 'Llegada desde Salerno (21:17), instalarse, paseo nocturno', isBase: true },
    { date: '1 may', description: 'Uffizi (mañana), Duomo, Accademia (tarde), Piazzale Michelangelo (atardecer)' },
    { date: '2 may', description: 'Paseo centro, Ponte Vecchio, San Lorenzo. Vuelo ITA Airways a Niza (15:30→18:30)' },
  ],
  tips: [
    'RESERVA los museos con semanas de antelación - se agotan',
    'Florencia se recorre a pie - lleva zapatos muy cómodos',
    'Prueba la bistecca alla fiorentina y el lampredotto',
    'El gelato de Vivoli o Grom es excelente',
    'Evita restaurantes turísticos cerca del Duomo',
    'La tarjeta Firenze Card (€85) puede valer la pena si visitas muchos museos',
  ],
};
