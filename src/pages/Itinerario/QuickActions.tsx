import { useState } from 'react';
import './QuickActions.css';

interface QuickActionsProps {
  onCenterMap: () => void;
  onNextDestination: () => void;
}

function QuickActions({ onCenterMap, onNextDestination }: QuickActionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`quick-actions ${isExpanded ? 'expanded' : ''}`}>
      {isExpanded && (
        <div className="quick-actions-menu">
          <button
            className="quick-action-btn"
            onClick={() => {
              onCenterMap();
              setIsExpanded(false);
            }}
            title="Centrar mapa"
          >
            <span className="quick-action-icon">🎯</span>
            <span className="quick-action-label">Centrar</span>
          </button>
          <button
            className="quick-action-btn"
            onClick={() => {
              onNextDestination();
              setIsExpanded(false);
            }}
            title="Siguiente destino"
          >
            <span className="quick-action-icon">➡️</span>
            <span className="quick-action-label">Siguiente</span>
          </button>
        </div>
      )}
      <button
        className="quick-actions-fab"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={isExpanded ? 'Cerrar menú' : 'Abrir menú rápido'}
      >
        <span className={`fab-icon ${isExpanded ? 'rotated' : ''}`}>+</span>
      </button>
    </div>
  );
}

export default QuickActions;
