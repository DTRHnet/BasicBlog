# BasicBlog - Project Summary

## Overview

BasicBlog is a **dynamic blog generator** built with **Node.js**, **React**, and **shadcn/ui** that transforms simple configuration files into a stunning, production-ready web application.

## Key Features

### 🎨 Beautiful UI
- **shadcn/ui components** for modern, accessible design
- **Tailwind CSS** for utility-first styling
- **Dark/Light mode** with smooth transitions
- **Responsive design** that works on all devices
- **Smooth animations** using CSS and Framer Motion

### 🔧 Flexible Configuration
- **YAML config** for global settings
- **JSON files** for menu and content
- **Custom pane layout** with pipe-delimited format
- **Multiple content types**: text, markdown, HTML
- **Extensible** through plugins

### 🛡️ Robust & Graceful
- **Input validation** with Joi
- **Comprehensive error handling** with fallbacks
- **Detailed logging** with Winston
- **User-friendly error messages**
- **Fault tolerance** - never crashes

### 🚀 Developer-Friendly
- **CLI tool** for easy generation
- **Hot module replacement** in development
- **Fast builds** with Vite
- **Test coverage** with Jest
- **Well-documented** API and guides

## Project Structure

```
BasicBlog/
├── cli.js                      # CLI entry point
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
├── jest.config.js              # Jest test configuration
├── README.md                   # Main documentation
│
├── src/                        # Source code
│   ├── components/             # React components
│   │   ├── Navigation.jsx      # Navigation bar
│   │   ├── PaneGrid.jsx        # Pane layout renderer
│   │   └── ui/                 # shadcn/ui components
│   │       ├── Card.jsx
│   │       └── Button.jsx
│   │
│   ├── pages/                  # Page components
│   │   └── HomePage.jsx
│   │
│   ├── utils/                  # Utility functions
│   │   ├── logger.js           # Winston logger
│   │   ├── configParser.js     # Config file parsers
│   │   └── panesParser.js      # Panes parser
│   │
│   ├── lib/                    # Library code
│   │   └── utils.js            # Tailwind class merger
│   │
│   ├── App.jsx                 # Main app component
│   ├── App.css                 # Global styles
│   └── main.jsx                # Entry point
│
├── examples/                   # Example configurations
│   ├── config.yaml
│   ├── menu.json
│   ├── panes.cfg
│   └── entries.json
│
├── plugins/                    # Plugin directory
│   ├── README.md
│   └── analytics-plugin.js
│
├── tests/                      # Test files
│   └── panesParser.test.js
│
└── docs/                       # Documentation
    ├── API.md                  # API documentation
    ├── EXTENSION_GUIDE.md      # Extension guide
    └── TROUBLESHOOTING.md      # Troubleshooting guide
```

## Technology Stack

### Core
- **Node.js** (v18+) - Runtime environment
- **React** (v19) - UI library
- **Vite** (v7) - Build tool

### UI & Styling
- **shadcn/ui** - Component library
- **Tailwind CSS** (v4) - Utility-first CSS
- **Lucide React** - Icon library
- **Framer Motion** - Animation library

### Parsing & Validation
- **js-yaml** - YAML parser
- **Joi** - Schema validation
- **marked** - Markdown parser

### CLI & Logging
- **Commander.js** - CLI framework
- **Winston** - Logging library

### Testing
- **Jest** - Test framework
- **React Testing Library** - Component testing

## Configuration Files

### 1. config.yaml
```yaml
title: My Blog
theme: dark
output_dir: ./build
multi_page: false
author: John Doe
description: A beautiful blog
```

### 2. menu.json
```json
[
  { "label": "Home", "url": "/" },
  { "label": "About", "url": "/about" }
]
```

### 3. panes.cfg
```
|sidebar 25|main 50|footer 25|
```

### 4. entries.json
```json
{
  "sidebar": [
    {
      "type": "markdown",
      "title": "About",
      "content": "## Welcome!"
    }
  ]
}
```

## Usage

### Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Generate blog from examples
npm run generate

# 3. Navigate to build directory
cd build

# 4. Install dependencies
npm install

# 5. Start development server
npm run dev

# 6. Open browser
# Visit http://localhost:5173
```

### CLI Commands

```bash
# Generate from current directory
node cli.js generate

# Generate from specific directory
node cli.js generate ./examples

# Override output directory
node cli.js generate ./examples -o ./my-blog
```

### NPM Scripts

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run generate  # Generate blog
npm test          # Run tests
npm run lint      # Lint code
```

## Key Components

### Navigation
- Responsive navigation bar
- Mobile menu with hamburger icon
- Theme toggle (light/dark)
- Smooth animations

### PaneGrid
- Dynamic pane layout
- Responsive (stacks on mobile)
- Content rendering (text/markdown/HTML)
- Empty state handling

### Card
- shadcn/ui Card component
- Hover effects
- Consistent styling
- Flexible layout

