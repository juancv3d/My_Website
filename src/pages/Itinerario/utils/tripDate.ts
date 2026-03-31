import { Destination } from '../destinations/types';

const TRIP_YEAR = 2026;

const MONTH_MAP: Record<string, number> = {
  ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5,
  jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11,
};

/**
 * Parse a destination's `dates` string into a [start, end] pair of Date objects.
 * Handles formats like "25-26 abr", "30 abr - 1 may", "3 may", "5-7 may"
 */
export function parseDateRange(dates: string): [Date, Date] {
  const cleaned = dates.trim();

  // "30 abr - 1 may" — two separate month parts
  const twoPartMatch = cleaned.match(/^(\d{1,2})\s+(\w+)\s*-\s*(\d{1,2})\s+(\w+)$/);
  if (twoPartMatch) {
    const startDay = parseInt(twoPartMatch[1]);
    const startMonth = MONTH_MAP[twoPartMatch[2]];
    const endDay = parseInt(twoPartMatch[3]);
    const endMonth = MONTH_MAP[twoPartMatch[4]];
    return [
      new Date(TRIP_YEAR, startMonth, startDay),
      new Date(TRIP_YEAR, endMonth, endDay),
    ];
  }

  // "25-26 abr" — day range in same month
  const rangeMatch = cleaned.match(/^(\d{1,2})-(\d{1,2})\s+(\w+)$/);
  if (rangeMatch) {
    const startDay = parseInt(rangeMatch[1]);
    const endDay = parseInt(rangeMatch[2]);
    const month = MONTH_MAP[rangeMatch[3]];
    return [
      new Date(TRIP_YEAR, month, startDay),
      new Date(TRIP_YEAR, month, endDay),
    ];
  }

  // "3 may" — single day
  const singleMatch = cleaned.match(/^(\d{1,2})\s+(\w+)$/);
  if (singleMatch) {
    const day = parseInt(singleMatch[1]);
    const month = MONTH_MAP[singleMatch[2]];
    const d = new Date(TRIP_YEAR, month, day);
    return [d, d];
  }

  // Fallback
  return [new Date(TRIP_YEAR, 0, 1), new Date(TRIP_YEAR, 0, 1)];
}

/**
 * Given a date and a list of destinations, return the index of the destination
 * that is "active" on that date. For excursion days (nights===0), it matches exactly.
 * For base destinations, it matches if the date falls within the range.
 * Returns -1 if no match.
 */
export function getTodayDestinationIndex(destinations: Destination[], date?: Date): number {
  const today = date || new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  for (let i = 0; i < destinations.length; i++) {
    const [start, end] = parseDateRange(destinations[i].dates);
    if (todayStart >= start && todayStart <= end) {
      return i;
    }
  }
  return -1;
}

/**
 * Build a day-by-day list for the entire trip.
 */
export interface DayEntry {
  date: Date;
  dateLabel: string;
  dayNumber: number;
  destinations: Destination[];
  isTravel: boolean;
}

const TRIP_START = new Date(2026, 3, 24); // Apr 24
const TRIP_DAYS = 14;

export function buildDayByDay(destinations: Destination[]): DayEntry[] {
  const days: DayEntry[] = [];
  const monthNames = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

  for (let i = 0; i < TRIP_DAYS; i++) {
    const date = new Date(TRIP_START);
    date.setDate(date.getDate() + i);
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const dayNum = date.getDate();
    const monthStr = monthNames[date.getMonth()];
    const dateLabel = `${dayNum} ${monthStr}`;

    const dayDests: Destination[] = [];
    for (const dest of destinations) {
      // Match by date range
      const [start, end] = parseDateRange(dest.dates);
      if (dayStart >= start && dayStart <= end) {
        dayDests.push(dest);
        continue;
      }
      // Also match by individual activity dates (covers Madrid on arrival days etc.)
      const hasActivity = dest.activities.some(a => {
        const actMatch = a.date.match(/(\d{1,2})\s+(\w+)/);
        if (!actMatch) return false;
        const actDay = parseInt(actMatch[1]);
        const actMonth = MONTH_MAP[actMatch[2]];
        if (actMonth === undefined) return false;
        const actDate = new Date(TRIP_YEAR, actMonth, actDay);
        return actDate.getTime() === dayStart.getTime();
      });
      if (hasActivity) {
        dayDests.push(dest);
      }
    }

    days.push({
      date: dayStart,
      dateLabel,
      dayNumber: i + 1,
      destinations: dayDests,
      isTravel: dayDests.length === 0,
    });
  }

  return days;
}

/**
 * Collect all train reservations from destinations' transport data.
 */
export interface TrainReservation {
  id: string;
  operator: string;
  trainNumber: string;
  code: string;
  from: string;
  to: string;
  date: string;
  departure: string;
  arrival: string;
  duration: string;
  price?: string;
}

