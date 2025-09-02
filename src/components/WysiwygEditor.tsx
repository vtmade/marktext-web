import React, { useRef, useEffect, useCallback, useState } from 'react';
import { parseMarkdown } from '../utils/markdown';

export type EditMode = 'wysiwyg' | 'source' | 'typewriter' | 'focus';

interface WysiwygEditorProps {
  content: string;
  onChange: (content: string) => void;
  editMode: EditMode;
  isDarkTheme: boolean;
}

export const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  content,
  onChange,
  editMode,
  isDarkTheme
}) => {
  const wysiwygRef = useRef<HTMLDivElement>(null);
  const sourceRef = useRef<HTMLTextAreaElement>(null);
  const [currentParagraph, setCurrentParagraph] = useState<Element | null>(null);

  const updateContent = useCallback(() => {
    if (editMode === 'source') return;
    
    if (wysiwygRef.current) {
      const htmlContent = parseMarkdown(content);
      wysiwygRef.current.innerHTML = htmlContent;
    }
  }, [content, editMode]);

  useEffect(() => {
    updateContent();
  }, [updateContent]);

  const handleWysiwygInput = useCallback((e: Event) => {
    if (wysiwygRef.current) {
      const html = wysiwygRef.current.innerHTML;
      // For demo purposes, we'll use a simple conversion
      // In real MarkText, this would be much more sophisticated
      const text = wysiwygRef.current.innerText;
      onChange(text);
    }
  }, [onChange]);

  const handleSourceInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const handleFocus = useCallback((e: Event) => {
    const target = e.target as Element;
    if (editMode === 'focus') {
      // Remove active class from all paragraphs
      wysiwygRef.current?.querySelectorAll('.active-paragraph').forEach(el => {
        el.classList.remove('active-paragraph');
      });
      
      // Add active class to current paragraph
      const paragraph = target.closest('p, h1, h2, h3, h4, h5, h6, li, blockquote');
      if (paragraph) {
        paragraph.classList.add('active-paragraph');
        setCurrentParagraph(paragraph);
      }
    }
  }, [editMode]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (editMode === 'source') {
      if (e.key === 'Tab') {
        e.preventDefault();
        const textarea = sourceRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newContent = content.substring(0, start) + '  ' + content.substring(end);
        
        onChange(newContent);
        
        setTimeout(() => {
          textarea.setSelectionRange(start + 2, start + 2);
        }, 0);
      }
    }
  }, [editMode, content, onChange]);

  useEffect(() => {
    const wysiwyg = wysiwygRef.current;
    if (wysiwyg && editMode !== 'source') {
      wysiwyg.addEventListener('input', handleWysiwygInput);
      wysiwyg.addEventListener('focus', handleFocus, true);
      
      return () => {
        wysiwyg.removeEventListener('input', handleWysiwygInput);
        wysiwyg.removeEventListener('focus', handleFocus, true);
      };
    }
  }, [handleWysiwygInput, handleFocus, editMode]);

  const getContainerClass = () => {
    let className = 'editor-container';
    if (editMode === 'source') className += ' source';
    if (editMode === 'typewriter') className += ' typewriter';
    if (editMode === 'focus') className += ' focus';
    return className;
  };

  return (
    <div className={getContainerClass()}>
      {editMode === 'source' ? (
        <textarea
          ref={sourceRef}
          className="source-code-editor"
          value={content}
          onChange={handleSourceInput}
          onKeyDown={handleKeyDown}
          placeholder="# Start writing your markdown here..."
          spellCheck={false}
        />
      ) : (
        <div
          ref={wysiwygRef}
          className="wysiwyg-editor"
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Start writing..."
        />
      )}
    </div>
  );
};