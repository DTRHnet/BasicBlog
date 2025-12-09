# BasicBlog - Complete Project Structure

## 📁 Directory Layout

```
BasicBlog/
│
├── 📜 Core Files
│   ├── cli.js                      # CLI entry point with 5 commands
│   ├── package.json                # Dependencies and scripts
│   ├── index.html                  # HTML template
│   ├── vite.config.js              # Vite build configuration
│   ├── tailwind.config.js          # Tailwind + shadcn/ui theme
│   ├── postcss.config.js           # PostCSS configuration
│   └── jest.config.js              # Jest test configuration
│
├── 🚀 Setup Scripts
│   ├── setup-windows.ps1           # Windows PowerShell setup script
│   ├── setup-linux.sh              # Linux/WSL bash setup script
│   └── SETUP_SCRIPTS.md            # Setup scripts documentation
│
├── 📚 Documentation
│   ├── README.md                   # Main documentation
│   ├── docs/
│   │   ├── API.md                  # Complete API reference
│   │   ├── EXTENSION_GUIDE.md      # Customization guide
│   │   ├── TROUBLESHOOTING.md      # Common issues & solutions
│   │   ├── ADVANCED_PANES.md       # Advanced panes features
│   │   ├── PROJECT_SUMMARY.md      # Project overview
│   │   ├── IMPLEMENTATION_SUMMARY.md # Implementation details
│   │   └── QUICK_REFERENCE.md      # Quick command reference
│
├── 💻 Source Code
│   └── src/
│       ├── components/             # React components
│       │   ├── Navigation.jsx      # Responsive navbar
│       │   ├── PaneGrid.jsx        # Advanced pane renderer
│       │   └── ui/                 # shadcn/ui components
│       │       ├── Card.jsx
│       │       └── Button.jsx
│       │
│       ├── pages/                  # Page components
│       │   └── HomePage.jsx
│       │
│       ├── utils/                  # Utility functions
│       │   ├── logger.js           # Winston logger
│       │   ├── configParser.js     # Config file parsers
│       │   └── panesParser.js      # Advanced panes parser
│       │
│       ├── lib/                    # Library code
│       │   └── utils.js            # Tailwind class merger
│       │
│       ├── App.jsx                 # Main app component
│       ├── App.css                 # Global styles + theme
│       └── main.jsx                # Entry point
│
├── 📝 Examples
│   └── examples/
│       ├── config.yaml             # Example configuration
│       ├── menu.json               # Example menu
│       ├── panes.cfg               # Example panes (with rows, heights, docking)
│       └── entries.json            # Example content
│
├── 🔌 Plugins
│   └── plugins/
│       ├── README.md               # Plugin development guide
│       └── analytics-plugin.js     # Example plugin
│
├── 🧪 Tests
│   └── tests/
│       └── panesParser.test.js     # Panes parser tests
│
└── 📦 Generated Output (after running generate)
    └── build/                      # Generated blog application
        ├── src/                    # Copied source files
        ├── public/                 # Public assets
        ├── blog-data.js            # Injected blog data
        ├── index.html              # Updated HTML
        ├── package.json            # Project dependencies
        ├── vite.config.js          # Build config
        ├── tailwind.config.js      # Tailwind config
        ├── postcss.config.js       # PostCSS config
        └── dist/                   # Production build (after npm run build)
```

## 📋 File Descriptions

### Core Files

| File | Purpose |
|------|---------|
| `cli.js` | Command-line interface with 5 commands: new, init, generate, build, deploy |
| `package.json` | Project metadata, dependencies, and npm scripts |
| `index.html` | Base HTML template for the generated blog |
| `vite.config.js` | Vite configuration for development and production builds |
| `tailwind.config.js` | Tailwind CSS configuration with shadcn/ui theme variables |
| `postcss.config.js` | PostCSS configuration for Tailwind processing |
| `jest.config.js` | Jest test runner configuration |

### Setup Scripts

| File | Purpose |
|------|---------|
| `setup-windows.ps1` | Interactive PowerShell script for Windows |
| `setup-linux.sh` | Interactive bash script for Linux/WSL |
| `SETUP_SCRIPTS.md` | Documentation for setup scripts |

### Documentation

| File | Purpose |
|------|---------|
| `README.md` | Main project documentation and getting started guide |
| `docs/API.md` | Complete API documentation for all functions and components |
| `docs/EXTENSION_GUIDE.md` | Guide for extending BasicBlog with themes, plugins, etc. |
| `docs/TROUBLESHOOTING.md` | Common issues, errors, and solutions |
| `docs/ADVANCED_PANES.md` | Advanced panes features: rows, heights, docking |
| `docs/PROJECT_SUMMARY.md` | High-level project overview and architecture |
| `docs/IMPLEMENTATION_SUMMARY.md` | Detailed implementation notes |
| `docs/QUICK_REFERENCE.md` | Quick reference for commands and configs |

### Source Code

#### Components
| File | Purpose |
|------|---------|
| `Navigation.jsx` | Responsive navigation bar with mobile menu and theme toggle |
| `PaneGrid.jsx` | Advanced pane grid renderer with row support, heights, and docking |
| `ui/Card.jsx` | shadcn/ui Card component with all sub-components |
| `ui/Button.jsx` | shadcn/ui Button component with variants and sizes |

