import React from 'react';

export type ViewMode = 'split' | 'editor' | 'preview';

interface ToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  isDarkTheme: boolean;
  onThemeToggle: () => void;
  onExport: () => void;
  onImport: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  viewMode,
  onViewModeChange,
  isDarkTheme,
  onThemeToggle,
  onExport,
  onImport,
}) => {
  return (
    <div className="toolbar">
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          className={`toolbar-button ${viewMode === 'split' ? 'active' : ''}`}
          onClick={() => onViewModeChange('split')}
          title="Split View"
        >
          Split
        </button>
        <button
          className={`toolbar-button ${viewMode === 'editor' ? 'active' : ''}`}
          onClick={() => onViewModeChange('editor')}
          title="Editor Only"
        >
          Edit
        </button>
        <button
          className={`toolbar-button ${viewMode === 'preview' ? 'active' : ''}`}
          onClick={() => onViewModeChange('preview')}
          title="Preview Only"
        >
          Preview
        </button>
      </div>
      
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
        <button
          className="toolbar-button"
          onClick={onImport}
          title="Import Markdown File"
        >
          Import
        </button>
        <button
          className="toolbar-button"
          onClick={onExport}
          title="Export as Markdown"
        >
          Export
        </button>
        <button
          className="toolbar-button"
          onClick={onThemeToggle}
          title={`Switch to ${isDarkTheme ? 'light' : 'dark'} theme`}
        >
          {isDarkTheme ? '☀️' : '🌙'}
        </button>
      </div>
    </div>
  );
};