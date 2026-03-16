import { useState } from 'react';
import { Destination } from './destinations/types';
import './modal.css';

interface DestinationModalProps {
  destination: Destination;
  onClose: () => void;
  onEdit?: () => void;
}

type TabType = 'historia' | 'quever' | 'transporte';

function DestinationModal({ destination, onClose, onEdit }: DestinationModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('historia');

  const poiTypeLabels: Record<string, string> = {
    landmark: 'Lugar emblemático',
    museum: 'Museo',
    restaurant: 'Restaurante',
    beach: 'Playa',
    viewpoint: 'Mirador',
    church: 'Iglesia',
    neighborhood: 'Barrio',
  };

  const transportTypeLabels: Record<string, string> = {
    flight: 'Vuelo',
    train: 'Tren',
    ferry: 'Ferry',
    bus: 'Bus',
    taxi: 'Taxi',
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <h2>{destination.name}</h2>
          <div className="modal-meta">
            <span className="meta-country">{destination.country}</span>
            <span className="meta-dates">{destination.dates}</span>
            {destination.nights > 0 && (
              <span className="meta-nights">{destination.nights} noches</span>
            )}
            {onEdit && <button className="edit-btn-inline" onClick={onEdit}>Editar</button>}
          </div>
        </div>

        <div className="modal-tabs">
          <button
            className={`tab ${activeTab === 'historia' ? 'active' : ''}`}
            onClick={() => setActiveTab('historia')}
          >
            Historia
          </button>
          <button
            className={`tab ${activeTab === 'quever' ? 'active' : ''}`}
            onClick={() => setActiveTab('quever')}
          >
            Qué Ver
          </button>
          <button
            className={`tab ${activeTab === 'transporte' ? 'active' : ''}`}
            onClick={() => setActiveTab('transporte')}
          >
            Cómo Llegar
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'historia' && (
            <div className="tab-content">
              <div className="history-text">
                {destination.history.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
              
              {destination.highlights && destination.highlights.length > 0 && (
                <div className="highlights">
                  <h3>Destacados</h3>
                  <ul>
                    {destination.highlights.map((highlight, i) => (
                      <li key={i}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              )}

              {destination.tips && destination.tips.length > 0 && (
                <div className="tips">
                  <h3>Tips</h3>
                  <ul>
                    {destination.tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'quever' && (
            <div className="tab-content">
              <div className="poi-grid">
                {destination.pointsOfInterest.map((poi, i) => (
                  <div key={i} className="poi-card">
                    <div className="poi-header">
                      <h4>{poi.name}</h4>
                      <span className="poi-type">{poiTypeLabels[poi.type] || poi.type}</span>
                    </div>
                    <p className="poi-description">{poi.description}</p>
                    {poi.tip && (
                      <div className="poi-tip">
                        <strong>Tip:</strong> {poi.tip}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'transporte' && (
            <div className="tab-content">
              {destination.transports && destination.transports.length > 0 ? (
                <div className="transport-list">
                  {destination.transports.map((transport, i) => (
                    <div key={i} className={`transport-card transport-${transport.type}`}>
                      <div className="transport-header">
                        <span className="transport-type">
                          {transportTypeLabels[transport.type]}
                        </span>
                        <span className="transport-route">
                          {transport.from} → {transport.to}
                        </span>
                      </div>
                      <div className="transport-details">
                        <div className="detail">
                          <span className="label">Duración:</span>
                          <span className="value">{transport.duration}</span>
                        </div>
                        {transport.price && (
                          <div className="detail">
                            <span className="label">Precio:</span>
                            <span className="value">{transport.price}</span>
                          </div>
                        )}
                      </div>
                      {transport.notes && (
                        <p className="transport-notes">{transport.notes}</p>
                      )}
                      {transport.link && (
                        <a
                          href={transport.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transport-link"
                        >
                          Reservar / Ver horarios →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-transport">
                  Este es un destino de excursión. Ver transporte en el destino base.
                </p>
              )}

              {destination.activities && destination.activities.length > 0 && (
                <div className="activities">
                  <h3>Actividades planificadas</h3>
                  {destination.activities.map((activity, i) => (
                    <div key={i} className="activity-item">
                      <span className="activity-date">{activity.date}</span>
                      <span className="activity-desc">{activity.description}</span>
                      {activity.isBase && <span className="activity-base">Base</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DestinationModal;