### Button
- Multiple variants (default, outline, ghost, etc.)
- Multiple sizes (sm, default, lg, icon)
- Accessible
- Customizable

## Parsing Logic

### Config Parser
1. Read YAML file
2. Validate with Joi schema
3. Merge with defaults
4. Return validated config

### Menu Parser
1. Read JSON file
2. Validate array structure
3. Filter invalid items
4. Return validated menu

### Panes Parser
1. Read pipe-delimited file
2. Split by `|` and parse segments
3. Extract name and width
4. Validate names (alphanumeric)
5. Validate widths (1-100)
6. Calculate auto-widths
7. Normalize to 100%
8. Return pane array

### Entries Parser
1. Read JSON file
2. Validate object structure
3. Validate each entry (type, content)
4. Filter invalid entries
5. Return validated entries

## Error Handling

### Graceful Degradation
- Missing files → Use defaults
- Invalid data → Skip and warn
- Parsing errors → Fallback values
- Never crashes → Always generates output

### Logging Levels
- **INFO**: Successful operations
- **WARN**: Using defaults, skipping data
- **ERROR**: Critical failures (but continues)

### Example Errors
```
WARN: Menu file not found. Using empty menu.
WARN: Invalid width '150' for pane 'sidebar'. Using auto width.
ERROR: Duplicate pane name 'main'. Skipping duplicate.
```

## Extensibility

### Plugin System
```javascript
// plugins/my-plugin.js
export default function myPlugin(config) {
  return {
    name: 'my-plugin',
    version: '1.0.0',
    // Custom methods
  };
}
```

### Custom Content Types
1. Create renderer component
2. Update ContentRenderer
3. Update validation
4. Use in entries.json

### Custom Themes
1. Modify CSS variables
2. Create theme presets
3. Add theme selector

## Testing

### Unit Tests
```javascript
// tests/panesParser.test.js
test('parses valid panes', () => {
  const result = parsePanes('./examples/panes.cfg');
  expect(result).toHaveLength(3);
});
```

### Running Tests
```bash
npm test                    # Run all tests
npm test -- --coverage      # With coverage
npm test -- --watch         # Watch mode
```

## Deployment

### Build for Production
```bash
cd build
npm run build
```

### Deploy to Netlify
```bash
netlify deploy --prod
```

### Deploy to Vercel
```bash
vercel --prod
```

### Deploy to GitHub Pages
```bash
npm run deploy
```

## Performance

### Optimizations
- Code splitting with React.lazy
- Image lazy loading
- CSS purging with Tailwind
- Minification with Vite
- Tree shaking

### Bundle Size
- Initial: ~150KB (gzipped)
- With code splitting: ~50KB initial

## Accessibility

### Features
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus indicators
- Screen reader support
- Color contrast (WCAG AA)

## SEO

### Built-in Features
- Meta tags (title, description, author)
- Open Graph tags
- Semantic HTML structure
- Sitemap generation (via plugin)
- Fast page loads

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Future Enhancements

### Planned Features
- [ ] Multi-page routing
- [ ] Search functionality
- [ ] RSS feed generation
- [ ] Syntax highlighting
- [ ] Image optimization
- [ ] Internationalization (i18n)
- [ ] Comments system
- [ ] Analytics integration
- [ ] CMS integration

### Community Contributions
- Custom themes
- Additional plugins
- Content type renderers
- Deployment guides

## License

MIT License - Free to use for any purpose

## Credits

Built with:
- React
- Vite
- Tailwind CSS
- shadcn/ui
- Lucide Icons
- marked
- Winston
- Joi
- Commander.js

## Support

- **Documentation**: See `/docs` directory
- **Examples**: See `/examples` directory
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions

## Quick Reference

### File Formats

| File | Format | Purpose |
|------|--------|---------|
| config.yaml | YAML | Global settings |
| menu.json | JSON | Navigation menu |
| panes.cfg | Custom | Layout definition |
| entries.json | JSON | Content mapping |

### Content Types

| Type | Description | Example |
|------|-------------|---------|
| text | Plain text | "Hello, world!" |
| markdown | Markdown → HTML | "# Heading" |
| html | Raw HTML | "\<div\>Content\</div\>" |

### Pane Width Rules

- Explicit: `|pane 50|` → 50%
- Auto: `|pane|` → Calculated
- Normalized: Total always = 100%
- Valid range: 1-100

### Theme Variables

| Variable | Light | Dark |
|----------|-------|------|
| --primary | Purple | Lighter purple |
| --background | White | Dark gray |
| --foreground | Dark gray | Light gray |

## Conclusion

BasicBlog is a **production-ready**, **extensible**, and **user-friendly** blog generator that combines modern web technologies with robust error handling and graceful degradation. It's designed to be easy to use for beginners while providing advanced customization options for experienced developers.

**Get started today and build your stunning blog in minutes!** 🚀

---

**Version**: 1.0.0  
**Last Updated**: December 2025  
**Maintainer**: BasicBlog Team
