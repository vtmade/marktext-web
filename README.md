# MarkText Web

A web-based WYSIWYG markdown editor inspired by [MarkText](https://github.com/marktext/marktext). This version is designed to be deployed on static hosting services like Netlify.

## Features

- 📝 **Real-time Preview**: See your markdown rendered as you type
- 🎨 **Themes**: Light and dark theme support
- 📱 **Responsive**: Works on desktop and mobile devices
- 💾 **Auto-save**: Content is automatically saved to localStorage
- 📂 **File Operations**: Import and export markdown files
- 🖥️ **View Modes**: Split view, editor-only, or preview-only
- ✨ **Syntax Highlighting**: Code blocks with syntax highlighting
- 📋 **GitHub Flavored Markdown**: Full GFM support

## Live Demo

Deploy to Netlify by clicking the button below:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/marktext-web)

## Local Development

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd marktext-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## Deployment

### Netlify
1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy!

### Other Static Hosts
The `dist` folder contains all the static files needed to run the application. You can deploy it to any static hosting service like:
- Vercel
- GitHub Pages
- Firebase Hosting
- Surge.sh

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Marked** - Markdown parsing
- **Highlight.js** - Syntax highlighting

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the original [MarkText](https://github.com/marktext/marktext) desktop application
- Thanks to the open-source community for the amazing libraries used in this project