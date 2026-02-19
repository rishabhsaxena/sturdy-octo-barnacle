import { useState, useEffect, useCallback } from 'react';

const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2];

function useZoom(onZoomChange) {
  const [zoomIndex, setZoomIndex] = useState(2); // default 1x
  const zoom = ZOOM_LEVELS[zoomIndex];
  const canZoomIn = zoomIndex < ZOOM_LEVELS.length - 1;
  const canZoomOut = zoomIndex > 0;

  const handleZoomIn = useCallback(() => {
    setZoomIndex((prev) => Math.min(prev + 1, ZOOM_LEVELS.length - 1));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoomIndex(2);
  }, []);

  // Report zoom changes up to parent
  useEffect(() => {
    onZoomChange(zoom);
  }, [zoom, onZoomChange]);

  return { zoom, canZoomIn, canZoomOut, handleZoomIn, handleZoomOut, handleResetZoom };
}

export default function Toolbar({
  onZoomChange,
  createMode,
  onToggleCreateMode,
}) {
  const { zoom, canZoomIn, canZoomOut, handleZoomIn, handleZoomOut, handleResetZoom } =
    useZoom(onZoomChange);

  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <button
          className="toolbar-btn"
          onClick={handleZoomOut}
          disabled={!canZoomOut}
          title="Zoom Out"
        >
          −
        </button>
        <span className="zoom-level">{Math.round(zoom * 100)}%</span>
        <button
          className="toolbar-btn"
          onClick={handleZoomIn}
          disabled={!canZoomIn}
          title="Zoom In"
        >
          +
        </button>
        <button className="toolbar-btn" onClick={handleResetZoom} title="Reset Zoom">
          Reset
        </button>
      </div>

      <div className="toolbar-group">
        <button
          className={`toolbar-btn create-mode-btn ${createMode ? 'active' : ''}`}
          onClick={onToggleCreateMode}
          title={createMode ? 'Exit Create Mode' : 'Enter Create Mode'}
        >
          {createMode ? '✕ Cancel' : '+ New Annotation'}
        </button>
      </div>
    </div>
  );
}
