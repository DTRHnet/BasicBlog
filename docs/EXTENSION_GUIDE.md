# BasicBlog Extension Guide

This guide explains how to extend and customize BasicBlog for your specific needs.

## Table of Contents

1. [Creating Custom Themes](#creating-custom-themes)
2. [Building Plugins](#building-plugins)
3. [Adding New Content Types](#adding-new-content-types)
4. [Custom Components](#custom-components)
5. [Multi-Page Applications](#multi-page-applications)
6. [SEO Optimization](#seo-optimization)
7. [Deployment](#deployment)

---

## Creating Custom Themes

### Method 1: Modify CSS Variables

Edit `src/App.css` to change theme colors:

```css
:root {
  /* Primary color - used for links, buttons, accents */
  --primary: 262.1 83.3% 57.8%;  /* Purple */
  
  /* Background colors */
  --background: 0 0% 100%;        /* White */
  --card: 0 0% 100%;              /* White */
  
  /* Text colors */
  --foreground: 222.2 84% 4.9%;   /* Dark gray */
  
  /* Border and input colors */
  --border: 214.3 31.8% 91.4%;    /* Light gray */
  --input: 214.3 31.8% 91.4%;     /* Light gray */
}
```

**Color Format:** HSL (Hue Saturation Lightness)
- Hue: 0-360 (color wheel position)
- Saturation: 0-100% (color intensity)
- Lightness: 0-100% (brightness)

### Method 2: Create Theme Presets

Create a theme configuration file:

```javascript
// src/themes/ocean-theme.js
export const oceanTheme = {
  light: {
    primary: '199 89% 48%',      // Ocean blue
    background: '210 40% 98%',    // Light blue-gray
    foreground: '210 24% 16%',    // Dark blue-gray
    border: '214 32% 91%',        // Light border
  },
  dark: {
    primary: '199 89% 58%',      // Lighter ocean blue
    background: '210 50% 8%',     // Dark blue
    foreground: '210 40% 98%',    // Light text
    border: '217 33% 17%',        // Dark border
  }
};
```

Apply the theme:

```javascript
// src/App.jsx
import { oceanTheme } from './themes/ocean-theme';

function applyTheme(theme, mode) {
  const colors = theme[mode];
  const root = document.documentElement;
  
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
}

// In your component
useEffect(() => {
  applyTheme(oceanTheme, theme);
}, [theme]);
```

### Method 3: Multiple Theme Support

```javascript
// src/themes/index.js
export const themes = {
  default: { /* ... */ },
  ocean: { /* ... */ },
  forest: { /* ... */ },
  sunset: { /* ... */ },
};

// Add theme selector to Navigation
<select onChange={(e) => setTheme(e.target.value)}>
  {Object.keys(themes).map(name => (
    <option key={name} value={name}>{name}</option>
  ))}
</select>
```

---

## Building Plugins

### Plugin Structure

```javascript
// plugins/my-plugin.js
export default function myPlugin(config = {}) {
  return {
    name: 'my-plugin',
    version: '1.0.0',
    
    // Lifecycle hooks
    onInit() {
      console.log('Plugin initialized');
    },
    
    onBeforeRender(data) {
      // Modify data before rendering
      return data;
    },
    
    onAfterRender() {
      // Perform actions after rendering
    },
    
    // Custom methods
    customMethod() {
      // Your custom functionality
    }
  };
}
```

### Example: SEO Plugin

```javascript
// plugins/seo-plugin.js
export default function seoPlugin(config = {}) {
  const {
    siteName = 'BasicBlog',
    twitterHandle = '',
    ogImage = '/og-image.png'
  } = config;

  return {
    name: 'seo',
    version: '1.0.0',
    
    addMetaTags(page) {
      const meta = {
        // Open Graph
        'og:title': page.title || siteName,
        'og:description': page.description || '',
        'og:image': ogImage,
        'og:type': 'website',
        
        // Twitter Card
        'twitter:card': 'summary_large_image',
        'twitter:site': twitterHandle,
        'twitter:title': page.title || siteName,
        'twitter:description': page.description || '',
        'twitter:image': ogImage,
      };
      
      Object.entries(meta).forEach(([property, content]) => {
        if (content) {
          const tag = document.createElement('meta');
          tag.setAttribute('property', property);
          tag.setAttribute('content', content);
          document.head.appendChild(tag);
        }
      });
    },
    
    generateSitemap(pages) {
      const urls = pages.map(page => ({
        loc: page.url,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: page.priority || 0.5
      }));
      
      return `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          ${urls.map(url => `
            <url>
              <loc>${url.loc}</loc>
              <lastmod>${url.lastmod}</lastmod>
              <changefreq>${url.changefreq}</changefreq>
              <priority>${url.priority}</priority>
            </url>
          `).join('')}
        </urlset>`;
    }
  };
}
```

### Example: Comments Plugin

```javascript
// plugins/comments-plugin.js
export default function commentsPlugin(config = {}) {
  const { provider = 'disqus', shortname = '' } = config;
  
  return {
    name: 'comments',
    version: '1.0.0',
    
    loadDisqus(pageUrl, pageId) {
      window.disqus_config = function () {
        this.page.url = pageUrl;
        this.page.identifier = pageId;
      };
      
      const script = document.createElement('script');
      script.src = `https://${shortname}.disqus.com/embed.js`;
      script.setAttribute('data-timestamp', +new Date());
      document.body.appendChild(script);
    },
    
    renderComments(containerId) {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = '<div id="disqus_thread"></div>';
        this.loadDisqus(window.location.href, containerId);
      }
    }
  };
}
```

---

## Adding New Content Types

### Step 1: Create Content Renderer

```javascript
// src/components/renderers/VideoRenderer.jsx
import React from 'react';

export function VideoRenderer({ content, title }) {
  return (
    <div className="video-container">
      {title && <h3>{title}</h3>}
      <video controls className="w-full rounded-lg">
        <source src={content} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
```

### Step 2: Update ContentRenderer

```javascript
// src/components/PaneGrid.jsx
import { VideoRenderer } from './renderers/VideoRenderer';

function ContentRenderer({ entry }) {
  const { type, content, title } = entry;

  const renderContent = () => {
    switch (type) {
      case 'video':
        return <VideoRenderer content={content} title={title} />;
      case 'markdown':
        return /* ... */;
      // ... other types
    }
  };
  
  return renderContent();
}
```

### Step 3: Update Validation

```javascript
// src/utils/configParser.js
export function parseEntries(entriesPath) {
  // ... existing code
  
  validatedEntries[paneId] = entries.filter((entry, index) => {
    const validTypes = ['text', 'markdown', 'html', 'video', 'image'];
    
    if (!entry.type || !validTypes.includes(entry.type)) {
      logWarn(`Entry at index ${index} has invalid type. Skipping.`);
      return false;
    }
    // ... rest of validation
  });
}
```

### Step 4: Use in entries.json

```json
{
  "main": [
    {
      "type": "video",
      "title": "Introduction Video",
      "content": "/videos/intro.mp4"
    }
  ]
}
```

---

## Custom Components

### Creating a Custom Card Component

```javascript
// src/components/custom/FeatureCard.jsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { cn } from '../../lib/utils';

export function FeatureCard({ icon, title, description, className }) {
  return (
    <Card className={cn(
      "group hover:scale-105 transition-transform duration-300",
      className
    )}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
```

### Using Custom Components

```javascript
// src/pages/HomePage.jsx
import { FeatureCard } from '../components/custom/FeatureCard';
import { Zap, Shield, Sparkles } from 'lucide-react';

export function HomePage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <FeatureCard
        icon={<Zap />}
        title="Fast"
        description="Lightning-fast performance"
      />
      <FeatureCard
        icon={<Shield />}
        title="Secure"
        description="Built with security in mind"
      />
      <FeatureCard
        icon={<Sparkles />}
        title="Beautiful"
        description="Stunning modern design"
      />
    </div>
  );
}
```

---

## Multi-Page Applications

### Step 1: Enable Multi-Page in config.yaml

```yaml
title: My Multi-Page Blog
multi_page: true
```

### Step 2: Define Routes in menu.json

```json
[
  { "label": "Home", "url": "/" },
  { "label": "Blog", "url": "/blog" },
  { "label": "About", "url": "/about" },
  { "label": "Contact", "url": "/contact" }
]
```

### Step 3: Create Page Components

```javascript
// src/pages/BlogPage.jsx
export function BlogPage({ panes, entries }) {
  return (
    <div>
      <h1>Blog</h1>
      <PaneGrid panes={panes} entries={entries} />
    </div>
  );
}

// src/pages/AboutPage.jsx
export function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>About Us</h1>
      <p>Welcome to our blog...</p>
    </div>
  );
}
```

### Step 4: Update App.jsx

```javascript
// src/App.jsx
import { BlogPage } from './pages/BlogPage';
import { AboutPage } from './pages/AboutPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}
```

---

## SEO Optimization

### 1. Meta Tags

```javascript
// src/utils/seo.js
export function updateMetaTags(page) {
  document.title = page.title;
  
  const metaTags = {
    description: page.description,
    keywords: page.keywords?.join(', '),
    author: page.author,
    'og:title': page.title,
    'og:description': page.description,
    'og:image': page.image,
  };
  
  Object.entries(metaTags).forEach(([name, content]) => {
    if (content) {
      let meta = document.querySelector(`meta[name="${name}"]`) ||
                 document.querySelector(`meta[property="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(name.startsWith('og:') ? 'property' : 'name', name);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    }
  });
}
```

### 2. Structured Data

```javascript
// Add JSON-LD structured data
export function addStructuredData(data) {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: data.title,
    description: data.description,
    author: {
      '@type': 'Person',
      name: data.author
    }
  });
  document.head.appendChild(script);
}
```

### 3. Sitemap Generation

```javascript
// scripts/generate-sitemap.js
import fs from 'fs';

const pages = [
  { url: '/', priority: 1.0 },
  { url: '/blog', priority: 0.8 },
  { url: '/about', priority: 0.5 },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
    <url>
      <loc>https://yourdomain.com${page.url}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>${page.priority}</priority>
    </url>
  `).join('')}
</urlset>`;

fs.writeFileSync('public/sitemap.xml', sitemap);
```

---

## Deployment

### Netlify

1. Build your blog:
```bash
npm run generate
cd build
npm install
npm run build
```

2. Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

3. Deploy:
```bash
netlify deploy --prod
```

### Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd build
vercel --prod
```

### GitHub Pages

1. Add to `package.json`:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

2. Install gh-pages:
```bash
npm install -D gh-pages
```

3. Deploy:
```bash
npm run deploy
```

### Custom Server (Node.js)

```javascript
// server.js
import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('dist'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## Advanced Customization

### Custom Build Process

```javascript
// scripts/custom-build.js
import { build } from 'vite';
import { parseConfig } from '../src/utils/configParser.js';

async function customBuild() {
  const config = parseConfig('./config.yaml');
  
  // Custom preprocessing
  console.log('Running custom build...');
  
  // Build with Vite
  await build({
    // Custom Vite config
    base: config.base_url || '/',
    build: {
      outDir: config.output_dir || 'dist',
    }
  });
  
  // Post-processing
  console.log('Build complete!');
}

customBuild();
```

### Environment Variables

```javascript
// .env
VITE_API_URL=https://api.example.com
VITE_GA_ID=GA-XXXXXXXXX

// Access in code
const apiUrl = import.meta.env.VITE_API_URL;
```

---

For more examples and detailed documentation, see the [API Documentation](./API.md).
