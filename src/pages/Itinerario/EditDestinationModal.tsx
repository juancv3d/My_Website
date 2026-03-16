import { useState } from 'react';
import { Destination, DayActivity } from './destinations/types';
import './modal.css';

interface EditDestinationModalProps {
  destination: Destination;
  onSave: (updated: Destination) => void;
  onClose: () => void;
}

function EditDestinationModal({ destination, onSave, onClose }: EditDestinationModalProps) {
  const [dates, setDates] = useState(destination.dates);
  const [nights, setNights] = useState(destination.nights);
  const [highlights, setHighlights] = useState([...destination.highlights]);
  const [tips, setTips] = useState([...(destination.tips || [])]);
  const [activities, setActivities] = useState<DayActivity[]>(
    destination.activities.map(a => ({ ...a }))
  );

  const handleSave = () => {
    onSave({
      ...destination,
      dates,
      nights,
      highlights: highlights.filter(h => h.trim()),
      tips: tips.filter(t => t.trim()),
      activities,
    });
    onClose();
  };

  const updateListItem = (
    list: string[],
    setter: (v: string[]) => void,
    index: number,
    value: string
  ) => {
    const next = [...list];
    next[index] = value;
    setter(next);
  };

  const removeListItem = (list: string[], setter: (v: string[]) => void, index: number) => {
    setter(list.filter((_, i) => i !== index));
  };

  const addListItem = (list: string[], setter: (v: string[]) => void) => {
    setter([...list, '']);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content edit-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="modal-header">
          <h2>Editar {destination.name}</h2>
          <div className="modal-meta">
            <span className="meta-country">{destination.country}</span>
          </div>
        </div>

        <div className="modal-body edit-body">
          <div className="edit-section">
            <label className="edit-label">Fechas</label>
            <input
              className="edit-input"
              value={dates}
              onChange={e => setDates(e.target.value)}
              placeholder="ej: 25-29 abr"
            />
          </div>

          <div className="edit-section">
            <label className="edit-label">Noches</label>
            <input
              className="edit-input edit-input-small"
              type="number"
              min={0}
              value={nights}
              onChange={e => setNights(parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="edit-section">
            <label className="edit-label">Destacados</label>
            {highlights.map((h, i) => (
              <div key={i} className="edit-list-row">
                <input
                  className="edit-input"
                  value={h}
                  onChange={e => updateListItem(highlights, setHighlights, i, e.target.value)}
                />
                <button className="edit-remove-btn" onClick={() => removeListItem(highlights, setHighlights, i)}>×</button>
              </div>
            ))}
            <button className="edit-add-btn" onClick={() => addListItem(highlights, setHighlights)}>+ Agregar</button>
          </div>

          <div className="edit-section">
            <label className="edit-label">Tips</label>
            {tips.map((t, i) => (
              <div key={i} className="edit-list-row">
                <input
                  className="edit-input"
                  value={t}
                  onChange={e => updateListItem(tips, setTips, i, e.target.value)}
                />
                <button className="edit-remove-btn" onClick={() => removeListItem(tips, setTips, i)}>×</button>
              </div>
            ))}
            <button className="edit-add-btn" onClick={() => addListItem(tips, setTips)}>+ Agregar</button>
          </div>

          <div className="edit-section">
            <label className="edit-label">Actividades</label>
            {activities.map((a, i) => (
              <div key={i} className="edit-activity-row">
                <input
                  className="edit-input edit-input-small"
                  value={a.date}
                  onChange={e => {
                    const next = [...activities];
                    next[i] = { ...next[i], date: e.target.value };
                    setActivities(next);
                  }}
                  placeholder="Fecha"
                />
                <input
                  className="edit-input"
                  value={a.description}
                  onChange={e => {
                    const next = [...activities];
                    next[i] = { ...next[i], description: e.target.value };
                    setActivities(next);
                  }}
                  placeholder="Descripción"
                />
                <button className="edit-remove-btn" onClick={() => setActivities(activities.filter((_, j) => j !== i))}>×</button>
              </div>
            ))}
            <button
              className="edit-add-btn"
              onClick={() => setActivities([...activities, { date: '', description: '' }])}
            >+ Agregar actividad</button>
          </div>

          <div className="edit-actions">
            <button className="edit-cancel-btn" onClick={onClose}>Cancelar</button>
            <button className="edit-save-btn" onClick={handleSave}>Guardar cambios</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditDestinationModal;
