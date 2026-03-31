import { useState, useCallback } from 'react';
import { Destination, Reservation, FlightGroup, Flight } from './destinations/types';
import { destinations as defaultDestinations, flights as defaultFlightsArray } from './destinations';
import { wizzAirFlight, itaAirwaysFlight, vuelingFlight } from './destinations/flights';

const STORAGE_KEY_DESTINATIONS = 'itinerario-destinations';
const STORAGE_KEY_RESERVATIONS = 'itinerario-reservations';
const STORAGE_KEY_FLIGHT_GROUPS = 'itinerario-flight-groups';

const defaultReservations: Reservation[] = [
  { id: 'uffizi', name: 'Uffizi Florencia', status: 'pending' },
  { id: 'accademia', name: "Galleria dell'Accademia", status: 'pending' },
  { id: 'sagrada', name: 'Sagrada Familia Barcelona', status: 'pending' },
  { id: 'aloj-roma', name: 'Alojamiento Roma', status: 'pending' },
  { id: 'aloj-salerno', name: 'Alojamiento Salerno', status: 'pending' },
  { id: 'aloj-florencia', name: 'Alojamiento Florencia', status: 'pending' },
  { id: 'aloj-niza', name: 'Alojamiento Niza', status: 'pending' },
  { id: 'aloj-barcelona', name: 'Alojamiento Barcelona', status: 'pending' },
  { id: 'aloj-madrid', name: 'Alojamiento Madrid', status: 'pending' },
];

const defaultFlightGroups: FlightGroup[] = [
  {
    id: 'klm-main',
    name: 'Vuelos KLM',
    airline: 'KLM',
    confirmationCode: 'ZIFHKS',
    flights: defaultFlightsArray,
  },
  {
    id: 'wizz-mad-fco',
    name: 'Wizz Air MAD→FCO',
    airline: 'Wizz Air',
    confirmationCode: 'KNKJVW',
    flights: [wizzAirFlight],
  },
  {
    id: 'ita-flr-nce',
    name: 'ITA Airways FLR→NCE',
    airline: 'ITA Airways',
    confirmationCode: '1122-428-852',
    flights: [itaAirwaysFlight],
  },
  {
    id: 'vueling-nce-bcn',
    name: 'Vueling NCE→BCN',
    airline: 'Vueling',
    confirmationCode: '1123-116-110',
    flights: [vuelingFlight],
  },
];

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function useEditableItinerary() {
  const [destinations, setDestinations] = useState<Destination[]>(() =>
    loadFromStorage(STORAGE_KEY_DESTINATIONS, defaultDestinations)
  );
  const [reservations, setReservations] = useState<Reservation[]>(() =>
    loadFromStorage(STORAGE_KEY_RESERVATIONS, defaultReservations)
  );
  const [flightGroups, setFlightGroups] = useState<FlightGroup[]>(() =>
    loadFromStorage(STORAGE_KEY_FLIGHT_GROUPS, defaultFlightGroups)
  );

  const isEdited =
    localStorage.getItem(STORAGE_KEY_DESTINATIONS) !== null ||
    localStorage.getItem(STORAGE_KEY_RESERVATIONS) !== null ||
    localStorage.getItem(STORAGE_KEY_FLIGHT_GROUPS) !== null;

  const updateDestination = useCallback((updated: Destination) => {
    setDestinations(prev => {
      const next = prev.map(d => (d.id === updated.id ? updated : d));
      saveToStorage(STORAGE_KEY_DESTINATIONS, next);
      return next;
    });
  }, []);

  const toggleReservationStatus = useCallback((id: string) => {
    setReservations(prev => {
      const next = prev.map(r =>
        r.id === id
          ? { ...r, status: (r.status === 'confirmed' ? 'pending' : 'confirmed') as 'confirmed' | 'pending' }
          : r
      );
      saveToStorage(STORAGE_KEY_RESERVATIONS, next);
      return next;
    });
  }, []);

  const updateReservationCode = useCallback((id: string, code: string) => {
    setReservations(prev => {
      const next = prev.map(r => (r.id === id ? { ...r, code } : r));
      saveToStorage(STORAGE_KEY_RESERVATIONS, next);
      return next;
    });
  }, []);

  const addFlightGroup = useCallback((group: Omit<FlightGroup, 'id'>) => {
    setFlightGroups(prev => {
      const next = [...prev, { ...group, id: generateId() }];
      saveToStorage(STORAGE_KEY_FLIGHT_GROUPS, next);
      return next;
    });
  }, []);

  const updateFlightGroup = useCallback((groupId: string, updates: Partial<Omit<FlightGroup, 'id'>>) => {
    setFlightGroups(prev => {
      const next = prev.map(g => (g.id === groupId ? { ...g, ...updates } : g));
      saveToStorage(STORAGE_KEY_FLIGHT_GROUPS, next);
      return next;
    });
  }, []);

  const deleteFlightGroup = useCallback((groupId: string) => {
    setFlightGroups(prev => {
      const next = prev.filter(g => g.id !== groupId);
      saveToStorage(STORAGE_KEY_FLIGHT_GROUPS, next);
      return next;
    });
  }, []);

  const addFlight = useCallback((groupId: string, flight: Omit<Flight, 'id'>) => {
    setFlightGroups(prev => {
      const next = prev.map(g => {
        if (g.id === groupId) {
          return { ...g, flights: [...g.flights, { ...flight, id: generateId() }] };
        }
        return g;
      });
      saveToStorage(STORAGE_KEY_FLIGHT_GROUPS, next);
      return next;
    });
  }, []);

  const updateFlight = useCallback((groupId: string, flightId: string, updates: Partial<Omit<Flight, 'id'>>) => {
    setFlightGroups(prev => {
      const next = prev.map(g => {
        if (g.id === groupId) {
          return {
            ...g,
            flights: g.flights.map(f => (f.id === flightId ? { ...f, ...updates } : f)),
          };
        }
        return g;
      });
      saveToStorage(STORAGE_KEY_FLIGHT_GROUPS, next);
      return next;
    });
  }, []);

  const deleteFlight = useCallback((groupId: string, flightId: string) => {
    setFlightGroups(prev => {
      const next = prev.map(g => {
        if (g.id === groupId) {
          return { ...g, flights: g.flights.filter(f => f.id !== flightId) };
        }
        return g;
      });
      saveToStorage(STORAGE_KEY_FLIGHT_GROUPS, next);
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_DESTINATIONS);
    localStorage.removeItem(STORAGE_KEY_RESERVATIONS);
    localStorage.removeItem(STORAGE_KEY_FLIGHT_GROUPS);
    setDestinations(defaultDestinations);
    setReservations(defaultReservations);
    setFlightGroups(defaultFlightGroups);
  }, []);

  return {
    destinations,
    reservations,
    flightGroups,
    isEdited,
    updateDestination,
    toggleReservationStatus,
    updateReservationCode,
    addFlightGroup,
    updateFlightGroup,
    deleteFlightGroup,
    addFlight,
    updateFlight,
    deleteFlight,
    resetAll,
  };
}
