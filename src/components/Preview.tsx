import React, { useEffect, useMemo } from 'react';
import { parseMarkdown } from '../utils/markdown';
import 'highlight.js/styles/github.css';

interface PreviewProps {
  content: string;
  className?: string;
}

export const Preview: React.FC<PreviewProps> = ({
  content,
  className = '',
}) => {
  const htmlContent = useMemo(() => parseMarkdown(content), [content]);

  useEffect(() => {
    const previewElement = document.querySelector('.preview-content');
    if (previewElement) {
      previewElement.scrollTop = 0;
    }
  }, [htmlContent]);

  return (
    <div className={`preview-panel ${className}`}>
      <div
        className="preview-content"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
};