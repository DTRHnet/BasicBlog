# Troubleshooting Guide

Common issues and solutions for BasicBlog.

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [Generation Errors](#generation-errors)
3. [Build Errors](#build-errors)
4. [Runtime Errors](#runtime-errors)
5. [Styling Issues](#styling-issues)
6. [Performance Issues](#performance-issues)

---

## Installation Issues

### Error: `npm install` fails

**Symptoms:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions:**

1. **Use legacy peer deps:**
```bash
npm install --legacy-peer-deps
```

2. **Clear npm cache:**
```bash
npm cache clean --force
npm install
```

3. **Update Node.js:**
```bash
node --version  # Should be >= 18.0.0
```

Download latest LTS from [nodejs.org](https://nodejs.org/)

### Error: Permission denied

**Symptoms:**
```
Error: EACCES: permission denied
```

**Solutions:**

**On Windows:**
```bash
# Run as Administrator
```

**On macOS/Linux:**
```bash
sudo npm install -g basicblog
```

Or fix npm permissions:
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

---

## Generation Errors

### Error: Configuration file not found

**Symptoms:**
```
WARN: Configuration file not found at ./config.yaml. Using default configuration.
```

**Solutions:**

1. **Verify file exists:**
```bash
ls config.yaml  # Unix/Mac
dir config.yaml  # Windows
```

2. **Check file path:**
```bash
# Generate from specific directory
node cli.js generate ./path/to/config
```

3. **Create config file:**
```yaml
# config.yaml
title: My Blog
theme: light
output_dir: ./build
```

### Error: Invalid YAML syntax

**Symptoms:**
```
ERROR: Invalid YAML syntax in config.yaml: unexpected token
```

**Solutions:**

1. **Check YAML formatting:**
   - Use spaces, not tabs
   - Proper indentation
   - Quotes for special characters

```yaml
# ❌ Wrong
title:My Blog
theme:	light

# ✅ Correct
title: My Blog
theme: light
```

2. **Validate YAML online:**
   - Use [yamllint.com](http://www.yamllint.com/)

3. **Check for special characters:**
```yaml
# Use quotes for special characters
description: "A blog about: coding, design & more"
```

### Error: Invalid JSON in menu.json or entries.json

**Symptoms:**
```
ERROR: Invalid JSON syntax in menu.json: Unexpected token
```

**Solutions:**

1. **Validate JSON:**
   - Use [jsonlint.com](https://jsonlint.com/)
   - Check for trailing commas
   - Ensure proper quotes (double quotes only)

```json
// ❌ Wrong
{
  "label": 'Home',  // Single quotes
  "url": "/",       // Trailing comma
}

// ✅ Correct
{
  "label": "Home",
  "url": "/"
}
```

2. **Common JSON errors:**
```json
// Missing comma
[
  {"label": "Home", "url": "/"}
  {"label": "About", "url": "/about"}  // ❌ Missing comma
]

// Trailing comma
[
  {"label": "Home", "url": "/"},  // ✅ OK here
]  // ❌ Not OK before closing bracket
```

### Error: Duplicate pane names

**Symptoms:**
```
ERROR: Duplicate pane name 'main' found. Each pane must have a unique name.
```

**Solutions:**

1. **Check panes.cfg:**
```
# ❌ Wrong
|main|sidebar|main|

# ✅ Correct
|main|sidebar|footer|
```

2. **Use descriptive names:**
```
|left-sidebar|main-content|right-sidebar|
```

### Error: Invalid pane width

**Symptoms:**
```
WARN: Invalid width '150' for pane 'sidebar'. Must be 1-100.
```

**Solutions:**

1. **Use valid percentages (1-100):**
```
# ❌ Wrong
|sidebar 150|main 200|

# ✅ Correct
|sidebar 25|main 75|
```

2. **Let BasicBlog auto-calculate:**
```
# Omit widths for equal distribution
|sidebar|main|footer|
```

---

## Build Errors

### Error: Module not found

**Symptoms:**
```
Error: Cannot find module 'react'
```

**Solutions:**

1. **Install dependencies:**
```bash
cd build
npm install
```

2. **Check package.json:**
```bash
cat package.json  # Verify dependencies are listed
```

3. **Reinstall:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: Vite build fails

**Symptoms:**
```
Error: Build failed with X errors
```

**Solutions:**

1. **Check for syntax errors:**
```bash
npm run lint
```

2. **Clear Vite cache:**
```bash
rm -rf node_modules/.vite
npm run build
```

3. **Update dependencies:**
```bash
npm update
```

### Error: Out of memory

**Symptoms:**
```
FATAL ERROR: Reached heap limit Allocation failed
```

**Solutions:**

1. **Increase Node memory:**
```bash
# In package.json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' vite build"
  }
}
```

2. **Reduce bundle size:**
   - Enable code splitting
   - Remove unused dependencies
   - Optimize images

---

## Runtime Errors

### Error: Blank page after deployment

**Symptoms:**
- Page loads but shows nothing
- Console shows 404 errors

**Solutions:**

1. **Check base URL in vite.config.js:**
```javascript
// For GitHub Pages
export default {
  base: '/repository-name/'
}

// For custom domain
export default {
  base: '/'
}
```

2. **Verify files are deployed:**
```bash
# Check dist folder contents
ls dist/
```

3. **Check browser console:**
```
F12 → Console tab
Look for errors
```

### Error: Theme not applying

**Symptoms:**
- Dark mode toggle doesn't work
- Colors look wrong

**Solutions:**

1. **Check theme in blog-data.js:**
```javascript
window.__BLOG_DATA__ = {
  config: {
    theme: 'dark'  // or 'light'
  }
}
```

2. **Verify CSS is loaded:**
```bash
# Check if App.css exists in dist
ls dist/assets/*.css
```

3. **Clear browser cache:**
```
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

### Error: Navigation not working

**Symptoms:**
- Clicking menu items does nothing
- 404 on page refresh

**Solutions:**

1. **For single-page apps:**
```javascript
// Use hash routing
<Link to="#section">Section</Link>
```

2. **For multi-page apps, configure server:**

**Netlify (_redirects):**
```
/*  /index.html  200
```

**Vercel (vercel.json):**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

**Apache (.htaccess):**
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

---

## Styling Issues

### Issue: Tailwind classes not working

**Symptoms:**
- Classes have no effect
- Styles not applied

**Solutions:**

1. **Verify Tailwind is configured:**
```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"  // ✅ Correct paths
  ]
}
```

2. **Check CSS import:**
```javascript
// src/main.jsx or App.jsx
import './App.css'  // Must import CSS
```

3. **Rebuild:**
```bash
npm run build
```

### Issue: Custom CSS not loading

**Symptoms:**
- Custom styles don't appear

**Solutions:**

1. **Import in component:**
```javascript
import './custom.css'
```

2. **Add to index.html:**
```html
<link rel="stylesheet" href="/custom.css">
```

3. **Check file location:**
```
public/custom.css  → Accessible at /custom.css
src/custom.css     → Must be imported
```

### Issue: Responsive layout broken

**Symptoms:**
- Mobile view looks wrong
- Panes don't stack

**Solutions:**

1. **Check viewport meta tag:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

2. **Verify responsive classes:**
```javascript
// Use Tailwind breakpoints
<div className="flex flex-col lg:flex-row">
```

3. **Test at different sizes:**
```
F12 → Toggle device toolbar
Test at various screen sizes
```

---

## Performance Issues

### Issue: Slow page load

**Symptoms:**
- Long initial load time
- Large bundle size

**Solutions:**

1. **Enable code splitting:**
```javascript
import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('./pages/HomePage'));

<Suspense fallback={<div>Loading...</div>}>
  <HomePage />
</Suspense>
```

2. **Optimize images:**
```bash
# Use WebP format
# Compress images
# Use lazy loading
<img loading="lazy" src="..." />
```

3. **Analyze bundle:**
```bash
npm install -D rollup-plugin-visualizer
npm run build
# Check stats.html
```

4. **Remove unused dependencies:**
```bash
npm uninstall unused-package
```

### Issue: Memory leaks

**Symptoms:**
- Page gets slower over time
- High memory usage

**Solutions:**

1. **Clean up effects:**
```javascript
useEffect(() => {
  const handler = () => { /* ... */ };
  window.addEventListener('scroll', handler);
  
  // ✅ Cleanup
  return () => {
    window.removeEventListener('scroll', handler);
  };
}, []);
```

2. **Avoid unnecessary re-renders:**
```javascript
// Use React.memo
const MyComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});

// Use useMemo
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

---

## Debugging Tips

### Enable Verbose Logging

```bash
# Set log level
LOG_LEVEL=debug node cli.js generate
```

### Check Log Files

```bash
# View logs
cat basicblog.log
cat basicblog-error.log
```

### Browser DevTools

1. **Console:** Check for JavaScript errors
2. **Network:** Check for failed requests
3. **Elements:** Inspect DOM and styles
4. **Performance:** Profile page load

### Common Commands

```bash
# Clear everything and start fresh
rm -rf node_modules package-lock.json build
npm install
npm run generate

# Check Node/npm versions
node --version
npm --version

# Verify file structure
tree -L 2  # Unix/Mac
# or
dir /s /b  # Windows
```

---

## Getting Help

If you're still experiencing issues:

1. **Check the logs:**
   - `basicblog.log`
   - `basicblog-error.log`
   - Browser console

2. **Search existing issues:**
   - GitHub Issues
   - Documentation

3. **Create a minimal reproduction:**
   - Simplify config files
   - Test with examples

4. **Report the issue:**
   - Include error messages
   - Provide config files
   - List steps to reproduce
   - Include environment info:
     ```bash
     node --version
     npm --version
     # OS version
     ```

---

## Useful Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [MDN Web Docs](https://developer.mozilla.org/)

---

**Still stuck? Check the [API Documentation](./API.md) or [Extension Guide](./EXTENSION_GUIDE.md).**