#### Pages
| File | Purpose |
|------|---------|
| `HomePage.jsx` | Main page component that renders the pane grid |

#### Utilities
| File | Purpose |
|------|---------|
| `logger.js` | Winston-based logging to console and files |
| `configParser.js` | Parsers for config.yaml, menu.json, entries.json |
| `panesParser.js` | Advanced parser for panes.cfg with rows, heights, docking |

#### Library
| File | Purpose |
|------|---------|
| `utils.js` | Utility functions including Tailwind class merger |

#### App Files
| File | Purpose |
|------|---------|
| `App.jsx` | Main application component with routing and theme management |
| `App.css` | Global styles, theme variables, and custom animations |
| `main.jsx` | React application entry point |

### Configuration Files

#### User-Created (in project directory)
| File | Format | Purpose |
|------|--------|---------|
| `config.yaml` | YAML | Global blog settings (title, theme, author, etc.) |
| `menu.json` | JSON | Navigation menu items |
| `panes.cfg` | Custom | Pane layout with rows, widths, heights, docking |
| `entries.json` | JSON | Content mapped to panes |

### Examples

| File | Purpose |
|------|---------|
| `examples/config.yaml` | Example configuration demonstrating all options |
| `examples/menu.json` | Example navigation menu |
| `examples/panes.cfg` | Example panes with advanced features |
| `examples/entries.json` | Example content for all panes |

### Plugins

| File | Purpose |
|------|---------|
| `plugins/README.md` | Plugin development guide with examples |
| `plugins/analytics-plugin.js` | Example analytics plugin |

### Tests

| File | Purpose |
|------|---------|
| `tests/panesParser.test.js` | Unit tests for panes parser |

## 🔄 Workflow

### 1. Create New Project
```bash
# Windows
.\setup-windows.ps1

# Linux/WSL
./setup-linux.sh
```

### 2. Customize Configuration
Edit the 4 config files in your project directory:
- `config.yaml`
- `menu.json`
- `panes.cfg`
- `entries.json`

### 3. Generate Blog
```bash
basicblog generate
```

This creates the `build/` directory with your complete blog application.

### 4. Develop
```bash
cd build
npm install
npm run dev
```

### 5. Build for Production
```bash
basicblog build
```

This creates the `build/dist/` directory with optimized production files.

### 6. Deploy
```bash
basicblog deploy netlify  # or vercel, github
```

## 📦 Generated Output Structure

After running `basicblog generate`, the `build/` directory contains:

```
build/
├── src/                    # Complete React application
├── public/                 # Public assets
├── blog-data.js            # Your blog data (injected)
├── index.html              # Updated with your metadata
├── package.json            # Dependencies for the blog
├── vite.config.js          # Build configuration
├── tailwind.config.js      # Tailwind configuration
└── postcss.config.js       # PostCSS configuration
```

After running `npm run build` in the `build/` directory:

```
build/
└── dist/                   # Production-ready files
    ├── index.html          # Optimized HTML
    ├── assets/             # Minified JS and CSS
    └── blog-data.js        # Your blog data
```

## 🎯 Key Features by File

### Advanced Panes System (`src/utils/panesParser.js`)
- ✅ Multi-row layouts
- ✅ Height percentages (vh units)
- ✅ Docking positions (top/bottom/left/right)
- ✅ Auto-width calculation
- ✅ Width normalization
- ✅ Strict validation

### CLI (`cli.js`)
- ✅ `new` - Create new blog
- ✅ `init` - Initialize in current directory
- ✅ `generate` - Generate blog from configs
- ✅ `build` - Build for production
- ✅ `deploy` - Deploy to Netlify/Vercel/GitHub Pages

### Setup Scripts
- ✅ Interactive prompts
- ✅ ASCII art banner
- ✅ Colored output
- ✅ Input validation
- ✅ Default locations
- ✅ Space-to-underscore conversion

## 📊 Statistics

- **Total Files**: 35+
- **Source Files**: 15
- **Documentation Files**: 8
- **Example Files**: 4
- **Test Files**: 1
- **Setup Scripts**: 2
- **Lines of Code**: ~4,000
- **Lines of Documentation**: ~6,000

## 🎨 Technology Stack

### Frontend
- React 19
- Vite 7
- Tailwind CSS 4
- shadcn/ui
- Lucide React
- Framer Motion

### Backend/CLI
- Node.js 18+
- Commander.js
- js-yaml
- marked
- Joi
- Winston

### Testing
- Jest
- React Testing Library

## 🔗 Quick Links

- [Main README](../README.md)
- [Setup Scripts Guide](../SETUP_SCRIPTS.md)
- [API Documentation](API.md)
- [Advanced Panes Guide](ADVANCED_PANES.md)
- [Extension Guide](EXTENSION_GUIDE.md)
- [Troubleshooting](TROUBLESHOOTING.md)

---

**BasicBlog** - A DTRH.net Project  
admin [AT] dtrh [dot] net
