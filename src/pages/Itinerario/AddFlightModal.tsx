import { useState } from 'react';
import { FlightGroup, Flight } from './destinations/types';
import './modal.css';

interface AddFlightModalProps {
  onAddGroup: (group: Omit<FlightGroup, 'id'>) => void;
  onAddFlight: (groupId: string, flight: Omit<Flight, 'id'>) => void;
  existingGroups: FlightGroup[];
  onClose: () => void;
}

type ModalMode = 'select' | 'new-group' | 'new-flight';

function AddFlightModal({ onAddGroup, onAddFlight, existingGroups, onClose }: AddFlightModalProps) {
  const [mode, setMode] = useState<ModalMode>('select');
  const [selectedGroupId, setSelectedGroupId] = useState<string>(existingGroups[0]?.id || '');

  const [groupName, setGroupName] = useState('');
  const [airline, setAirline] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');

  const [flightNumber, setFlightNumber] = useState('');
  const [fromCity, setFromCity] = useState('');
  const [fromCode, setFromCode] = useState('');
  const [toCity, setToCity] = useState('');
  const [toCode, setToCode] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [duration, setDuration] = useState('');
  const [isReturn, setIsReturn] = useState(false);

  const handleAddGroup = () => {
    if (!groupName.trim() || !airline.trim() || !confirmationCode.trim()) return;
    onAddGroup({
      name: groupName,
      airline,
      confirmationCode,
      flights: [],
    });
    onClose();
  };

  const handleAddFlight = () => {
    if (!flightNumber.trim() || !fromCity.trim() || !fromCode.trim() || !toCity.trim() || !toCode.trim()) return;
    const targetGroupId = mode === 'new-group' ? '' : selectedGroupId;
    
    const group = existingGroups.find(g => g.id === targetGroupId);
    
    onAddFlight(targetGroupId, {
      flightNumber,
      airline: group?.airline || airline,
      confirmationCode: group?.confirmationCode || confirmationCode,
      from: {
        city: fromCity,
        code: fromCode.toUpperCase(),
        coordinates: [0, 0],
      },
      to: {
        city: toCity,
        code: toCode.toUpperCase(),
        coordinates: [0, 0],
      },
      departure: {
        date: departureDate,
        time: departureTime,
      },
      arrival: {
        date: arrivalDate,
        time: arrivalTime,
      },
      duration,
      isReturn,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content edit-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="modal-header">
          <h2>
            {mode === 'select' && 'Agregar vuelo'}
            {mode === 'new-group' && 'Nueva reserva de vuelos'}
            {mode === 'new-flight' && 'Agregar vuelo a reserva'}
          </h2>
        </div>

        <div className="modal-body edit-body">
          {mode === 'select' && (
            <>
              <div className="flight-modal-options">
                <button 
                  className="flight-modal-option"
                  onClick={() => setMode('new-group')}
                >
                  <span className="option-icon">📋</span>
                  <span className="option-title">Nueva reserva</span>
                  <span className="option-desc">Crear grupo de vuelos con nuevo código</span>
                </button>
                {existingGroups.length > 0 && (
                  <button 
                    className="flight-modal-option"
                    onClick={() => setMode('new-flight')}
                  >
                    <span className="option-icon">✈️</span>
                    <span className="option-title">Agregar a reserva existente</span>
                    <span className="option-desc">Agregar vuelo a {existingGroups[0].name}</span>
                  </button>
                )}
              </div>
            </>
          )}

          {mode === 'new-group' && (
            <>
              <button className="back-btn" onClick={() => setMode('select')}>← Volver</button>
              
              <div className="edit-section">
                <label className="edit-label">Nombre de la reserva</label>
                <input
                  className="edit-input"
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  placeholder="ej: Vuelos Vueling"
                />
              </div>

              <div className="edit-row">
                <div className="edit-section" style={{ flex: 1 }}>
                  <label className="edit-label">Aerolínea</label>
                  <input
                    className="edit-input"
                    value={airline}
                    onChange={e => setAirline(e.target.value)}
                    placeholder="ej: Vueling"
                  />
                </div>
                <div className="edit-section" style={{ flex: 1 }}>
                  <label className="edit-label">Código confirmación</label>
                  <input
                    className="edit-input"
                    value={confirmationCode}
                    onChange={e => setConfirmationCode(e.target.value.toUpperCase())}
                    placeholder="ej: ABC123"
                  />
                </div>
              </div>

              <div className="edit-actions">
                <button className="edit-cancel-btn" onClick={onClose}>Cancelar</button>
                <button 
                  className="edit-save-btn" 
                  onClick={handleAddGroup}
                  disabled={!groupName.trim() || !airline.trim() || !confirmationCode.trim()}
                >
                  Crear reserva
                </button>
              </div>
            </>
          )}

          {mode === 'new-flight' && (
            <>
              <button className="back-btn" onClick={() => setMode('select')}>← Volver</button>

              {existingGroups.length > 1 && (
                <div className="edit-section">
                  <label className="edit-label">Reserva</label>
                  <select
                    className="edit-input"
                    value={selectedGroupId}
                    onChange={e => setSelectedGroupId(e.target.value)}
                  >
                    {existingGroups.map(g => (
                      <option key={g.id} value={g.id}>
                        {g.name} · {g.confirmationCode}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="edit-section">
                <label className="edit-label">Número de vuelo</label>
                <input
                  className="edit-input edit-input-small"
                  value={flightNumber}
                  onChange={e => setFlightNumber(e.target.value.toUpperCase())}
                  placeholder="ej: VY1234"
                />
              </div>

              <div className="flight-route-inputs">
                <div className="route-column">
                  <label className="edit-label">Origen</label>
                  <div className="edit-row">
                    <input
                      className="edit-input"
                      value={fromCity}
                      onChange={e => setFromCity(e.target.value)}
                      placeholder="Ciudad"
                    />
                    <input
                      className="edit-input edit-input-small"
                      value={fromCode}
                      onChange={e => setFromCode(e.target.value.toUpperCase())}
                      placeholder="NZA"
                      maxLength={3}
                    />
                  </div>
                </div>
                <div className="route-arrow">→</div>
                <div className="route-column">
                  <label className="edit-label">Destino</label>
                  <div className="edit-row">
                    <input
                      className="edit-input"
                      value={toCity}
                      onChange={e => setToCity(e.target.value)}
                      placeholder="Ciudad"
                    />
                    <input
                      className="edit-input edit-input-small"
                      value={toCode}
                      onChange={e => setToCode(e.target.value.toUpperCase())}
                      placeholder="BCN"
                      maxLength={3}
                    />
                  </div>
                </div>
              </div>

              <div className="edit-row">
                <div className="edit-section" style={{ flex: 1 }}>
                  <label className="edit-label">Salida</label>
                  <input
                    className="edit-input"
                    value={departureDate}
                    onChange={e => setDepartureDate(e.target.value)}
                    placeholder="Lun 3 may"
                  />
                  <input
                    className="edit-input"
                    value={departureTime}
                    onChange={e => setDepartureTime(e.target.value)}
                    placeholder="10:30 AM"
                    style={{ marginTop: 8 }}
                  />
                </div>
                <div className="edit-section" style={{ flex: 1 }}>
                  <label className="edit-label">Llegada</label>
                  <input
                    className="edit-input"
                    value={arrivalDate}
                    onChange={e => setArrivalDate(e.target.value)}
                    placeholder="Lun 3 may"
                  />
                  <input
                    className="edit-input"
                    value={arrivalTime}
                    onChange={e => setArrivalTime(e.target.value)}
                    placeholder="12:00 PM"
                    style={{ marginTop: 8 }}
                  />
                </div>
              </div>

              <div className="edit-row">
                <div className="edit-section">
                  <label className="edit-label">Duración</label>
                  <input
                    className="edit-input edit-input-small"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    placeholder="1h 30m"
                  />
                </div>
                <div className="edit-section">
                  <label className="edit-label checkbox-label">
                    <input
                      type="checkbox"
                      checked={isReturn}
                      onChange={e => setIsReturn(e.target.checked)}
                    />
                    Vuelo de regreso
                  </label>
                </div>
              </div>

              <div className="edit-actions">
                <button className="edit-cancel-btn" onClick={onClose}>Cancelar</button>
                <button 
                  className="edit-save-btn" 
                  onClick={handleAddFlight}
                  disabled={!flightNumber.trim() || !fromCity.trim() || !fromCode.trim() || !toCity.trim() || !toCode.trim()}
                >
                  Agregar vuelo
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddFlightModal;
