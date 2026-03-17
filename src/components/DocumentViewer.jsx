import { useState, useRef, useEffect, useCallback, useReducer } from "react";
import AnnotationLayer from "./AnnotationLayer";
import CommentsPanel from "./CommentsPanel";
import Toolbar from "./Toolbar";
import FilterBar from "./FilterBar";
import { useHistory } from "../hooks/useHistory";
import sampleDocument from "../data/sampleDocument2.png";
import initialAnnotations from "../data/mockAnnotations.json";

const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const annotationReducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return [...state, action.payload];
    case "UPDATE":
      return state.map((ann) =>
        ann.id === action.id ? { ...ann, ...action.updates } : ann,
      );
    case "DELETE":
      return state.filter((ann) => ann.id !== action.id);
    case "SET":
      return action.payload;
    default:
      return state;
  }
};

export default function DocumentViewer() {
  const containerRef = useRef(null);

  // --- Annotation state ---
  const [annotations, dispatch] = useReducer(
    annotationReducer,
    initialAnnotations,
  );
  const history = useHistory();

  const addAnnotation = useCallback(
    (annotation, isHistoryAction = false) => {
      dispatch({ type: "ADD", payload: annotation });

      if (!isHistoryAction) {
        history.record({
          undo: () => dispatch({ type: "DELETE", id: annotation.id }),
          redo: () => dispatch({ type: "ADD", payload: annotation }),
        });
      }
    },
    [history],
  );

  const updateAnnotation = useCallback(
    (id, updates, isHistoryAction = false) => {
      let prevAnnotation = annotations.find((a) => a.id === id);

      if (!isHistoryAction && prevAnnotation) {
        const nextAnnotation = { ...prevAnnotation, ...updates };
        history.record({
          undo: () => dispatch({ type: "UPDATE", id, updates: prevAnnotation }),
          redo: () => dispatch({ type: "UPDATE", id, updates: nextAnnotation }),
        });
      }

      dispatch({ type: "UPDATE", id, updates });
    },
    [history, annotations],
  );

  const deleteAnnotation = useCallback(
    (id, isHistoryAction = false) => {
      const deletedAnnotation = annotations.find((a) => a.id === id);

      if (!isHistoryAction && deletedAnnotation) {
        history.record({
          undo: () => dispatch({ type: "ADD", payload: deletedAnnotation }),
          redo: () => dispatch({ type: "DELETE", id }),
        });
      }

      dispatch({ type: "DELETE", id });
    },
    [history, annotations],
  );

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
      if (e.key === "Escape") {
        if (createMode) {
          setCreateMode(false);
        }
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedAnnotationId && !e.target.closest("input, textarea")) {
          deleteAnnotation(selectedAnnotationId);
          setSelectedAnnotationId(null);
        }
      }

      // Undo/Redo shortcuts
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdKey = isMac ? e.metaKey : e.ctrlKey;

      if (cmdKey && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          history.redo();
        } else {
          history.undo();
        }
        e.preventDefault();
      } else if (cmdKey && e.key.toLowerCase() === 'y') {
        history.redo();
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [createMode, selectedAnnotationId, deleteAnnotation, history]);

  // --- Annotation creation ---
  const handleCreateAnnotation = (e) => {
    if (!createMode) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    const newAnnotation = {
      id: `ann-${annotations.length + 1}`,
      label: "New Annotation",
      x: x - 60,
      y: y - 15,
      width: 120,
      height: 30,
      color: "#e74c3c",
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
        undo={history.undo}
        redo={history.redo}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
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
              position: "relative",
              display: "inline-block",
              width: 800 * zoom,
              cursor: createMode ? "crosshair" : "default",
            }}
          >
            <img
              src={sampleDocument}
              alt="Document"
              className="document-image"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                userSelect: "none",
                pointerEvents: "none",
              }}
              draggable={false}
            />

            <AnnotationLayer
              annotations={filteredAnnotations}
              selectedId={selectedAnnotationId}
              onSelect={handleSelect}
              onDelete={handleDelete}
              onUpdate={updateAnnotation}
              createMode={createMode}
              containerRef={containerRef}
              onCreateAnnotation={handleCreateAnnotation}
              zoom={zoom}
            />
          </div>
        </div>

        <CommentsPanel selectedAnnotation={selectedAnnotation} />
      </div>
    </div>
  );
}

//
