import { Destination, Route } from './types';
import { italiaSur } from './italia-sur';
import { florencia } from './florencia';
import { nizaMonaco } from './niza-monaco';
import { barcelona } from './barcelona';
import { madrid } from './madrid';
import { flights } from './flights';

export { flights };

export const destinations: Destination[] = [
  ...italiaSur,
  florencia,
  ...nizaMonaco,
  barcelona,
  madrid,
];

export const routes: Route[] = [
  {
    id: 'ams-mad',
    from: 'Amsterdam',
    to: 'Madrid',
    type: 'flight',
    date: '24 abr',
    label: '24 abr · KL1505 Amsterdam → Madrid',
    coordinates: [
      [52.3676, 4.9041],
      [46.5, 0.5],
      [40.4168, -3.7038],
    ],
  },
  {
    id: 'mad-nap',
    from: 'Madrid',
    to: 'Nápoles',
    type: 'flight',
    date: '25 abr',
    label: '25 abr · Vuelo Madrid → Nápoles',
    coordinates: [
      [40.4168, -3.7038],
      [40.9, 5.5],
      [40.8518, 14.2681],
    ],
  },
  {
    id: 'nap-sal',
    from: 'Nápoles',
    to: 'Salerno',
    type: 'train',
    date: '25 abr',
    label: '25 abr · Tren Nápoles → Salerno',
    coordinates: [
      [40.8518, 14.2681],
      [40.6824, 14.7681],
    ],
  },
  {
    id: 'sal-pos',
    from: 'Salerno',
    to: 'Positano',
    type: 'ferry',
    date: '26 abr',
    label: '26 abr · Ferry Salerno → Positano',
    coordinates: [
      [40.6824, 14.7681],
      [40.6281, 14.4850],
    ],
  },
  {
    id: 'pos-ama',
    from: 'Positano',
    to: 'Amalfi',
    type: 'ferry',
    date: '26 abr',
    label: '26 abr · Ferry Positano → Amalfi',
    coordinates: [
      [40.6281, 14.4850],
      [40.6340, 14.6027],
    ],
  },
  {
    id: 'ama-sal',
    from: 'Amalfi',
    to: 'Salerno',
    type: 'ferry',
    date: '26 abr',
    label: '26 abr · Ferry Amalfi → Salerno',
    coordinates: [
      [40.6340, 14.6027],
      [40.6824, 14.7681],
    ],
  },
  {
    id: 'sal-rav',
    from: 'Salerno',
    to: 'Ravello',
    type: 'bus',
    date: '27 abr',
    label: '27 abr · Bus Salerno → Amalfi → Ravello',
    coordinates: [
      [40.6824, 14.7681],
      [40.6340, 14.6027],
      [40.6491, 14.6117],
    ],
  },
  {
    id: 'rav-sal',
    from: 'Ravello',
    to: 'Salerno',
    type: 'bus',
    date: '27 abr',
    label: '27 abr · Bus/Ferry Ravello → Salerno',
    coordinates: [
      [40.6491, 14.6117],
      [40.6340, 14.6027],
      [40.6824, 14.7681],
    ],
  },
  {
    id: 'sal-cap',
    from: 'Salerno',
    to: 'Capri',
    type: 'ferry',
    date: '28 abr',
    label: '28 abr · Ferry Salerno → Capri',
    coordinates: [
      [40.6824, 14.7681],
      [40.5508, 14.2225],
    ],
  },
  {
    id: 'cap-sal',
    from: 'Capri',
    to: 'Salerno',
    type: 'ferry',
    date: '28 abr',
    label: '28 abr · Ferry Capri → Salerno',
    coordinates: [
      [40.5508, 14.2225],
      [40.6824, 14.7681],
    ],
  },
  {
    id: 'sal-flo',
    from: 'Salerno',
    to: 'Florencia',
    type: 'train',
    date: '29 abr',
    label: '29 abr · Tren AV Salerno → Florencia',
    coordinates: [
      [40.6824, 14.7681],
      [41.9028, 12.4964],
      [43.7696, 11.2558],
    ],
  },
  {
    id: 'flo-niz',
    from: 'Florencia',
    to: 'Niza',
    type: 'train',
    date: '1 may',
    label: '1 may · Tren Florencia → Niza',
    coordinates: [
      [43.7696, 11.2558],
      [44.4056, 8.9463],
      [43.7102, 7.2620],
    ],
  },
  {
    id: 'niz-mon',
    from: 'Niza',
    to: 'Mónaco',
    type: 'train',
    date: '2 may',
    label: '2 may · Tren Niza → Mónaco',
    coordinates: [
      [43.7102, 7.2620],
      [43.7384, 7.4246],
    ],
  },
  {
    id: 'mon-niz',
    from: 'Mónaco',
    to: 'Niza',
    type: 'train',
    date: '2 may',
    label: '2 may · Tren Mónaco → Niza',
    coordinates: [
      [43.7384, 7.4246],
      [43.7102, 7.2620],
    ],
  },
  {
    id: 'niz-bcn',
    from: 'Niza',
    to: 'Barcelona',
    type: 'flight',
    date: '3 may',
    label: '3 may · Vuelo Niza → Barcelona',
    coordinates: [
      [43.7102, 7.2620],
      [42.5, 4.5],
      [41.3874, 2.1686],
    ],
  },
  {
    id: 'bcn-mad',
    from: 'Barcelona',
    to: 'Madrid',
    type: 'train',
    date: '5 may',
    label: '5 may · AVE Barcelona → Madrid',
    coordinates: [
      [41.3874, 2.1686],
      [41.0, -0.5],
      [40.4168, -3.7038],
    ],
  },
];

export * from './types';
