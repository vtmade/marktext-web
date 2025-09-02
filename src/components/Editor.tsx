import React, { useRef, useCallback } from 'react';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
}

export const Editor: React.FC<EditorProps> = ({
  content,
  onChange,
  className = '',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + '  ' + content.substring(end);
      
      onChange(newContent);
      
      setTimeout(() => {
        textarea.setSelectionRange(start + 2, start + 2);
      }, 0);
    }
  }, [content, onChange]);

  return (
    <div className={`editor-panel ${className}`}>
      <textarea
        ref={textareaRef}
        className="editor-textarea"
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Start writing your markdown here..."
        spellCheck={false}
      />
    </div>
  );
};