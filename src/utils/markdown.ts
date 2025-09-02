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

> **Real-time** markdown editor with live preview

## What makes MarkText special?

MarkText is a **WYSIWYG** (What You See Is What You Get) markdown editor that lets you see your formatted text as you type, without needing a separate preview pane.

### Key Features:

- **Real-time rendering**: See your markdown formatted instantly
- **Distraction-free**: Clean, minimal interface focused on writing
- **Multiple modes**: WYSIWYG, Source Code, Typewriter, and Focus modes
- **Authentic experience**: Based on the original MarkText desktop app

### Editing Modes:

1. **WYSIWYG Mode**: See formatted text as you type
2. **Source Code Mode**: Traditional markdown editing
3. **Typewriter Mode**: Keep current line centered for focus
4. **Focus Mode**: Dim everything except current paragraph

### Try typing some markdown:

**Bold text** and *italic text*

\`inline code\` and code blocks:

\`\`\`javascript
function hello() {
    console.log("Hello MarkText!");
}
\`\`\`

> This is a blockquote
> 
> Multi-line quotes work too

## Lists work great:

- First item
- Second item
  - Nested item
  - Another nested item
- Third item

## Tables are supported:

| Feature | Status | Notes |
|---------|--------|-------|
| WYSIWYG | ✅ | Real-time rendering |
| Themes | ✅ | Light & Dark |
| Export | ✅ | Markdown files |
| Mobile | ✅ | Responsive design |

---

**Start writing and experience the MarkText difference!** 🚀
`;

export const markdownToPlainText = (markdown: string): string => {
  return markdown
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    .replace(/>\s+/g, '')
    .replace(/[-*+]\s+/g, '')
    .replace(/\d+\.\s+/g, '')
    .replace(/\n/g, ' ')
    .trim();
};