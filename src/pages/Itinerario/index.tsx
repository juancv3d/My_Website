import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import ArrowPolyline from './ArrowPolyline';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { routes } from './destinations';
import { Destination, Route, FlightGroup } from './destinations/types';
import DestinationModal from './DestinationModal';
import EditDestinationModal from './EditDestinationModal';
import AddFlightModal from './AddFlightModal';
import { useEditableItinerary } from './useEditableItinerary';
import { useDragGesture, SnapPoint } from './hooks/useDragGesture';
import {
  getTodayDestinationIndex,
  collectTrainReservations,
  getNextTransport,
  formatMinutes,
  buildDayByDay,
} from './utils/tripDate';
import './styles.css';

const TRIP_START = new Date('2026-04-24');
const TRIP_END = new Date('2026-05-07');
const TRIP_DAYS = 14;

const countryFlags: Record<string, string> = {
  'Italia': '🇮🇹',
  'Francia': '🇫🇷',
  'Mónaco': '🇲🇨',
  'España': '🇪🇸',
};

const transportEmojis: Record<string, string> = {
  flight: '✈️',
  train: '🚆',
  ferry: '⛴️',
  bus: '🚌',
};

const weatherEmojis: Record<string, string> = {
  'sunny': '☀️',
  'partly-cloudy': '⛅',
  'cloudy': '☁️',
  'rainy': '🌧️',
};

