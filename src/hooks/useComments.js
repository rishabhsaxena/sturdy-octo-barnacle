import { useState, useEffect, useCallback } from 'react';
import allComments from '../data/mockComments.json';

export function useComments(annotationId, history) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!annotationId) return;

    Promise.resolve().then(() => setLoading(true));

    // Simulate API fetch with timeout
    const timer = setTimeout(() => {
      const fetched = allComments[annotationId] || [];
      setComments(fetched);
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [annotationId]);

  const addComment = useCallback((text, isHistoryAction = false) => {
    const newComment = {
      id: `c-${Date.now()}`,
      author: 'You',
      text,
      timestamp: new Date().toISOString(),
    };
    
    setComments((prev) => [...prev, newComment]);

    if (!isHistoryAction && history) {
      history.record({
        undo: () => setComments((prev) => prev.filter(c => c.id !== newComment.id)),
        redo: () => setComments((prev) => [...prev, newComment]),
      });
    }
  }, [history]);

  return { comments, loading, addComment };
}
