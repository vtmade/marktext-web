import React, { useEffect, useRef } from 'react';
import { Toolbar, ViewMode } from './components/Toolbar';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { useLocalStorage } from './hooks/useLocalStorage';
import { configureMarked, getDefaultContent } from './utils/markdown';

function App() {
  const [content, setContent] = useLocalStorage('marktext-content', getDefaultContent());
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>('marktext-viewmode', 'split');
  const [isDarkTheme, setIsDarkTheme] = useLocalStorage('marktext-darktheme', false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    configureMarked();
  }, []);

  useEffect(() => {
    document.body.className = isDarkTheme ? 'dark-theme' : '';
  }, [isDarkTheme]);

  const handleExport = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target?.result as string;
      if (fileContent) {
        setContent(fileContent);
      }
    };
    reader.readAsText(file);
  };

  const getContainerClass = () => {
    let className = 'editor-container';
    if (viewMode === 'split') className += ' split-view';
    else if (viewMode === 'preview') className += ' preview-only';
    else if (viewMode === 'editor') className += ' editor-only';
    return className;
  };

  return (
    <div className={getContainerClass()}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown,.txt"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
      
      <Toolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        isDarkTheme={isDarkTheme}
        onThemeToggle={() => setIsDarkTheme(!isDarkTheme)}
        onExport={handleExport}
        onImport={handleImport}
      />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {(viewMode === 'split' || viewMode === 'editor') && (
          <Editor
            content={content}
            onChange={setContent}
            className={viewMode === 'editor' ? 'editor-only' : ''}
          />
        )}
        
        {(viewMode === 'split' || viewMode === 'preview') && (
          <Preview
            content={content}
            className={viewMode === 'preview' ? 'preview-only' : ''}
          />
        )}
      </div>
    </div>
  );
}

export default App;