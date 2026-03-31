import { Destination } from './types';

export const italiaSur: Destination[] = [
  {
    id: 'salerno',
    name: 'Salerno',
    country: 'Italia',
    coordinates: [40.6824, 14.7681],
    dates: '26-29 abr',
    nights: 4,
    history: `Salerno es una ciudad portuaria en la región de Campania, al sur de Italia. Fue capital del principado lombardo de Salerno en la Edad Media y albergó la famosa Escuela Médica Salernitana, considerada la primera universidad de medicina de Europa.

Durante la Segunda Guerra Mundial, Salerno fue escenario del desembarco aliado en septiembre de 1943 (Operación Avalanche). Hoy es una ciudad vibrante, puerta de entrada perfecta a la Costa Amalfitana, con un encantador centro histórico y un paseo marítimo espectacular.`,
    highlights: [
      'Puerta de entrada a la Costa Amalfitana',
      'Centro histórico medieval bien conservado',
      'Lungomare Trieste - uno de los paseos marítimos más bonitos de Italia',
      'Menos turístico y más auténtico que Sorrento',
    ],
    pointsOfInterest: [
      {
        name: 'Duomo di Salerno',
        description: 'Catedral románica del siglo XI dedicada a San Mateo, con un impresionante atrio con columnas antiguas y cripta con los restos del apóstol.',
        type: 'church',
        tip: 'Entrada gratuita. No te pierdas el claustro árabe-normando.',
      },
      {
        name: 'Lungomare Trieste',
        description: 'Paseo marítimo de 2 km con palmeras, vistas al golfo y terrazas para tomar un aperitivo al atardecer.',
        type: 'viewpoint',
        tip: 'Perfecto para el passeggiata nocturno. Prueba un spritz en alguna terraza.',
      },
      {
        name: 'Giardino della Minerva',
        description: 'Jardín botánico medieval, el más antiguo de Europa, vinculado a la Escuela Médica Salernitana.',
        type: 'landmark',
        tip: 'Vistas espectaculares de la ciudad. Perfecto para escapar del calor.',
      },
      {
        name: 'Centro Storico',
        description: 'Callejuelas medievales con tiendas, restaurantes y la Via dei Mercanti, la calle comercial histórica.',
        type: 'neighborhood',
        tip: 'Piérdete por las calles sin mapa - es pequeño y seguro.',
      },
      {
        name: 'Castello di Arechi',
        description: 'Fortaleza lombarda en lo alto de la ciudad con vistas panorámicas de toda la bahía.',
        type: 'landmark',
        tip: 'Sube en taxi o bus. Las vistas al atardecer son increíbles.',
      },
    ],
    transports: [
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
      { date: '26 abr', description: 'Día en Roma, tren Italo 9947 a Salerno (19:12→21:32), instalarse', isBase: true },
      { date: '27 abr', description: 'Excursión a Amalfi y Ravello' },
      { date: '28 abr', description: 'Excursión a Positano' },
      { date: '29 abr', description: 'Excursión a Capri en ferry' },
    ],
    tips: [
      'Los ferries a la Costa Amalfitana salen del Molo Manfredi',
      'Compra billetes de ferry en TravelMar o Alilauro',
      'El mercado de Via dei Mercanti es genial para productos locales',
    ],
  },
  {
    id: 'amalfi',
    name: 'Amalfi',
    country: 'Italia',
    coordinates: [40.6340, 14.6027],
    dates: '27 abr',
    nights: 0,
    history: `Amalfi fue una de las cuatro Repúblicas Marítimas de Italia medieval, junto con Génova, Pisa y Venecia. En su apogeo (siglos X-XI), su flota comerciaba por todo el Mediterráneo y creó las Tablas Amalfitanas, el primer código de derecho marítimo.

La república cayó tras ser saqueada por Pisa en 1137 y un devastador tsunami en 1343. Hoy, su esplendor pasado se refleja en la majestuosa catedral y en el orgullo de sus habitantes.`,
    highlights: [
      'Catedral de San Andrés con escalinata monumental',
      'Historia como poderosa república marítima',
      'Producción tradicional de limoncello y papel',
      'Ambiente menos turístico que Positano',
    ],
    pointsOfInterest: [
      {
        name: 'Duomo di Amalfi',
        description: 'Catedral del siglo IX con fachada árabe-normanda, escalinata de 62 escalones y cripta con reliquias de San Andrés.',
        type: 'church',
        tip: 'El Claustro del Paraíso es espectacular. Entrada combinada ~€5.',
      },
      {
        name: 'Museo della Carta',
        description: 'Museo en un antiguo molino papelero del siglo XIII. Amalfi fue famosa por su papel de alta calidad.',
        type: 'museum',
        tip: 'Demostraciones en vivo de fabricación de papel tradicional.',
      },
      {
        name: 'Valle dei Mulini',
        description: 'Valle con ruinas de antiguos molinos papeleros, ahora cubiertos de vegetación.',
        type: 'landmark',
        tip: 'Caminata fácil de 30 min. Atmósfera casi mágica.',
      },
      {
        name: 'Piazza del Duomo',
        description: 'Plaza principal con cafés y vistas a la catedral. Centro de la vida local.',
        type: 'landmark',
        tip: 'Un caffè aquí es obligatorio, aunque sea caro.',
      },
    ],
    transports: [
      {
        type: 'ferry',
        from: 'Positano',
        to: 'Amalfi',
        duration: '25 min',
        price: '€10',
        link: 'https://www.travelmar.it',
        notes: 'Ferries frecuentes. También conecta con Salerno.',
      },
      {
        type: 'bus',
        from: 'Ravello',
        to: 'Amalfi',
        duration: '25 min',
        price: '€1.30',
        notes: 'Bus SITA cada 30 min. Carretera con curvas pero vistas increíbles.',
      },
    ],
    activities: [
      { date: '27 abr', description: 'Excursión desde Salerno con Ravello, Duomo, paseo' },
    ],
    tips: [
      'Prueba el limoncello local - los limones de Amalfi son famosos',
      'El papel de Amalfi es un recuerdo especial',
      'Los restaurantes en la plaza son caros - busca callejones interiores',
    ],
  },
  {
    id: 'ravello',
    name: 'Ravello',
    country: 'Italia',
    coordinates: [40.6491, 14.6117],
    dates: '27 abr',
    nights: 0,
    history: `Ravello, conocida como la "Ciudad de la Música", ha inspirado a artistas durante siglos. Richard Wagner compuso parte de Parsifal aquí, y los jardines de Villa Rufolo aparecen en sus descripciones del jardín mágico de Klingsor.

Gore Vidal vivió aquí 30 años. El pueblo, encaramado 350 metros sobre el mar, ofrece las vistas más espectaculares de toda la Costa Amalfitana.`,
    highlights: [
      'Vistas más espectaculares de la Costa Amalfitana',
      'Villa Rufolo y Villa Cimbrone',
      'Festival de música clásica en verano',
      'Ambiente tranquilo y sofisticado',
    ],
    pointsOfInterest: [
      {
        name: 'Villa Rufolo',
        description: 'Villa del siglo XIII con jardines que inspiraron a Wagner. Escenario del Festival de Ravello.',
        type: 'landmark',
        tip: 'Entrada ~€8. Los jardines tienen vistas increíbles al mar.',
      },
      {
        name: 'Villa Cimbrone',
        description: 'Villa con el famoso "Terrazzo dell\'Infinito", considerado el balcón más bello del mundo.',
        type: 'viewpoint',
        tip: 'Entrada ~€8. Greta Garbo se escondía aquí. Las vistas son indescriptibles.',
      },
      {
        name: 'Duomo di Ravello',
        description: 'Catedral del siglo XI con púlpito de mosaicos y puertas de bronce bizantinas.',
        type: 'church',
        tip: 'Entrada gratuita. El museo tiene reliquias de San Pantaleón.',
      },
      {
        name: 'Piazza Vescovado',
        description: 'Plaza principal con el Duomo y cafés con vistas. Centro del pueblo.',
        type: 'landmark',
        tip: 'Toma un limoncello con vistas al atardecer.',
      },
    ],
    transports: [
      {
        type: 'bus',
        from: 'Amalfi',
        to: 'Ravello',
        duration: '25 min',
        price: '€1.30',
        notes: 'Bus SITA cada 30 min desde Amalfi. Carretera serpenteante con vistas.',
      },
    ],
    activities: [
      { date: '27 abr', description: 'Excursión desde Salerno: Villa Rufolo, Villa Cimbrone, pueblo' },
    ],
    tips: [
      'Llega temprano para evitar multitudes',
      'Villa Cimbrone requiere caminar - lleva agua',
      'Los restaurantes son caros pero la comida suele ser excelente',
    ],
  },
  {
    id: 'positano',
    name: 'Positano',
    country: 'Italia',
    coordinates: [40.6281, 14.4850],
    dates: '28 abr',
    nights: 0,
    weather: { temp: '20°C', condition: 'sunny' },
    history: `Positano fue un próspero puerto marítimo durante los siglos XVI y XVII, pero decayó cuando la navegación a vela fue reemplazada por barcos de vapor. En el siglo XX, artistas e intelectuales lo redescubrieron, y John Steinbeck escribió su famoso ensayo "Positano" en 1953, poniéndolo en el mapa del turismo internacional.

Las casas de colores pastel que se derraman por el acantilado hacia el mar se han convertido en una de las imágenes más icónicas de Italia.`,
    highlights: [
      'Casas coloridas en cascada hacia el mar',
      'Playas con vistas espectaculares',
      'Boutiques de moda local (sandalias hechas a mano)',
      'Ambiente romántico y fotogénico',
    ],
    pointsOfInterest: [
      {
        name: 'Spiaggia Grande',
        description: 'La playa principal de Positano, con vistas a las casas coloridas y la cúpula de Santa Maria Assunta.',
        type: 'beach',
        tip: 'Llega temprano para conseguir buen sitio. Alquiler de tumbonas ~€20-30.',
      },
      {
        name: 'Chiesa di Santa Maria Assunta',
        description: 'Iglesia del siglo XIII con icónica cúpula de mayólica que domina el pueblo.',
        type: 'church',
        tip: 'Interior con un icono bizantino de la Virgen Negra del siglo XIII.',
      },
      {
        name: 'Sentiero degli Dei',
        description: 'El "Camino de los Dioses", ruta de senderismo con vistas espectaculares.',
        type: 'viewpoint',
        tip: 'El sendero completo toma 4-5 horas. También se puede hacer un tramo corto.',
      },
      {
        name: 'Via dei Mulini',
        description: 'Calle principal con boutiques, galerías y tiendas de sandalias artesanales.',
        type: 'neighborhood',
        tip: 'Las sandalias hechas a medida son un recuerdo clásico.',
      },
    ],
    transports: [
      {
        type: 'ferry',
        from: 'Salerno',
        to: 'Positano',
        duration: '1h 10min',
        price: '€14-18',
        link: 'https://www.travelmar.it',
        notes: 'Ferries TravelMar varias veces al día. Vista espectacular de la costa.',
      },
    ],
    activities: [
      { date: '28 abr', description: 'Ferry desde Salerno, explorar pueblo, playa, regreso a Salerno' },
    ],
    tips: [
      'El pueblo tiene MUCHAS escaleras - lleva calzado cómodo',
      'Los precios son los más altos de la costa',
      'Mejor en temporada baja o temprano/tarde para evitar multitudes',
    ],
  },
  {
    id: 'capri',
    name: 'Capri',
    country: 'Italia',
    coordinates: [40.5508, 14.2225],
    dates: '29 abr',
    nights: 0,
    history: `Capri ha sido refugio de emperadores, artistas y celebridades durante milenios. El emperador Tiberio gobernó Roma desde aquí (27-37 d.C.) y construyó 12 villas, incluyendo Villa Jovis.

En el siglo XIX, escritores como Oscar Wilde, Graham Greene y Pablo Neruda encontraron inspiración aquí. La Grotta Azzurra, redescubierta en 1826, convirtió a Capri en destino obligado del Grand Tour.`,
    highlights: [
      'Grotta Azzurra - cueva con agua azul luminiscente',
      'Faraglioni - formaciones rocosas icónicas',
      'Piazzetta - el salón más glamuroso de Italia',
      'Anacapri - pueblo más tranquilo en la cima',
    ],
    pointsOfInterest: [
      {
        name: 'Grotta Azzurra',
        description: 'Cueva marina donde la luz crea un resplandor azul mágico en el agua.',
        type: 'landmark',
        tip: 'Entrada ~€18. Cerrada con mal tiempo. Mejor ir temprano para evitar filas.',
      },
      {
        name: 'I Faraglioni',
        description: 'Tres formaciones rocosas icónicas que emergen del mar. Símbolo de Capri.',
        type: 'viewpoint',
        tip: 'Mejores vistas desde los Jardines de Augusto o en barco.',
      },
      {
        name: 'Piazzetta',
        description: 'Plaza principal de Capri, diminuta pero glamurosa. Centro de la vida social.',
        type: 'landmark',
        tip: 'Un café aquí cuesta €8-10 pero la experiencia vale la pena.',
      },
      {
        name: 'Villa Jovis',
        description: 'Ruinas de la villa del emperador Tiberio con vistas de 360° de la isla.',
        type: 'landmark',
        tip: 'Caminata de 45 min desde la Piazzetta. Lleva agua y protección solar.',
      },
      {
        name: 'Anacapri',
        description: 'Pueblo más alto y tranquilo. Monte Solaro, Villa San Michele.',
        type: 'neighborhood',
        tip: 'Sube al Monte Solaro en telesilla para vistas espectaculares.',
      },
      {
        name: 'Jardines de Augusto',
        description: 'Jardines botánicos con las mejores vistas de los Faraglioni.',
        type: 'viewpoint',
        tip: 'Entrada ~€1. Atardecer perfecto.',
      },
    ],
    transports: [
      {
        type: 'ferry',
        from: 'Salerno',
        to: 'Capri',
        duration: '2h',
        price: '€25-30',
        link: 'https://www.alilauro.it',
        notes: 'Ferry Alilauro. También hay hidrofoil más rápido (~1h, ~€35).',
      },
    ],
    activities: [
      { date: '29 abr', description: 'Ferry desde Salerno, Grotta Azzurra, Piazzetta, Faraglioni, regreso' },
    ],
    tips: [
      'La Grotta Azzurra cierra con mal tiempo - ten plan B',
      'Capri es CARO - lleva snacks y agua',
      'El funicular sube de Marina Grande a la Piazzetta',
      'Evita fines de semana - está muy lleno',
    ],
  },
];
