import { Flight } from './types';

export const flights: Flight[] = [
  {
    id: 'ctg-ams',
    flightNumber: 'KL749',
    airline: 'KLM',
    confirmationCode: 'ZIFHKS',
    from: {
      city: 'Cartagena',
      code: 'CTG',
      coordinates: [10.3910, -75.4794],
    },
    to: {
      city: 'Ámsterdam',
      code: 'AMS',
      coordinates: [52.3676, 4.9041],
    },
    departure: {
      date: 'Jue 23 abr',
      time: '6:05 PM',
    },
    arrival: {
      date: 'Vie 24 abr',
      time: '10:50 AM',
    },
    duration: '9h 45m',
    isReturn: false,
  },
  {
    id: 'ams-mad',
    flightNumber: 'KL1505',
    airline: 'KLM',
    confirmationCode: 'ZIFHKS',
    from: {
      city: 'Ámsterdam',
      code: 'AMS',
      coordinates: [52.3676, 4.9041],
    },
    to: {
      city: 'Madrid',
      code: 'MAD',
      coordinates: [40.4168, -3.7038],
    },
    departure: {
      date: 'Vie 24 abr',
      time: '1:50 PM',
    },
    arrival: {
      date: 'Vie 24 abr',
      time: '4:25 PM',
    },
    duration: '2h 35m',
    isReturn: false,
  },
  {
    id: 'mad-ams',
    flightNumber: 'KL1500',
    airline: 'KLM',
    confirmationCode: 'ZIFHKS',
    from: {
      city: 'Madrid',
      code: 'MAD',
      coordinates: [40.4168, -3.7038],
    },
    to: {
      city: 'Ámsterdam',
      code: 'AMS',
      coordinates: [52.3676, 4.9041],
    },
    departure: {
      date: 'Jue 7 may',
      time: '6:00 AM',
    },
    arrival: {
      date: 'Jue 7 may',
      time: '8:25 AM',
    },
    duration: '2h 25m',
    isReturn: true,
  },
  {
    id: 'ams-ctg',
    flightNumber: 'KL749',
    airline: 'KLM',
    confirmationCode: 'ZIFHKS',
    from: {
      city: 'Ámsterdam',
      code: 'AMS',
      coordinates: [52.3676, 4.9041],
    },
    to: {
      city: 'Cartagena',
      code: 'CTG',
      coordinates: [10.3910, -75.4794],
    },
    departure: {
      date: 'Jue 7 may',
      time: '9:50 AM',
    },
    arrival: {
      date: 'Jue 7 may',
      time: '4:45 PM',
    },
    duration: '13h 55m',
    isReturn: true,
  },
];

export const wizzAirFlight: Flight = {
  id: 'mad-fco',
  flightNumber: 'W46012',
  airline: 'Wizz Air',
  confirmationCode: 'KNKJVW',
  from: {
    city: 'Madrid',
    code: 'MAD',
    coordinates: [40.4168, -3.7038],
  },
  to: {
    city: 'Roma',
    code: 'FCO',
    coordinates: [41.8003, 12.2389],
  },
  departure: {
    date: 'Vie 25 abr',
    time: '9:25 AM',
  },
  arrival: {
    date: 'Vie 25 abr',
    time: '11:55 AM',
  },
  duration: '2h 30m',
  isReturn: false,
};

export const itaAirwaysFlight: Flight = {
  id: 'flr-nce',
  flightNumber: 'ITA Airways',
  airline: 'ITA Airways',
  confirmationCode: '1122-428-852',
  from: {
    city: 'Florencia',
    code: 'FLR',
    coordinates: [43.8100, 11.2051],
  },
  to: {
    city: 'Niza',
    code: 'NCE',
    coordinates: [43.6584, 7.2158],
  },
  departure: {
    date: 'Sáb 2 may',
    time: '3:30 PM',
  },
  arrival: {
    date: 'Sáb 2 may',
    time: '6:30 PM',
  },
  duration: '3h (1 cambio)',
  isReturn: false,
};

export const vuelingFlight: Flight = {
  id: 'nce-bcn',
  flightNumber: 'Vueling',
  airline: 'Vueling',
  confirmationCode: '1123-116-110',
  from: {
    city: 'Niza',
    code: 'NCE',
    coordinates: [43.6584, 7.2158],
  },
  to: {
    city: 'Barcelona',
    code: 'BCN',
    coordinates: [41.2974, 2.0833],
  },
  departure: {
    date: 'Dom 4 may',
    time: '7:50 AM',
  },
  arrival: {
    date: 'Dom 4 may',
    time: '9:10 AM',
  },
  duration: '1h 20m',
  isReturn: false,
};
