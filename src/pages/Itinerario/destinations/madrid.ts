import { Destination } from './types';

export const madrid: Destination = {
  id: 'madrid',
  name: 'Madrid',
  country: 'España',
  coordinates: [40.4168, -3.7038],
  dates: '5-7 may',
  nights: 2,
  weather: { temp: '22°C', condition: 'sunny' },
  history: `Madrid fue una pequeña fortaleza árabe (Mayrit) hasta que Felipe II la convirtió en capital de España en 1561. Desde entonces, ha sido el centro político y cultural del país.

El Siglo de Oro español (XVI-XVII) vio florecer a Velázquez, Cervantes y Lope de Vega. En el siglo XVIII, los Borbones construyeron el Palacio Real y embellecieron la ciudad. Hoy Madrid es una metrópolis vibrante que combina historia con una vida nocturna legendaria y una escena gastronómica en auge.`,
  highlights: [
    'Museo del Prado - una de las mejores pinacotecas del mundo',
    'Palacio Real - el más grande de Europa Occidental',
    'Parque del Retiro - oasis verde en el centro',
    'Plaza Mayor y casco histórico',
    'Vida nocturna y gastronomía incomparables',
  ],
  pointsOfInterest: [
    {
      name: 'Museo del Prado',
      description: 'Pinacoteca con obras maestras de Velázquez (Las Meninas), Goya, El Greco, Rubens, Tiziano y El Bosco.',
      type: 'museum',
      tip: 'Entrada ~€15. Gratis 18:00-20:00 (L-S) y 17:00-19:00 (D). Mínimo 3 horas.',
    },
    {
      name: 'Palacio Real',
      description: 'Residencia oficial de los reyes (no viven aquí). 3,418 habitaciones, el más grande de Europa Occidental.',
      type: 'landmark',
      tip: 'Entrada ~€14. Cambio de guardia miércoles y sábados a las 11:00.',
    },
    {
      name: 'Parque del Retiro',
      description: 'Antiguo jardín real de 125 hectáreas. Estanque con barcas, Palacio de Cristal, rosaleda.',
      type: 'landmark',
      tip: 'Alquila una barca (~€6/45min). El Palacio de Cristal tiene exposiciones gratuitas.',
    },
    {
      name: 'Plaza Mayor',
      description: 'Plaza porticada del siglo XVII. Escenario de corridas, ejecuciones y mercados. Hoy terrazas y ambiente.',
      type: 'landmark',
      tip: 'Un café en las terrazas es caro pero la experiencia vale. Bocadillo de calamares cerca.',
    },
    {
      name: 'Puerta del Sol',
      description: 'Kilómetro cero de España. El Oso y el Madroño, reloj de Nochevieja, siempre animada.',
      type: 'landmark',
      tip: 'Punto de partida para explorar. Metro principal.',
    },
    {
      name: 'Museo Reina Sofía',
      description: 'Arte moderno y contemporáneo. El Guernica de Picasso, Dalí, Miró.',
      type: 'museum',
      tip: 'Entrada ~€12. Gratis L, M-S 19:00-21:00, D 12:30-14:30. El Guernica impresiona.',
    },
    {
      name: 'Barrio de La Latina',
      description: 'Casco antiguo con plazas, terrazas, tapas y ambiente castizo. El Rastro los domingos.',
      type: 'neighborhood',
      tip: 'Cava Baja es la calle de tapas. Domingos: Rastro (mercadillo) + cañas.',
    },
    {
      name: 'Gran Vía',
      description: 'Arteria principal con edificios de principios del siglo XX, teatros, tiendas y cines.',
      type: 'landmark',
      tip: 'El edificio Metrópolis y el de Telefónica son icónicos. Buenas tiendas.',
    },
    {
      name: 'Mercado de San Miguel',
      description: 'Mercado gastronómico en estructura de hierro de 1916. Tapas, vinos, ostras, jamón.',
      type: 'landmark',
      tip: 'Turístico y caro pero bonito. Mejor para picar que para comer.',
    },
    {
      name: 'Templo de Debod',
      description: 'Templo egipcio del siglo II a.C. regalado a España. Atardeceres espectaculares.',
      type: 'landmark',
      tip: 'Entrada gratuita al templo. Las vistas del atardecer son las mejores de Madrid.',
    },
  ],
  transports: [
    {
      type: 'train',
      from: 'Barcelona (Sants)',
      to: 'Madrid (Atocha)',
      duration: '3h 02min',
      price: '€35',
      link: 'https://www.ouigo.com',
      notes: 'OUIGO 06570. Localizador: AQ44HJ. Salida 17:40, llegada 20:42.',
    },
    {
      type: 'flight',
      from: 'Madrid (MAD)',
      to: 'Ámsterdam (AMS)',
      duration: '2h 25m',
      notes: 'KLM KL1500. Salida 06:00. Conexión a Cartagena.',
    },
  ],
  activities: [
    { date: '5 may', description: 'Llegada desde Barcelona (20:42), paseo centro, Plaza Mayor, Sol, La Latina', isBase: true },
    { date: '6 may', description: 'Museo del Prado, Retiro, tiempo con familia' },
    { date: '7 may', description: 'Salida al aeropuerto, vuelo 06:00 a Ámsterdam' },
  ],
  tips: [
    'Madrid se come tarde: almuerzo 14:00-16:00, cena 21:00-23:00',
    'El Metro es excelente y barato (~€1.50-2)',
    'Los domingos: Rastro (mercadillo) + cañas en La Latina es tradición',
    'Prueba: bocadillo de calamares, tortilla, croquetas, cocido madrileño',
    'La vida nocturna empieza después de medianoche',
    'Malasaña y Chueca tienen ambiente joven y alternativo',
  ],
};
