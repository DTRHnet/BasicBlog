# 🎨 BasicBlog

> **A simplified, "YOLO" static blog generator with powerful layout customization.**

BasicBlog is designed for developers who want a beautiful blog without the hassle. It offers a unique **Pane System** for layouts and a **Cascding Theme System** for easy customization.

## 🚀 Quick Start

**Windows:**
```powershell
.\setup-windows.ps1
```

**Linux/WSL:**
```bash
./setup-linux.sh
```

**Manual:**
```bash
npm install -g basicblog
basicblog new my-blog
cd my-blog
basicblog generate
cd build && npm run dev
```

---

## 📚 Documentation

Detailed documentation is available in the `docs/` folder:

### 🏠 Core Concepts
*   [**Theme System**](docs/THEME_SYSTEM.md) - **(NEW!)** How to customize layouts and overrides.
*   [**Advanced Panes**](docs/ADVANCED_PANES.md) - Deep dive into the grid layout engine.
*   [**Project Structure**](docs/PROJECT_STRUCTURE.md) - Map of files and folders.

### 🛠️ specifics
*   [**Automated Setup**](SETUP_SCRIPTS.md) - Guide to the setup scripts.
*   [**API Reference**](docs/API.md) - For developers modding the core.
*   [**Extension Guide**](docs/EXTENSION_GUIDE.md) - Adding plugins and custom code.
*   [**Troubleshooting**](docs/TROUBLESHOOTING.md) - Fix common issues.

---

## 🎭 The Theme System

BasicBlog uses a unique **file-based override system**.

*   **Root Folder**: Contains your global data (`menu.json`, `entries.json`).
*   **Theme Folder**: Contains your layout (`themes/basic/panes.cfg`).

To customize, you simply **edit the files**. No complex inheritance, no shadow DOM, no confusion.

**Example `panes.cfg`:**
```
|header 100 15 dock:top|
|sidebar 25|main|
|footer 100 dock:bottom|
```

Change it to:
```
|main 100|
```
And your sidebar is gone. It's that simple. 

[Read more about Themes →](docs/THEME_SYSTEM.md)

---

## 📦 Features

*   **Zero-Config Defaults**: Works out of the box.
*   **Markdown Support**: Write content in simple markdown.
*   **Hot Reloading**: See changes instantly.
*   **Tailwind CSS**: Built with modern v4 styling.
*   **shadcn/ui**: Beautiful, accessible components.
*   **Production Ready**: Builds optimized static assets.
*   **Multi-Platform Deploy**: Netlify, Vercel, GitHub Pages.

---

## 🤝 Contributing

We love contributions! Please read the [API Documentation](docs/API.md) to get started with the codebase.

**Project Status**: Active Development 🟢

---

**BasicBlog** - A DTRH.net Project  
admin [AT] dtrh [dot] net
