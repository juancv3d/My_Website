import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { routes, flights } from './destinations';
import { Destination, Route } from './destinations/types';
import DestinationModal from './DestinationModal';
import EditDestinationModal from './EditDestinationModal';
import { useEditableItinerary } from './useEditableItinerary';
import './styles.css';

const TRIP_START = new Date('2026-04-23');
const TRIP_END = new Date('2026-05-07');
const TRIP_DAYS = 15;

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
  const [flyTo, setFlyTo] = useState<Destination | null>(null);
  const [showFlights, setShowFlights] = useState(false);
  const [showReservas, setShowReservas] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const {
    destinations,
    reservations,
    isEdited,
    updateDestination,
    toggleReservationStatus,
    updateReservationCode,
    resetAll,
  } = useEditableItinerary();

  const countdown = getCountdownInfo();
  const pendingCount = reservations.filter(r => r.status === 'pending').length;

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

  return (
    <div className="itinerario-container">
      <div className={`itinerario-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div 
          className="sidebar-drag-handle"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
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

        <div className="flights-section">
          <button 
            className="flights-toggle"
            onClick={() => setShowFlights(!showFlights)}
          >
            <span className="flights-icon">✈️</span>
            <span>Vuelos KLM</span>
            <span className="flights-code">ZIFHKS</span>
            <span className={`toggle-arrow ${showFlights ? 'open' : ''}`}>›</span>
          </button>
          
          {showFlights && (
            <div className="flights-list">
              {flights.map((flight) => (
                <div key={flight.id} className={`flight-card ${flight.isReturn ? 'return' : 'outbound'}`}>
                  <div className="flight-header">
                    <span className="flight-number">{flight.flightNumber}</span>
                    <span className="flight-duration">{flight.duration}</span>
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
                  
                  return (
                    <div key={dest.id} className="timeline-item">
                      <div className={`timeline-marker ${dest.nights === 0 ? 'excursion' : ''}`}></div>
                      {transport && <div className="timeline-transport">{transport}</div>}
                      <div
                        className={`timeline-card ${selectedDestination?.id === dest.id ? 'active' : ''}`}
                        onClick={() => handleItineraryClick(dest)}
                      >
                        <div className="timeline-card-header">
                          <span className="timeline-dates">{dest.dates}</span>
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

      <div className="map-wrapper">
        <MapContainer
          center={[43.3, 7.5]}
          zoom={5}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
          />

          <FlyToDestination destination={flyTo} />

          <div className="routes-container">
            {routes.map((route: Route) => (
              <Polyline
                key={route.id}
                positions={route.coordinates}
                pathOptions={{
                  color: routeColors[route.type].color,
                  dashArray: routeColors[route.type].dashArray,
                  weight: 4,
                  opacity: 0.9,
                }}
              >
                <Popup>{route.label}</Popup>
              </Polyline>
            ))}
          </div>

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
    </div>
  );
}

export default Itinerario;
