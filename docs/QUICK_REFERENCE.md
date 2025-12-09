# BasicBlog Quick Reference

## 🚀 Quick Commands

```bash
# Create new blog
basicblog new my-blog

# Initialize in current directory
basicblog init

# Generate blog
basicblog generate

# Build for production
basicblog build

# Deploy
basicblog deploy netlify    # or vercel, github
```

## 📁 Configuration Files

### config.yaml
```yaml
title: My Blog
theme: dark
output_dir: ./build
multi_page: false
author: Your Name
description: Blog description
```

### menu.json
```json
[
  { "label": "Home", "url": "/" },
  { "label": "About", "url": "#about" }
]
```

### panes.cfg
```
|sidebar 25|main 50|footer 25|
```

### entries.json
```json
{
  "main": [
    {
      "type": "markdown",
      "title": "Welcome",
      "content": "# Hello World"
    }
  ]
}
```

## 🎨 Pane Layouts

```bash
|main|                    # Single column
|sidebar 30|main|         # Two columns
|left|center|right|       # Three equal columns
|sidebar 20|main|ads 10|  # Custom widths
```

## 📝 Content Types

- **text**: Plain text
- **markdown**: Markdown → HTML
- **html**: Raw HTML

## 🎯 Common Workflows

### Create & Deploy
```bash
basicblog new blog
cd blog
basicblog generate
cd build && npm install
basicblog build
basicblog deploy netlify
```

### Development
```bash
basicblog generate
cd build && npm install && npm run dev
# Edit config files
basicblog generate  # Regenerate
```

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Command not found | `npm install -g .` |
| Build fails | `cd build && npm install` |
| Blank page | Check browser console |
| Panes not showing | Match names in panes.cfg and entries.json |

## 📚 Documentation

- `README.md` - Full guide
- `docs/API.md` - API reference
- `docs/EXTENSION_GUIDE.md` - Customization
- `docs/TROUBLESHOOTING.md` - Common issues

## 💡 Tips

1. Use `--help` with any command
2. Start with examples: `basicblog generate ./examples`
3. Test locally before deploying
4. Keep panes simple (1-3 panes)
5. Use descriptive pane names

## 🌐 Deployment

```bash
# Netlify
basicblog deploy netlify

# Vercel
basicblog deploy vercel

# GitHub Pages
basicblog deploy github
```

## 🎨 Customization

### Change Theme
Edit `config.yaml`:
```yaml
theme: dark  # or light
```

### Custom Colors
Edit `src/App.css`:
```css
:root {
  --primary: 262.1 83.3% 57.8%;
}
```

### Add Content
Edit `entries.json`:
```json
{
  "main": [
    { "type": "markdown", "content": "..." }
  ]
}
```

## 📊 File Locations

```
my-blog/
├── config.yaml      # Settings
├── menu.json        # Navigation
├── panes.cfg        # Layout
├── entries.json     # Content
└── build/           # Generated app
    └── dist/        # Production build
```

## ⚡ Performance

- Dev server: ~2s
- Build: ~5-10s
- Generate: <1s

## 🔗 Links

- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Vite](https://vitejs.dev/)

---

**BasicBlog v1.0.0** | MIT License | [Full Documentation](README.md)
