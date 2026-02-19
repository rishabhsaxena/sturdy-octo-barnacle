import { useState, useRef, useEffect, useCallback } from 'react';
import AnnotationLayer from './AnnotationLayer';
import CommentsPanel from './CommentsPanel';
import Toolbar from './Toolbar';
import FilterBar from './FilterBar';
import sampleDocument from '../data/sampleDocument2.png';
import initialAnnotations from '../data/mockAnnotations.json';

const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export default function DocumentViewer() {
  const containerRef = useRef(null);

  // --- Annotation state (inlined from useAnnotations) ---
  const [annotations, setAnnotations] = useState(initialAnnotations);

  const addAnnotation = useCallback((annotation) => {
    setAnnotations((prev) => [...prev, annotation]);
  }, []);

  const updateAnnotation = useCallback((id, updates) => {
    setAnnotations((prev) =>
      prev.map((ann) => (ann.id === id ? { ...ann, ...updates } : ann))
    );
  }, []);

  const deleteAnnotation = useCallback((id) => {
    setAnnotations((prev) => prev.filter((ann) => ann.id !== id));
  }, []);

  // --- Zoom state (received from Toolbar via callback) ---
  const [zoom, setZoom] = useState(1);

  const handleZoomChange = useCallback((newZoom) => {
    setZoom(newZoom);
  }, []);

  // --- Selection & mode state ---
  const [selectedAnnotationId, setSelectedAnnotationId] = useState(null);
  const [createMode, setCreateMode] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);

  const selectedAnnotation = selectedAnnotationId
    ? annotations.find((a) => a.id === selectedAnnotationId)
    : null;

  // --- Filtering ---
  const filteredAnnotations = activeFilter
    ? annotations.filter((ann) => ann.label === activeFilter)
    : annotations;

  // --- Keyboard shortcuts ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (createMode) {
          setCreateMode(false);
        }
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedAnnotationId && !e.target.closest('input, textarea')) {
          deleteAnnotation(selectedAnnotationId);
          setSelectedAnnotationId(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [createMode, selectedAnnotationId, deleteAnnotation]);

  // --- Annotation creation ---
  const handleCreateAnnotation = (e) => {
    if (!createMode) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    const newAnnotation = {
      id: `ann-${annotations.length + 1}`,
      label: 'New Annotation',
      x: x - 60,
      y: y - 15,
      width: 120,
      height: 30,
      color: '#e74c3c',
    };

    addAnnotation(newAnnotation);
    setSelectedAnnotationId(newAnnotation.id);
  };

  const handleSelect = (id) => {
    setSelectedAnnotationId(id);
  };

  const handleDelete = (id) => {
    deleteAnnotation(id);
    if (selectedAnnotationId === id) {
      setSelectedAnnotationId(null);
    }
  };

  const handleFilterChange = (label) => {
    setActiveFilter(label);
    setSelectedAnnotationId(null);
  };

  const handleToggleCreateMode = () => {
    setCreateMode((prev) => !prev);
  };

  return (
    <div className="document-viewer">
      <Toolbar
        onZoomChange={handleZoomChange}
        createMode={createMode}
        onToggleCreateMode={handleToggleCreateMode}
      />

      <FilterBar
        annotations={annotations}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      <div className="viewer-content">
        <div className="document-container">
          <div
            className="document-wrapper"
            ref={containerRef}
            style={{
              position: 'relative',
              display: 'inline-block',
              width: 800 * zoom,
              cursor: createMode ? 'crosshair' : 'default',
            }}
          >
            <img
              src={sampleDocument}
              alt="Document"
              className="document-image"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
              draggable={false}
            />

            <AnnotationLayer
              annotations={filteredAnnotations}
              selectedId={selectedAnnotationId}
              onSelect={handleSelect}
              onDelete={handleDelete}
              createMode={createMode}
              containerRef={containerRef}
              onCreateAnnotation={handleCreateAnnotation}
              zoom={zoom}
            />
          </div>
        </div>

        <CommentsPanel
          selectedAnnotation={selectedAnnotation}
        />
      </div>
    </div>
  );
}
