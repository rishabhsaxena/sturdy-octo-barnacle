import { useState, useEffect } from 'react';
import allComments from '../data/mockComments.json';

export function useComments(annotationId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!annotationId) return;

    setLoading(true);

    // Simulate API fetch with timeout
    const timer = setTimeout(() => {
      const fetched = allComments[annotationId] || [];
      setComments(fetched);
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [annotationId, comments]);

  const addComment = (text) => {
    const newComment = {
      id: `c-${Date.now()}`,
      author: 'You',
      text,
      timestamp: new Date().toISOString(),
    };
    setComments((prev) => [...prev, newComment]);
  };

  return { comments, loading, addComment };
}