export function collectTrainReservations(destinations: Destination[]): TrainReservation[] {
  const trains: TrainReservation[] = [];
  const seen = new Set<string>();

  for (const dest of destinations) {
    for (const t of dest.transports) {
      if (t.type !== 'train') continue;
      if (!t.notes) continue;

      // Extract train info from notes
      const codeMatch = t.notes.match(/(?:Código|Localizador):\s*(\S+)/);
      const timeMatch = t.notes.match(/Salida\s+(\d{1,2}:\d{2}),?\s*llegada\s+(\d{1,2}:\d{2})/i);
      const trainNumMatch = t.notes.match(/^((?:Italo|OUIGO|SNCF|Renfe)\s*\S*)/i);

      const code = codeMatch?.[1] || '';
      if (!code) continue;
      
      // Deduplicate by code + from + to
      const key = `${code}-${t.from}-${t.to}`;
      if (seen.has(key)) continue;
      seen.add(key);

      // Find the date from activities
      let dateStr = '';
      for (const act of dest.activities) {
        if (act.description.toLowerCase().includes(t.from.split('(')[0].trim().toLowerCase()) ||
            act.description.toLowerCase().includes(t.to.split('(')[0].trim().toLowerCase()) ||
            act.description.toLowerCase().includes('tren') ||
            act.description.toLowerCase().includes('ouigo') ||
            act.description.toLowerCase().includes('italo')) {
          dateStr = act.date;
          break;
        }
      }

      trains.push({
        id: `train-${code}`,
        operator: trainNumMatch?.[1]?.split(' ')[0] || 'Tren',
        trainNumber: trainNumMatch?.[1] || '',
        code,
        from: t.from,
        to: t.to,
        date: dateStr,
        departure: timeMatch?.[1] || '',
        arrival: timeMatch?.[2] || '',
        duration: t.duration,
        price: t.price,
      });
    }
  }

  return trains;
}

/**
 * Get the next upcoming transport (flight or train) with its countdown.
 */
export interface NextTransport {
  type: 'flight' | 'train';
  label: string;
  code: string;
  departureTime: Date;
  minutesUntil: number;
}

export function getNextTransport(
  destinations: Destination[],
  flightGroups: { confirmationCode: string; flights: { departure: { date: string; time: string }; from: { code: string }; to: { code: string }; flightNumber: string }[] }[],
  now?: Date,
): NextTransport | null {
  const currentTime = now || new Date();
  const candidates: NextTransport[] = [];

  // Parse flight departures
  for (const group of flightGroups) {
    for (const flight of group.flights) {
      const depDate = parseSpanishDate(flight.departure.date, flight.departure.time);
      if (!depDate) continue;
      const mins = (depDate.getTime() - currentTime.getTime()) / 60000;
      if (mins > 0 && mins <= 24 * 60) {
        candidates.push({
          type: 'flight',
          label: `✈️ ${flight.from.code} → ${flight.to.code}`,
          code: group.confirmationCode,
          departureTime: depDate,
          minutesUntil: mins,
        });
      }
    }
  }

  // Parse train departures
  const trains = collectTrainReservations(destinations);
  for (const train of trains) {
    if (!train.departure || !train.date) continue;
    const depDate = parseTrainDate(train.date, train.departure);
    if (!depDate) continue;
    const mins = (depDate.getTime() - currentTime.getTime()) / 60000;
    if (mins > 0 && mins <= 24 * 60) {
      candidates.push({
        type: 'train',
        label: `🚆 ${train.from.split('(')[0].trim()} → ${train.to.split('(')[0].trim()}`,
        code: train.code,
        departureTime: depDate,
        minutesUntil: mins,
      });
    }
  }

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => a.minutesUntil - b.minutesUntil);
  return candidates[0];
}

function parseSpanishDate(dateStr: string, timeStr: string): Date | null {
  // "Vie 25 abr" or "Jue 7 may"
  const match = dateStr.match(/(\d{1,2})\s+(\w+)/);
  if (!match) return null;
  const day = parseInt(match[1]);
  const month = MONTH_MAP[match[2]];
  if (month === undefined) return null;

  const timeParts = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!timeParts) return null;
  let hours = parseInt(timeParts[1]);
  const minutes = parseInt(timeParts[2]);
  const ampm = timeParts[3];
  if (ampm) {
    if (ampm.toUpperCase() === 'PM' && hours !== 12) hours += 12;
    if (ampm.toUpperCase() === 'AM' && hours === 12) hours = 0;
  }

  return new Date(TRIP_YEAR, month, day, hours, minutes);
}

function parseTrainDate(dateStr: string, timeStr: string): Date | null {
  // dateStr like "26 abr", timeStr like "19:12"
  const dateMatch = dateStr.match(/(\d{1,2})\s+(\w+)/);
  if (!dateMatch) return null;
  const day = parseInt(dateMatch[1]);
  const month = MONTH_MAP[dateMatch[2]];
  if (month === undefined) return null;

  const timeParts = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (!timeParts) return null;
  const hours = parseInt(timeParts[1]);
  const minutes = parseInt(timeParts[2]);

  return new Date(TRIP_YEAR, month, day, hours, minutes);
}

export function formatMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const mins = Math.round(totalMinutes % 60);
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}
