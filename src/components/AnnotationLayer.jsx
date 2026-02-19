import { useState, useEffect } from 'react';
import AnnotationMarker from './AnnotationMarker';

export default function AnnotationLayer({
  annotations,
  selectedId,
  onSelect,
  onDelete,
  createMode,
  containerRef,
  onCreateAnnotation,
  zoom,
}) {
  // Build annotation lookup map
  const [annotationMap, setAnnotationMap] = useState({});

  useEffect(() => {
    const map = {};
    annotations.forEach((ann) => {
      map[ann.id] = ann;
    });
    setAnnotationMap(map);
  }, [annotations]);

  // Handle Escape to deselect annotation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedId) {
        onSelect(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, onSelect]);

  const handleLayerClick = (e) => {
    if (createMode) {
      onCreateAnnotation(e);
      return;
    }

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = (e.clientX - rect.left) / zoom;
    const clickY = (e.clientY - rect.top) / zoom;

    const clicked = annotations.find(
      (ann) =>
        clickX >= ann.x &&
        clickX <= ann.x + ann.width &&
        clickY >= ann.y &&
        clickY <= ann.y + ann.height
    );

    if (clicked) {
      onSelect(clicked.id);
    } else {
      onSelect(null);
    }
  };

  return (
    <div
      className="annotation-layer"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
      onClick={handleLayerClick}
      data-annotation-count={Object.keys(annotationMap).length}
    >
      {annotations.map((annotation) => (
        <AnnotationMarker
          key={annotation.id}
          annotation={annotation}
          annotations={annotations}
          isSelected={annotation.id === selectedId}
          onSelect={onSelect}
          onDelete={onDelete}
          createMode={createMode}
        />
      ))}
    </div>
  );
}
