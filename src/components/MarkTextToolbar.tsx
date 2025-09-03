import React from 'react';

export type EditMode = 'wysiwyg' | 'source' | 'typewriter' | 'focus';

interface MarkTextToolbarProps {
  editMode: EditMode;
  onEditModeChange: (mode: EditMode) => void;
  isDarkTheme: boolean;
  onThemeToggle: () => void;
  onExport: () => void;
  onImport: () => void;
  onClear: () => void;
  onCopy: () => void;
  wordCount: number;
}

export const MarkTextToolbar: React.FC<MarkTextToolbarProps> = ({
  editMode,
  onEditModeChange,
  isDarkTheme,
  onThemeToggle,
  onExport,
  onImport,
  onClear,
  onCopy,
  wordCount
}) => {
  return (
    <>
      <div className="marktext-toolbar">
        {/* File Operations */}
        <div className="toolbar-group">
          <button className="toolbar-button" onClick={onImport} title="Import File">
            📁 Import
          </button>
          <button className="toolbar-button" onClick={onExport} title="Export File">
            💾 Export
          </button>
          <button className="toolbar-button" onClick={onCopy} title="Copy Formatted">
            📋 Copy
          </button>
          <button className="toolbar-button" onClick={onClear} title="Clear Editor">
            🗑️ Clear
          </button>
        </div>

        <div className="toolbar-separator" />

        {/* Editing Modes */}
        <div className="toolbar-group">
          <button
            className={`toolbar-button ${editMode === 'wysiwyg' ? 'active' : ''}`}
            onClick={() => onEditModeChange('wysiwyg')}
            title="WYSIWYG Mode"
          >
            📝 WYSIWYG
          </button>
          <button
            className={`toolbar-button ${editMode === 'source' ? 'active' : ''}`}
            onClick={() => onEditModeChange('source')}
            title="Source Code Mode"
          >
            💻 Source
          </button>
        </div>

        {/* Theme Toggle */}
        <div className="mode-switcher">
          <button
            className="toolbar-button"
            onClick={onThemeToggle}
            title={`Switch to ${isDarkTheme ? 'Light' : 'Dark'} Theme`}
          >
            {isDarkTheme ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-item">
          📊 {wordCount} words
        </div>
        <div className="status-item">
          Mode: {editMode.charAt(0).toUpperCase() + editMode.slice(1)}
        </div>
        <div className="status-item">
          Theme: {isDarkTheme ? 'Dark' : 'Light'}
        </div>
      </div>
    </>
  );
};