const createIcon = (dest: Destination, order: number, isActive: boolean) => {
  const isBase = dest.nights > 0;
  const size = isBase ? 34 : 26;
  const nightsBadge = isBase ? `<span class="marker-nights">${dest.nights}</span>` : '';
  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="marker-container${isActive ? ' active' : ''}">
      <div class="marker-pin ${isBase ? 'marker-base' : 'marker-excursion'}">
        <span class="marker-order">${order}</span>
        ${nightsBadge}
      </div>
      <span class="marker-label">${dest.name}</span>
    </div>`,
    iconSize: [size, size + 24],
    iconAnchor: [size / 2, size / 2],
  });
};

const routeColors: Record<string, { color: string; dashArray?: string }> = {
  flight: { color: '#5856D6', dashArray: '8,10' },
  train: { color: '#34C759' },
  ferry: { color: '#007AFF', dashArray: '8,10' },
  bus: { color: '#FF9500', dashArray: '6,8' },
};

function FlyToDestination({ destination }: { destination: Destination | null }) {
  const map = useMap();
  if (destination) {
    map.flyTo(destination.coordinates, 10, { duration: 1.5 });
  }
  return null;
}

function MapRefSetter({ mapRef }: { mapRef: React.MutableRefObject<L.Map | null> }) {
  const map = useMap();
  mapRef.current = map;
  return null;
}

function getCountdownInfo() {
  const now = new Date();
  const startDiff = Math.ceil((TRIP_START.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const endDiff = Math.ceil((TRIP_END.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (startDiff > 0) {
    return { text: `Faltan ${startDiff} días`, status: 'before', progress: 0 };
  } else if (endDiff >= 0) {
    const dayNum = TRIP_DAYS - endDiff;
    const progress = (dayNum / TRIP_DAYS) * 100;
    return { text: `Día ${dayNum} de ${TRIP_DAYS}`, status: 'during', progress };
  } else {
    return { text: `Hace ${Math.abs(endDiff)} días`, status: 'after', progress: 100 };
  }
}

function getTransportBetween(fromId: string, toId: string, dests: Destination[]): string | null {
  const route = routes.find(r => {
    const fromName = dests.find(d => d.id === fromId)?.name;
    const toName = dests.find(d => d.id === toId)?.name;
    return r.from === fromName && r.to === toName;
  });
  return route ? transportEmojis[route.type] : null;
}

function Itinerario() {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addFlightModalOpen, setAddFlightModalOpen] = useState(false);
  const [flyTo, setFlyTo] = useState<Destination | null>(null);
  const [showFlights, setShowFlights] = useState(false);
  const [showReservas, setShowReservas] = useState(false);
  const [showTrenes, setShowTrenes] = useState(false);
  const [snapPoint, setSnapPoint] = useState<SnapPoint>('half');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [showMapLegend, setShowMapLegend] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'destino' | 'dia'>('destino');
  const mapRef = useRef<L.Map | null>(null);
  const todayCardRef = useRef<HTMLDivElement | null>(null);
  const sidebarScrollRef = useRef<HTMLDivElement | null>(null);

  const snapPointHeights = useMemo(() => ({
    collapsed: 140,
    half: window.innerHeight * 0.5,
    expanded: window.innerHeight * 0.9,
  }), []);

  const { isDragging, dragOffset, handlers: dragHandlers } = useDragGesture({
    snapPoints: snapPointHeights,
    currentSnap: snapPoint,
    onSnapChange: setSnapPoint,
  });

  const {
    destinations,
    reservations,
    flightGroups,
    isEdited,
    updateDestination,
    toggleReservationStatus,
    updateReservationCode,
    addFlightGroup,
    deleteFlightGroup,
    addFlight,
    deleteFlight,
    resetAll,
  } = useEditableItinerary();

  const countdown = getCountdownInfo();
  const pendingCount = reservations.filter(r => r.status === 'pending').length;
  const totalFlights = flightGroups.reduce((acc, g) => acc + g.flights.length, 0);

  // Feature 1: Today's destination
  const todayIndex = useMemo(() => getTodayDestinationIndex(destinations), [destinations]);
  const todayDestination = todayIndex >= 0 ? destinations[todayIndex] : null;

  // Feature 2: Train reservations
  const trainReservations = useMemo(() => collectTrainReservations(destinations), [destinations]);

  // Feature 4: Next transport countdown
  const [nextTransport, setNextTransport] = useState(() => getNextTransport(destinations, flightGroups));
  useEffect(() => {
    const update = () => setNextTransport(getNextTransport(destinations, flightGroups));
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [destinations, flightGroups]);

  // Feature 5: Day-by-day data
  const dayByDay = useMemo(() => buildDayByDay(destinations), [destinations]);

  // Feature 3: Copy to clipboard
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setToastMessage('¡Copiado!');
      setTimeout(() => setToastMessage(null), 2000);
    }).catch(() => {
      setToastMessage('Error al copiar');
      setTimeout(() => setToastMessage(null), 2000);
    });
  }, []);

  // Feature 1: Auto-scroll to today & fly map
  const hasAutoScrolled = useRef(false);
  useEffect(() => {
    if (hasAutoScrolled.current) return;
    if (todayDestination) {
      hasAutoScrolled.current = true;
      // Fly map to today's location
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.flyTo(todayDestination.coordinates, 10, { duration: 1.5 });
        }
      }, 500);
      // Auto-scroll sidebar to today's card
      setTimeout(() => {
        if (todayCardRef.current && sidebarScrollRef.current) {
          todayCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 800);
      setSelectedDestination(todayDestination);
    }
  }, [todayDestination]);

  // Feature 6: Mobile quick actions
  const handleScrollToToday = useCallback(() => {
    if (todayDestination) {
      setSelectedDestination(todayDestination);
      setFlyTo(todayDestination);
      setTimeout(() => setFlyTo(null), 100);
      if (todayCardRef.current) {
        todayCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [todayDestination]);

  const handleCollapseSheet = useCallback(() => {
    if (snapPoint === 'collapsed') {
      setSnapPoint('half');
    } else {
      setSnapPoint('collapsed');
    }
  }, [snapPoint]);

  const handleShowNextTransport = useCallback(() => {
    if (nextTransport) {
      copyToClipboard(nextTransport.code);
    }
  }, [nextTransport, copyToClipboard]);

  const toggleGroupExpanded = (groupId: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  const groupedDestinations = useMemo(() => {
    const groups: { country: string; destinations: Destination[] }[] = [];
    let currentCountry = '';
    
    destinations.forEach(dest => {
      if (dest.country !== currentCountry) {
        currentCountry = dest.country;
        groups.push({ country: currentCountry, destinations: [dest] });
      } else {
        groups[groups.length - 1].destinations.push(dest);
      }
    });
    
    return groups;
  }, [destinations]);

  const handleMarkerClick = (destination: Destination) => {
    setSelectedDestination(destination);
    setModalOpen(true);
  };

  const handleItineraryClick = (destination: Destination) => {
    setSelectedDestination(destination);
    setFlyTo(destination);
    setTimeout(() => setFlyTo(null), 100);
  };

  const handleDeleteFlightGroup = (groupId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('¿Eliminar esta reserva de vuelos?')) {
      deleteFlightGroup(groupId);
    }
  };

  const handleDeleteFlight = (groupId: string, flightId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('¿Eliminar este vuelo?')) {
      deleteFlight(groupId, flightId);
    }
  };

  const renderPopupContent = (dest: Destination) => (
    <div className="popup-content">
      <div className="popup-name">{dest.name}</div>
      <div className="popup-meta">
        <span className="popup-dates">{dest.dates}</span>
        {dest.nights > 0 && <span className="popup-nights">{dest.nights} noches</span>}
        {dest.weather && (
          <span className="popup-weather">
            {weatherEmojis[dest.weather.condition]} {dest.weather.temp}
          </span>
        )}
      </div>
      {dest.highlights && dest.highlights.length > 0 && (
        <div className="popup-highlights">
          <div className="popup-highlights-title">Destacados</div>
          {dest.highlights.slice(0, 2).map((h, i) => (
            <div key={i} className="popup-highlight-item">• {h.split(' - ')[0]}</div>
          ))}
        </div>
      )}
      <button className="popup-btn" onClick={() => handleMarkerClick(dest)}>
        Ver detalles
      </button>
    </div>
  );

  const renderFlightGroup = (group: FlightGroup) => {
    const isExpanded = expandedGroups.has(group.id);
    
    return (
      <div key={group.id} className="flight-group-item">
        <div 
          className="flight-group-header"
          onClick={() => toggleGroupExpanded(group.id)}
        >
          <span className={`flight-group-toggle ${isExpanded ? 'open' : ''}`}>›</span>
          <div className="flight-group-info">
            <span className="flight-group-airline">✈️ {group.name}</span>
            <button
              className="copy-code-btn"
              onClick={(e) => { e.stopPropagation(); copyToClipboard(group.confirmationCode); }}
              title="Copiar código"
            >
              <span className="flight-group-code">{group.confirmationCode}</span>
              <span className="copy-icon">📋</span>
            </button>
            <span className="flight-group-count">({group.flights.length} vuelos)</span>
          </div>
          <div className="flight-group-actions">
            <button 
              className="flight-group-btn delete"
              onClick={(e) => handleDeleteFlightGroup(group.id, e)}
              title="Eliminar reserva"
            >
              ×
            </button>
          </div>
        </div>
        
        {isExpanded && group.flights.length > 0 && (
          <div className="flight-group-flights">
            {group.flights.map((flight) => (
              <div key={flight.id} className={`flight-card ${flight.isReturn ? 'return' : 'outbound'}`}>
                <div className="flight-header">
                  <span className="flight-number">{flight.flightNumber}</span>
                  <span className="flight-duration">{flight.duration}</span>
                  <button
                    className="flight-delete-btn"
                    onClick={(e) => handleDeleteFlight(group.id, flight.id, e)}
                    title="Eliminar vuelo"
                  >
                    ×
                  </button>
                </div>
                <div className="flight-route">
                  <div className="flight-endpoint">
                    <span className="airport-code">{flight.from.code}</span>
                    <span className="flight-time">{flight.departure.time}</span>
                    <span className="flight-date">{flight.departure.date}</span>
                  </div>
                  <div className="flight-arrow">→</div>
                  <div className="flight-endpoint">
                    <span className="airport-code">{flight.to.code}</span>
                    <span className="flight-time">{flight.arrival.time}</span>
                    <span className="flight-date">{flight.arrival.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const sidebarClassName = useMemo(() => {
    const classes = ['itinerario-sidebar'];
    if (snapPoint === 'collapsed') classes.push('collapsed');
    if (snapPoint === 'expanded') classes.push('expanded');
    if (isDragging) classes.push('dragging');
    return classes.join(' ');
  }, [snapPoint, isDragging]);

  const sidebarStyle = useMemo(() => {
    if (!isDragging) return {};
    const currentHeight = snapPointHeights[snapPoint];
    const newHeight = Math.max(140, Math.min(window.innerHeight * 0.9, currentHeight + dragOffset));
    return { maxHeight: `${newHeight}px` };
  }, [isDragging, dragOffset, snapPoint, snapPointHeights]);

  const handleCenterMap = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.flyTo([43.3, 7.5], 5, { duration: 1.5 });
    }
  }, []);

  const handleNextDestination = useCallback(() => {
    const currentIndex = selectedDestination 
      ? destinations.findIndex(d => d.id === selectedDestination.id)
      : -1;
    const nextIndex = (currentIndex + 1) % destinations.length;
    const nextDest = destinations[nextIndex];
    setSelectedDestination(nextDest);
    setFlyTo(nextDest);
    setTimeout(() => setFlyTo(null), 100);
  }, [selectedDestination, destinations]);

  const handlePrevDestination = useCallback(() => {
    const currentIndex = selectedDestination 
      ? destinations.findIndex(d => d.id === selectedDestination.id)
      : 0;
    const prevIndex = currentIndex <= 0 ? destinations.length - 1 : currentIndex - 1;
    const prevDest = destinations[prevIndex];
    setSelectedDestination(prevDest);
    setFlyTo(prevDest);
    setTimeout(() => setFlyTo(null), 100);
  }, [selectedDestination, destinations]);

  return (
    <div className="itinerario-container">
      <div className={sidebarClassName} style={sidebarStyle}>
        <div 
          className="sidebar-drag-handle"
          {...dragHandlers}
        >
          <div className="drag-indicator"></div>
        </div>
        
        <div className="sidebar-header">
          <h1>Viaje a Europa</h1>
          <p className="dates">23 abr → 7 may 2026</p>
          <div className="countdown-section">
            <div className={`countdown-text ${countdown.status}`}>{countdown.text}</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${countdown.progress}%` }}></div>
            </div>
          </div>
        </div>

        <div className="sidebar-scrollable" ref={sidebarScrollRef}>

        {/* Feature 4: Next Transport Countdown */}
        {nextTransport && (
          <div className="next-transport-banner" onClick={() => copyToClipboard(nextTransport.code)}>
            <div className="next-transport-info">
              <span className="next-transport-label">{nextTransport.label}</span>
              <span className="next-transport-time">en {formatMinutes(nextTransport.minutesUntil)}</span>
            </div>
            <button
              className="copy-code-btn compact"
              onClick={(e) => { e.stopPropagation(); copyToClipboard(nextTransport.code); }}
            >
              <span className="next-transport-code">{nextTransport.code}</span>
              <span className="copy-icon">📋</span>
            </button>
          </div>
        )}

        <div className="flights-section">
          <button 
            className="flights-toggle"
            onClick={() => setShowFlights(!showFlights)}
          >
            <span className="flights-icon">✈️</span>
            <span>Vuelos</span>
            <span className="flights-count-badge">{flightGroups.length} reservas · {totalFlights} vuelos</span>
            <span className={`toggle-arrow ${showFlights ? 'open' : ''}`}>›</span>
          </button>
          
          {showFlights && (
            <div className="flight-groups-container">
              {flightGroups.map(renderFlightGroup)}
              <button 
                className="add-flight-btn"
                onClick={() => setAddFlightModalOpen(true)}
              >
                + Agregar vuelo
              </button>
            </div>
          )}
        </div>

        {/* Feature 2: Trenes Section */}
        <div className="trenes-section">
          <button
            className="trenes-toggle"
            onClick={() => setShowTrenes(!showTrenes)}
          >
            <span className="trenes-icon">🚆</span>
            <span>Trenes</span>
            <span className="trenes-count">{trainReservations.length} reservas</span>
            <span className={`toggle-arrow ${showTrenes ? 'open' : ''}`}>›</span>
          </button>

          {showTrenes && (
            <div className="trenes-list">
              {trainReservations.map((train) => (
                <div key={train.id} className="train-card">
                  <div className="train-header">
                    <span className="train-operator">{train.operator}</span>
                    <span className="train-number">{train.trainNumber}</span>
                  </div>
                  <div className="train-route">
                    <span className="train-from">{train.from.split('(')[0].trim()}</span>
                    <span className="train-arrow">→</span>
                    <span className="train-to">{train.to.split('(')[0].trim()}</span>
                  </div>
                  <div className="train-details">
                    {train.date && <span className="train-date">{train.date}</span>}
                    {train.departure && <span className="train-time">{train.departure} → {train.arrival}</span>}
                    <span className="train-duration">{train.duration}</span>
                  </div>
                  <button
                    className="copy-code-btn"
                    onClick={() => copyToClipboard(train.code)}
                    title="Copiar código"
                  >
                    <span className="train-code">{train.code}</span>
                    <span className="copy-icon">📋</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="reservas-section">
          <button 
            className="reservas-toggle"
            onClick={() => setShowReservas(!showReservas)}
          >
            <span className="reservas-icon">📋</span>
            <span>Reservas</span>
            <span className="reservas-count">{pendingCount} pendientes</span>
            <span className={`toggle-arrow ${showReservas ? 'open' : ''}`}>›</span>
          </button>
          
          {showReservas && (
            <div className="reservas-list">
              {reservations.map((reserva) => (
                <div key={reserva.id} className="reserva-item reserva-item-editable">
                  <span className="reserva-name">{reserva.name}</span>
                  <span
                    className={`reserva-badge ${reserva.status}`}
                    onClick={() => toggleReservationStatus(reserva.id)}
                    title="Click para cambiar estado"
                  >
                    {reserva.status === 'confirmed' ? '✓ Confirmado' : '⏳ Pendiente'}
                  </span>
                  {reserva.status === 'confirmed' && reserva.code && (
                    <button
                      className="copy-code-btn compact"
                      onClick={(e) => { e.stopPropagation(); copyToClipboard(reserva.code!); }}
                      title="Copiar código"
                    >
                      <span className="reserva-code">{reserva.code}</span>
                      <span className="copy-icon">📋</span>
                    </button>
                  )}
                  {reserva.status === 'confirmed' && (
                    <input
                      className="reserva-code-input"
                      value={reserva.code || ''}
                      onChange={e => updateReservationCode(reserva.id, e.target.value)}
                      placeholder="Código"
                      onClick={e => e.stopPropagation()}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Feature 5: View Mode Toggle */}
        <div className="view-toggle-container">
          <button
            className={`view-toggle-btn ${viewMode === 'destino' ? 'active' : ''}`}
            onClick={() => setViewMode('destino')}
          >
            Por Destino
          </button>
          <button
            className={`view-toggle-btn ${viewMode === 'dia' ? 'active' : ''}`}
            onClick={() => setViewMode('dia')}
          >
            Por Dia
          </button>
        </div>

        {viewMode === 'destino' ? (
        <div className="itinerary-list">
          {groupedDestinations.map((group) => (
            <div key={group.country} className="country-group">
              <div className="country-header">
                <span className="country-flag">{countryFlags[group.country] || '🌍'}</span>
                <span className="country-name">{group.country}</span>
              </div>
              <div className="timeline">
                {group.destinations.map((dest, idx) => {
                  const nextDest = group.destinations[idx + 1];
                  const transport = nextDest ? getTransportBetween(dest.id, nextDest.id, destinations) : null;
                  const isToday = todayDestination?.id === dest.id;
                  
                  return (
                    <div key={dest.id} className="timeline-item" ref={isToday ? todayCardRef : undefined}>
                      <div className={`timeline-marker ${dest.nights === 0 ? 'excursion' : ''} ${isToday ? 'today' : ''}`}></div>
                      {transport && <div className="timeline-transport">{transport}</div>}
                      <div
                        className={`timeline-card ${selectedDestination?.id === dest.id ? 'active' : ''} ${isToday ? 'today' : ''}`}
                        onClick={() => handleItineraryClick(dest)}
                      >
                        <div className="timeline-card-header">
                          <div className="timeline-dates-row">
                            <span className="timeline-dates">{dest.dates}</span>
                            {isToday && <span className="hoy-badge">HOY</span>}
                          </div>
                          {dest.weather && (
                            <span className="weather-badge">
                              <span className="weather-icon">{weatherEmojis[dest.weather.condition]}</span>
                              {dest.weather.temp}
                            </span>
                          )}
                        </div>
                        <div className="timeline-name">{dest.name}</div>
                        {dest.nights > 0 && (
                          <div className="timeline-nights">{dest.nights} noches</div>
                        )}
                        <button 
                          className="timeline-details-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkerClick(dest);
                          }}
                        >
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        ) : (
        /* Feature 5: Day-by-Day View */
        <div className="itinerary-list day-view">
          {dayByDay.map((day) => {
            const isToday = (() => {
              const now = new Date();
              const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
              return day.date.getTime() === nowDate.getTime();
            })();

            return (
              <div
                key={day.dayNumber}
                className={`day-card ${isToday ? 'today' : ''}`}
                ref={isToday ? todayCardRef : undefined}
              >
                <div className="day-card-header">
                  <span className="day-number">Dia {day.dayNumber}</span>
                  <span className="day-date">{day.dateLabel}</span>
                  {isToday && <span className="hoy-badge">HOY</span>}
                </div>
                {day.destinations.length > 0 ? (
                  <div className="day-destinations">
                    {day.destinations.map((dest) => (
                      <div
                        key={dest.id}
                        className="day-dest-item"
                        onClick={() => handleItineraryClick(dest)}
                      >
                        <span className="day-dest-flag">{countryFlags[dest.country] || '🌍'}</span>
                        <span className="day-dest-name">{dest.name}</span>
                        {dest.nights > 0 && <span className="day-dest-nights">{dest.nights}n</span>}
                      </div>
                    ))}
                    {day.destinations[0]?.activities
                      .filter(a => a.date === day.dateLabel)
                      .map((act, i) => (
                        <div key={i} className="day-activity">{act.description}</div>
                      ))
                    }
                  </div>
                ) : (
                  <div className="day-empty">Dia de viaje</div>
                )}
              </div>
            );
          })}
        </div>
        )}

        <div className="legend">
          <h3>Leyenda</h3>
          <div className="legend-item">
            <span className="line flight"></span> Vuelo
          </div>
          <div className="legend-item">
            <span className="line train"></span> Tren
          </div>
          <div className="legend-item">
            <span className="line ferry"></span> Ferry
          </div>
          <div className="legend-item">
            <span className="line bus"></span> Bus/Taxi
          </div>
        </div>

        {isEdited && (
          <div style={{ padding: '0 16px 16px' }}>
            <button className="reset-btn" onClick={() => { if (confirm('¿Restaurar datos originales?')) resetAll(); }}>
              Restaurar datos originales
            </button>
          </div>
        )}
        </div>
      </div>

      {/* Feature 3: Toast notification */}
      {toastMessage && (
        <div className="toast-notification">{toastMessage}</div>
      )}

      {/* Feature 6: Mobile Quick Actions */}
      <div className="mobile-quick-actions">
        <button className="quick-action-btn" onClick={handleScrollToToday}>
          <svg className="quick-action-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
          </svg>
          <span>Hoy</span>
        </button>
        <button className={`quick-action-btn ${snapPoint === 'collapsed' ? 'active' : ''}`} onClick={handleCollapseSheet}>
          <svg className="quick-action-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 12h18M12 3v18"/>
          </svg>
          <span>Mapa</span>
        </button>
        <button className="quick-action-btn" onClick={handleShowNextTransport}>
          <svg className="quick-action-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
          </svg>
          <span>Siguiente</span>
        </button>
      </div>

      <div className="map-wrapper">
        <MapContainer
          center={[43.3, 7.5]}
          zoom={5}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          <FlyToDestination destination={flyTo} />
          <MapRefSetter mapRef={mapRef} />

          {routes.map((route: Route) => (
            <ArrowPolyline
              key={route.id}
              positions={route.coordinates}
              color={routeColors[route.type].color}
              dashArray={routeColors[route.type].dashArray}
              weight={4}
              opacity={0.9}
              label={route.label}
            />
          ))}

          {destinations.map((dest, idx) => (
            <Marker
              key={dest.id}
              position={dest.coordinates}
              icon={createIcon(dest, idx + 1, selectedDestination?.id === dest.id)}
              eventHandlers={{
                click: () => {
                  setSelectedDestination(dest);
                },
              }}
            >
              <Popup>{renderPopupContent(dest)}</Popup>
            </Marker>
          ))}
        </MapContainer>
        <div className="map-controls">
          <button 
            className="map-control-btn" 
            onClick={handleCenterMap}
            title="Centrar mapa"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </button>
          <button 
            className="map-control-btn" 
            onClick={handlePrevDestination}
            title="Destino anterior"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M16 5l-8 7 8 7V5z"/>
            </svg>
          </button>
          <button 
            className="map-control-btn" 
            onClick={handleNextDestination}
            title="Siguiente destino"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M8 5l8 7-8 7V5z"/>
            </svg>
          </button>
          <button 
            className={`map-control-btn ${showMapLegend ? 'active' : ''}`}
            onClick={() => setShowMapLegend(!showMapLegend)}
            title="Leyenda"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
              <text x="12" y="17" textAnchor="middle" fontSize="14" fontWeight="bold">i</text>
            </svg>
          </button>
        </div>
        {showMapLegend && (
          <div className="map-legend-overlay">
            <div className="legend-item"><span className="line flight"></span> Vuelo</div>
            <div className="legend-item"><span className="line train"></span> Tren</div>
            <div className="legend-item"><span className="line ferry"></span> Ferry</div>
            <div className="legend-item"><span className="line bus"></span> Bus/Taxi</div>
          </div>
        )}
      </div>

      {modalOpen && selectedDestination && (
        <DestinationModal
          destination={selectedDestination}
          onClose={() => setModalOpen(false)}
          onEdit={() => {
            setModalOpen(false);
            setEditModalOpen(true);
          }}
        />
      )}

      {editModalOpen && selectedDestination && (
        <EditDestinationModal
          destination={selectedDestination}
          onSave={(updated) => {
            updateDestination(updated);
            setSelectedDestination(updated);
          }}
          onClose={() => setEditModalOpen(false)}
        />
      )}

      {addFlightModalOpen && (
        <AddFlightModal
          existingGroups={flightGroups}
          onAddGroup={addFlightGroup}
          onAddFlight={addFlight}
          onClose={() => setAddFlightModalOpen(false)}
        />
      )}
    </div>
  );
}

export default Itinerario;
