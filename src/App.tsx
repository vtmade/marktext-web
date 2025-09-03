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

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all content?')) {
      setContent('');
    }
  };

  const handleCopy = async () => {
    try {
      const { parseMarkdown } = await import('./utils/markdown');
      const htmlContent = parseMarkdown(content);
      
      // Create a temporary div to hold the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      
      // Copy as both HTML and plain text for better compatibility
      const clipboardItem = new ClipboardItem({
        'text/html': new Blob([htmlContent], { type: 'text/html' }),
        'text/plain': new Blob([tempDiv.textContent || content], { type: 'text/plain' })
      });
      
      await navigator.clipboard.write([clipboardItem]);
      
      // Simple feedback
      const button = document.querySelector('[title="Copy Formatted"]');
      if (button) {
        const originalText = button.textContent;
        button.textContent = '✓ Copied';
        setTimeout(() => {
          button.textContent = originalText;
        }, 1000);
      }
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('Failed to copy to clipboard');
    }
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
        onClear={handleClear}
        onCopy={handleCopy}
        wordCount={wordCount}
      />

      <WysiwygEditor
        content={content}
        onChange={setContent}
        editMode={editMode}
        isDarkTheme={isDarkTheme}
        onModeChange={setEditMode}
      />
    </div>
  );
}

export default App;