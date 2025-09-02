import { marked } from 'marked';
import hljs from 'highlight.js';

export const configureMarked = () => {
  marked.setOptions({
    highlight: function(code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(code, { language: lang }).value;
        } catch (err) {
          console.error('Highlight.js error:', err);
        }
      }
      return hljs.highlightAuto(code).value;
    },
    langPrefix: 'hljs language-',
    breaks: true,
    gfm: true,
  });
};

export const parseMarkdown = (markdown: string): string => {
  try {
    return marked.parse(markdown) as string;
  } catch (error) {
    console.error('Markdown parsing error:', error);
    return '<p>Error parsing markdown</p>';
  }
};

export const getDefaultContent = () => `# Welcome to MarkText Web

A **WYSIWYG** markdown editor inspired by the original MarkText.

## Features

- ✅ Real-time preview
- ✅ Syntax highlighting
- ✅ Dark/Light theme
- ✅ Split view mode
- ✅ Export functionality
- ✅ GitHub Flavored Markdown support

## Getting Started

Start typing in the editor panel on the left, and see the rendered preview on the right.

### Code Example

\`\`\`javascript
function hello() {
  console.log("Hello, MarkText Web!");
}
\`\`\`

### Table Example

| Feature | Status |
|---------|--------|
| Editor | ✅ Done |
| Preview | ✅ Done |
| Export | ✅ Done |

> **Note**: This is a web-based version of MarkText that can be deployed to Netlify or any static hosting service.

Happy writing! 🚀
`;