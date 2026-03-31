import { Destination, Route } from './types';
import { roma } from './roma';
import { italiaSur } from './italia-sur';
import { florencia } from './florencia';
import { nizaMonaco } from './niza-monaco';
import { barcelona } from './barcelona';
import { madrid } from './madrid';
import { flights } from './flights';

export { flights };

export const destinations: Destination[] = [
  roma,
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
    id: 'mad-fco',
    from: 'Madrid',
    to: 'Roma',
    type: 'flight',
    date: '25 abr',
    label: '25 abr · W46012 Madrid → Roma FCO',
    coordinates: [
      [40.4168, -3.7038],
      [40.9, 5.5],
      [41.9028, 12.4964],
    ],
  },
  {
    id: 'rom-sal',
    from: 'Roma',
    to: 'Salerno',
    type: 'train',
    date: '26 abr',
    label: '26 abr · Italo 9947 Roma Tiburtina → Salerno',
    coordinates: [
      [41.9028, 12.4964],
      [41.1, 13.6],
      [40.6824, 14.7681],
    ],
  },
  {
    id: 'sal-ama',
    from: 'Salerno',
    to: 'Amalfi',
    type: 'ferry',
    date: '27 abr',
    label: '27 abr · Ferry Salerno → Amalfi',
    coordinates: [
      [40.6824, 14.7681],
      [40.6340, 14.6027],
    ],
  },
  {
    id: 'ama-rav',
    from: 'Amalfi',
    to: 'Ravello',
    type: 'bus',
    date: '27 abr',
    label: '27 abr · Bus Amalfi → Ravello',
    coordinates: [
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
    id: 'sal-pos',
    from: 'Salerno',
    to: 'Positano',
    type: 'ferry',
    date: '28 abr',
    label: '28 abr · Ferry Salerno → Positano',
    coordinates: [
      [40.6824, 14.7681],
      [40.6281, 14.4850],
    ],
  },
  {
    id: 'pos-sal',
    from: 'Positano',
    to: 'Salerno',
    type: 'ferry',
    date: '28 abr',
    label: '28 abr · Ferry Positano → Salerno',
    coordinates: [
      [40.6281, 14.4850],
      [40.6824, 14.7681],
    ],
  },
  {
    id: 'sal-cap',
    from: 'Salerno',
    to: 'Capri',
    type: 'ferry',
    date: '29 abr',
    label: '29 abr · Ferry Salerno → Capri',
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
    date: '29 abr',
    label: '29 abr · Ferry Capri → Salerno',
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
    date: '30 abr',
    label: '30 abr · Italo 8158 Salerno → Florencia',
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
    type: 'flight',
    date: '2 may',
    label: '2 may · ITA Airways Florencia → Niza',
    coordinates: [
      [43.7696, 11.2558],
      [43.7, 9.2],
      [43.7102, 7.2620],
    ],
  },
  {
    id: 'niz-mon',
    from: 'Niza',
    to: 'Mónaco',
    type: 'train',
    date: '3 may',
    label: '3 may · Tren Niza → Mónaco',
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
    date: '3 may',
    label: '3 may · Tren Mónaco → Niza',
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
    date: '4 may',
    label: '4 may · Vueling Niza → Barcelona',
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
    label: '5 may · OUIGO 06570 Barcelona → Madrid',
    coordinates: [
      [41.3874, 2.1686],
      [41.0, -0.5],
      [40.4168, -3.7038],
    ],
  },
];

export * from './types';
