# Document Annotation Tool

A React-based document annotation tool for reviewing and annotating invoice documents. Built as a frontend coding exercise.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Features

- **Document viewing** — View invoice documents with zoom controls
- **Annotations** — View and interact with annotation markers overlaid on the document
- **Create annotations** — Click "New Annotation" to enter create mode, then click on the document to place new annotations
- **Comments** — Select any annotation to view and add comments in the side panel
- **Filtering** — Filter annotations by label type using the filter bar
- **Keyboard shortcuts**:
  - `+` / `-` — Zoom in/out
  - `Escape` — Deselect annotation or exit create mode
  - `Delete` / `Backspace` — Delete selected annotation

## Project Structure

```
src/
  components/
    DocumentViewer.jsx    # Main document viewer component
    AnnotationLayer.jsx   # Renders annotation markers on the document
    AnnotationMarker.jsx  # Individual annotation marker
    CommentsPanel.jsx     # Sidebar panel for comments
    CommentThread.jsx     # Comment list and form
    FilterBar.jsx         # Label filter buttons
    Toolbar.jsx           # Zoom and create mode controls
  hooks/
    useAnnotations.js     # Annotation CRUD operations
    useComments.js        # Comment fetching and adding
    useZoom.js            # Zoom level state
  data/
    sampleDocument.png    # Sample invoice image
    mockAnnotations.json  # Annotation data
    mockComments.json     # Comment data
  App.jsx
  App.css
  index.css
  main.jsx
```

## Exercise

Review the codebase and identify:

1. **Bugs** — Find and fix any bugs you notice while using the application
2. **Performance issues** — Identify areas where the application could be more performant
3. **Code quality** — Note any architectural or code quality concerns and suggest improvements

Spend approximately 30-40 minutes reviewing and fixing issues. Be prepared to discuss your findings and prioritization.

## Tech Stack

- React 18
- Vite
- Plain CSS (no UI libraries)
