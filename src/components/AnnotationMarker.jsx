export default function AnnotationMarker({
  annotation,
  annotations,
  isSelected,
  onSelect,
  onDelete,
  createMode,
}) {
  const index = annotations.findIndex((a) => a.id === annotation.id) + 1;
  const total = annotations.length;
  const style = {
    position: 'absolute',
    left: annotation.x,
    top: annotation.y,
    width: annotation.width,
    height: annotation.height,
    border: `2px solid ${annotation.color || '#3498db'}`,
    backgroundColor: isSelected
      ? `${annotation.color || '#3498db'}33`
      : `${annotation.color || '#3498db'}15`,
    cursor: createMode ? 'crosshair' : 'pointer',
    zIndex: isSelected ? 10 : 1,
    transition: 'background-color 0.15s ease',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    position: 'absolute',
    top: -20,
    left: 0,
    fontSize: 11,
    fontWeight: 600,
    color: '#fff',
    backgroundColor: annotation.color || '#3498db',
    padding: '1px 6px',
    borderRadius: '3px 3px 0 0',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    lineHeight: '16px',
  };

  return (
    <div
      className="annotation-marker"
      style={style}
      title={`${index} of ${total}`}
      onClick={(e) => {
        e.stopPropagation();
        if (!createMode) {
          onSelect(annotation.id);
        }
      }}
    >
      <span style={labelStyle}>{annotation.label}</span>
      {isSelected && (
        <button
          className="delete-annotation-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(annotation.id);
          }}
          style={{
            position: 'absolute',
            top: -20,
            right: 0,
            background: '#e74c3c',
            color: '#fff',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: 11,
            padding: '1px 5px',
            lineHeight: '16px',
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}
