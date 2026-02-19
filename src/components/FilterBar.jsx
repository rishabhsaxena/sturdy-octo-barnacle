import { useState, useEffect } from 'react';

export default function FilterBar({ annotations, activeFilter, onFilterChange }) {
  const [labelCounts, setLabelCounts] = useState({});
  const [filteredCount, setFilteredCount] = useState(0);

  // Sync label counts when annotations change
  useEffect(() => {
    const counts = {};
    annotations.forEach((ann) => {
      counts[ann.label] = (counts[ann.label] || 0) + 1;
    });
    setLabelCounts(counts);
  }, [annotations]);

  // Sync filtered count when filter or annotations change
  useEffect(() => {
    if (activeFilter) {
      setFilteredCount(
        annotations.filter((ann) => ann.label === activeFilter).length
      );
    } else {
      setFilteredCount(annotations.length);
    }
  }, [annotations, activeFilter]);

  const labels = Object.keys(labelCounts);

  return (
    <div className="filter-bar">
      <span className="filter-label">Filter:</span>
      <button
        className={`filter-btn ${activeFilter === null ? 'active' : ''}`}
        onClick={() => onFilterChange(null)}
      >
        All ({annotations.length})
      </button>
      {labels.map((label) => (
        <button
          key={label}
          className={`filter-btn ${activeFilter === label ? 'active' : ''}`}
          onClick={() => onFilterChange(label)}
        >
          {label} ({labelCounts[label]})
        </button>
      ))}
      <span className="filter-summary">
        Showing {filteredCount} of {annotations.length}
      </span>
    </div>
  );
}
