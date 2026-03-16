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
