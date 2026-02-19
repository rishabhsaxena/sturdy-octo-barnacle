import { useEffect } from 'react';
import { useComments } from '../hooks/useComments';
import CommentThread from './CommentThread';

export default function CommentsPanel({
  selectedAnnotation,
}) {
  const { comments, loading, addComment } = useComments(selectedAnnotation?.id);

  // Update document title based on selected annotation
  useEffect(() => {
    if (selectedAnnotation) {
      document.title = `Annotation: ${selectedAnnotation.label} — Document Viewer`;
    } else {
      document.title = 'Document Viewer';
    }
  }, [selectedAnnotation]);

  return (
    <div
      className="comments-panel"
      style={{
        width: 320,
        minWidth: 320,
      }}
    >
      <div className="panel-header">
        <h3>Comments</h3>
      </div>

      {selectedAnnotation ? (
        <div className="panel-content">
          <div className="annotation-info">
            <span
              className="annotation-label-badge"
              style={{ backgroundColor: selectedAnnotation.color || '#3498db' }}
            >
              {selectedAnnotation.label}
            </span>
            <span className="annotation-id">{selectedAnnotation.id}</span>
          </div>
          <CommentThread
            comments={comments}
            loading={loading}
            onAddComment={addComment}
          />
        </div>
      ) : (
        <div className="panel-empty">
          <p>Select an annotation to view comments</p>
        </div>
      )}
    </div>
  );
}
