import React, { useEffect, useRef } from 'react';
import { MarkTextToolbar } from './components/MarkTextToolbar';
import { WysiwygEditor, EditMode } from './components/WysiwygEditor';
import { useLocalStorage } from './hooks/useLocalStorage';
import { configureMarked, getDefaultContent } from './utils/markdown';
import { getWordCount } from './utils/wordCount';

function App() {
  const [content, setContent] = useLocalStorage('marktext-content', getDefaultContent());
  const [editMode, setEditMode] = useLocalStorage<EditMode>('marktext-editmode', 'wysiwyg');
  const [isDarkTheme, setIsDarkTheme] = useLocalStorage('marktext-darktheme', false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    configureMarked();
  }, []);

  useEffect(() => {
    document.body.className = isDarkTheme ? 'dark-theme' : '';
  }, [isDarkTheme]);

  const wordCount = getWordCount(content);

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

  return (
    <div className="marktext-app">
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown,.txt"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
      
      <MarkTextToolbar
        editMode={editMode}
        onEditModeChange={setEditMode}
        isDarkTheme={isDarkTheme}
        onThemeToggle={() => setIsDarkTheme(!isDarkTheme)}
        onExport={handleExport}
        onImport={handleImport}
        wordCount={wordCount}
      />

      <WysiwygEditor
        content={content}
        onChange={setContent}
        editMode={editMode}
        isDarkTheme={isDarkTheme}
      />
    </div>
  );
}

export default App;