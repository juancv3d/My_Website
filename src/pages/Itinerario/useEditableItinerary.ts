import { useState, useCallback } from 'react';
import { Destination, Reservation } from './destinations/types';
import { destinations as defaultDestinations } from './destinations';

const STORAGE_KEY_DESTINATIONS = 'itinerario-destinations';
const STORAGE_KEY_RESERVATIONS = 'itinerario-reservations';

const defaultReservations: Reservation[] = [
  { id: 'vuelos', name: 'Vuelos KLM', status: 'confirmed', code: 'ZIFHKS' },
  { id: 'uffizi', name: 'Uffizi Florencia', status: 'pending' },
  { id: 'accademia', name: "Galleria dell'Accademia", status: 'pending' },
  { id: 'sagrada', name: 'Sagrada Familia Barcelona', status: 'pending' },
  { id: 'tren-sal-flo', name: 'Tren Salerno→Florencia', status: 'pending' },
  { id: 'tren-flo-niz', name: 'Tren Florencia→Niza', status: 'pending' },
  { id: 'vuelo-niz-bcn', name: 'Vuelo Niza→Barcelona', status: 'pending' },
  { id: 'ave-bcn-mad', name: 'AVE Barcelona→Madrid', status: 'pending' },
  { id: 'aloj-salerno', name: 'Alojamiento Salerno', status: 'pending' },
  { id: 'aloj-florencia', name: 'Alojamiento Florencia', status: 'pending' },
  { id: 'aloj-niza', name: 'Alojamiento Niza', status: 'pending' },
  { id: 'aloj-barcelona', name: 'Alojamiento Barcelona', status: 'pending' },
  { id: 'aloj-madrid', name: 'Alojamiento Madrid', status: 'pending' },
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

export function useEditableItinerary() {
  const [destinations, setDestinations] = useState<Destination[]>(() =>
    loadFromStorage(STORAGE_KEY_DESTINATIONS, defaultDestinations)
  );
  const [reservations, setReservations] = useState<Reservation[]>(() =>
    loadFromStorage(STORAGE_KEY_RESERVATIONS, defaultReservations)
  );

  const isEdited =
    localStorage.getItem(STORAGE_KEY_DESTINATIONS) !== null ||
    localStorage.getItem(STORAGE_KEY_RESERVATIONS) !== null;

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

  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_DESTINATIONS);
    localStorage.removeItem(STORAGE_KEY_RESERVATIONS);
    setDestinations(defaultDestinations);
    setReservations(defaultReservations);
  }, []);

  return {
    destinations,
    reservations,
    isEdited,
    updateDestination,
    toggleReservationStatus,
    updateReservationCode,
    resetAll,
  };
}
