import React, { useRef, useEffect, useCallback, useState } from 'react';
import { parseMarkdown } from '../utils/markdown';

// Simple HTML to Markdown converter for WYSIWYG editing
const htmlToMarkdown = (html: string): string => {
  return html
    // Convert headings
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
    .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n')
    .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n')
    // Convert formatting
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
    // Convert paragraphs
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    // Convert lists
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    .replace(/<ul[^>]*>(.*?)<\/ul>/gi, '$1\n')
    .replace(/<ol[^>]*>(.*?)<\/ol>/gi, (match, content) => {
      // Convert ordered list items to numbered format
      let counter = 1;
      return content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => `${counter++}. $1\n`) + '\n';
    })
    // Convert blockquotes
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, (match, content) => {
      return content.replace(/^/gm, '> ') + '\n\n';
    })
    // Convert code blocks
    .replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gi, '```\n$1\n```\n\n')
    .replace(/<pre[^>]*>(.*?)<\/pre>/gi, '```\n$1\n```\n\n')
    // Convert line breaks
    .replace(/<br[^>]*>/gi, '\n')
    .replace(/<hr[^>]*>/gi, '\n---\n\n')
    // Remove remaining HTML tags
    .replace(/<[^>]+>/g, '')
    // Clean up extra whitespace
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .replace(/^\s+|\s+$/g, '');
};

export type EditMode = 'wysiwyg' | 'source' | 'typewriter' | 'focus';

interface WysiwygEditorProps {
  content: string;
  onChange: (content: string) => void;
  editMode: EditMode;
  isDarkTheme: boolean;
  onModeChange?: (mode: EditMode) => void;
}

export const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  content,
  onChange,
  editMode,
  isDarkTheme,
  onModeChange
}) => {
  const wysiwygRef = useRef<HTMLDivElement>(null);
  const sourceRef = useRef<HTMLTextAreaElement>(null);
  const [currentParagraph, setCurrentParagraph] = useState<Element | null>(null);

  const updateContent = useCallback(() => {
    if (editMode === 'source') return;
    
    if (wysiwygRef.current) {
      const htmlContent = parseMarkdown(content);
      // Only update if content actually changed to prevent cursor jumping
      if (wysiwygRef.current.innerHTML !== htmlContent) {
        const selection = window.getSelection();
        const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
        
        wysiwygRef.current.innerHTML = htmlContent;
        
        // Try to restore cursor position
        if (range && selection) {
          try {
            selection.removeAllRanges();
            selection.addRange(range);
          } catch (e) {
            // Fallback: place cursor at end
            const newRange = document.createRange();
            newRange.selectNodeContents(wysiwygRef.current);
            newRange.collapse(false);
            selection.removeAllRanges();
            selection.addRange(newRange);
          }
        }
      }
    }
  }, [content, editMode]);

  useEffect(() => {
    updateContent();
  }, [updateContent]);

  const handleWysiwygInput = useCallback((e: Event) => {
    if (wysiwygRef.current) {
      // For WYSIWYG mode, we need to be more careful about updates
      // to prevent losing formatting. Let's debounce the conversion.
      const html = wysiwygRef.current.innerHTML;
      
      // Simple approach: only update on significant changes
      if (e.type === 'blur' || e.type === 'paste') {
        const markdown = htmlToMarkdown(html);
        onChange(markdown);
      }
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
      wysiwyg.addEventListener('blur', handleWysiwygInput);
      wysiwyg.addEventListener('paste', handleWysiwygInput);
      wysiwyg.addEventListener('focus', handleFocus, true);
      
      return () => {
        wysiwyg.removeEventListener('blur', handleWysiwygInput);
        wysiwyg.removeEventListener('paste', handleWysiwygInput);
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
          onClick={() => {
            // Suggest switching to source mode for editing
            if (confirm('To edit, switch to Source mode for best experience. Switch now?')) {
              onModeChange?.('source');
            }
          }}
          style={{ cursor: 'pointer' }}
          title="Click to view rendered markdown. Use Source mode to edit."
        />
      )}
    </div>
  );
};