import DocumentViewer from './components/DocumentViewer';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Document Annotation Tool</h1>
      </header>
      <main className="app-main">
        <DocumentViewer />
      </main>
    </div>
  );
}

export default App;
