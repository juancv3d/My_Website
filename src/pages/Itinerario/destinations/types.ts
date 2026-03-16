export interface PointOfInterest {
  name: string;
  description: string;
  type: 'landmark' | 'museum' | 'restaurant' | 'beach' | 'viewpoint' | 'church' | 'neighborhood';
  coordinates?: [number, number];
  tip?: string;
}

export interface Transport {
  type: 'flight' | 'train' | 'ferry' | 'bus' | 'taxi';
  from: string;
  to: string;
  duration: string;
  price?: string;
  link?: string;
  notes?: string;
}

export interface DayActivity {
  date: string;
  description: string;
  isBase?: boolean;
}

export interface Weather {
  temp: string;
  condition: 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy';
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  coordinates: [number, number];
  dates: string;
  nights: number;
  history: string;
  highlights: string[];
  pointsOfInterest: PointOfInterest[];
  transports: Transport[];
  activities: DayActivity[];
  tips?: string[];
  imageUrl?: string;
  weather?: Weather;
}

export interface Reservation {
  id: string;
  name: string;
  status: 'confirmed' | 'pending';
  code?: string;
}

export interface Route {
  id: string;
  from: string;
  to: string;
  type: 'flight' | 'train' | 'ferry' | 'bus';
  coordinates: [number, number][];
  date: string;
  label: string;
}

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  confirmationCode: string;
  from: {
    city: string;
    code: string;
    coordinates: [number, number];
  };
  to: {
    city: string;
    code: string;
    coordinates: [number, number];
  };
  departure: {
    date: string;
    time: string;
  };
  arrival: {
    date: string;
    time: string;
  };
  duration: string;
  isReturn: boolean;
}
