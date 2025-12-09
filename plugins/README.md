# Plugins Directory

This directory contains plugins that extend BasicBlog functionality.

## What are Plugins?

Plugins are modular extensions that add custom features to your blog without modifying core code.

## Available Plugins

### analytics-plugin.js

Adds analytics tracking (Google Analytics) to your blog.

**Usage:**
```javascript
import analyticsPlugin from './plugins/analytics-plugin.js';

const analytics = analyticsPlugin();
analytics.addGoogleAnalytics('GA-XXXXXXXXX');
analytics.trackPageView('/');
```

## Creating Your Own Plugin

### Basic Plugin Structure

```javascript
// plugins/my-plugin.js
export default function myPlugin(config = {}) {
  console.log('My plugin loaded!');
  
  return {
    name: 'my-plugin',
    version: '1.0.0',
    
    // Your plugin methods
    doSomething() {
      console.log('Doing something...');
    }
  };
}
```

### Plugin Best Practices

1. **Export a default function** that returns a plugin object
2. **Include name and version** in the returned object
3. **Accept configuration** as the first parameter
4. **Document your plugin** with JSDoc comments
5. **Handle errors gracefully** with try-catch blocks
6. **Log important events** for debugging

### Example: Custom Theme Plugin

```javascript
// plugins/theme-plugin.js
/**
 * Theme Plugin
 * Adds custom theme switching functionality
 * @param {Object} config - Plugin configuration
 * @param {Array} config.themes - Available themes
 */
export default function themePlugin(config = {}) {
  const { themes = ['light', 'dark'] } = config;
  
  return {
    name: 'theme-plugin',
    version: '1.0.0',
    
    /**
     * Get available themes
     * @returns {Array} List of theme names
     */
    getThemes() {
      return themes;
    },
    
    /**
     * Apply a theme
     * @param {string} themeName - Name of theme to apply
     */
    applyTheme(themeName) {
      if (!themes.includes(themeName)) {
        console.warn(`Theme '${themeName}' not found`);
        return;
      }
      
      document.documentElement.setAttribute('data-theme', themeName);
      localStorage.setItem('preferred-theme', themeName);
      console.log(`Applied theme: ${themeName}`);
    },
    
    /**
     * Get saved theme preference
     * @returns {string} Saved theme name
     */
    getSavedTheme() {
      return localStorage.getItem('preferred-theme') || themes[0];
    }
  };
}
```

### Example: Search Plugin

```javascript
// plugins/search-plugin.js
/**
 * Search Plugin
 * Adds search functionality to blog content
 */
export default function searchPlugin() {
  let searchIndex = [];
  
  return {
    name: 'search-plugin',
    version: '1.0.0',
    
    /**
     * Index content for searching
     * @param {Array} entries - Content entries to index
     */
    indexContent(entries) {
      searchIndex = [];
      
      Object.entries(entries).forEach(([paneId, paneEntries]) => {
        paneEntries.forEach((entry, index) => {
          searchIndex.push({
            id: `${paneId}-${index}`,
            pane: paneId,
            type: entry.type,
            title: entry.title || '',
            content: entry.content,
          });
        });
      });
      
      console.log(`Indexed ${searchIndex.length} entries`);
    },
    
    /**
     * Search indexed content
     * @param {string} query - Search query
     * @returns {Array} Matching entries
     */
    search(query) {
      if (!query || query.trim() === '') {
        return [];
      }
      
      const lowerQuery = query.toLowerCase();
      
      return searchIndex.filter(entry => {
        const titleMatch = entry.title.toLowerCase().includes(lowerQuery);
        const contentMatch = entry.content.toLowerCase().includes(lowerQuery);
        return titleMatch || contentMatch;
      });
    },
    
    /**
     * Get search suggestions
     * @param {string} partial - Partial search query
     * @returns {Array} Suggested queries
     */
    getSuggestions(partial) {
      if (!partial || partial.length < 2) {
        return [];
      }
      
      const words = new Set();
      const lowerPartial = partial.toLowerCase();
      
      searchIndex.forEach(entry => {
        const allText = `${entry.title} ${entry.content}`;
        const textWords = allText.toLowerCase().split(/\s+/);
        
        textWords.forEach(word => {
          if (word.startsWith(lowerPartial) && word.length > partial.length) {
            words.add(word);
          }
        });
      });
      
      return Array.from(words).slice(0, 5);
    }
  };
}
```

## Plugin Hooks

Plugins can hook into various lifecycle events:

### Available Hooks

- `onInit`: Called when plugin is initialized
- `onBeforeRender`: Called before content is rendered
- `onAfterRender`: Called after content is rendered
- `onThemeChange`: Called when theme changes
- `onRouteChange`: Called when route changes (multi-page mode)

### Using Hooks

```javascript
export default function myPlugin() {
  return {
    name: 'my-plugin',
    
    onInit() {
      console.log('Plugin initialized');
    },
    
    onBeforeRender(data) {
      // Modify data before rendering
      console.log('About to render:', data);
      return data;
    },
    
    onAfterRender() {
      // Perform actions after rendering
      console.log('Rendering complete');
    }
  };
}
```

## Loading Plugins

### Method 1: Import in App.jsx

```javascript
// src/App.jsx
import myPlugin from '../plugins/my-plugin.js';

function App() {
  useEffect(() => {
    const plugin = myPlugin({ option: 'value' });
    plugin.doSomething();
  }, []);
  
  // ... rest of app
}
```

### Method 2: Dynamic Import

```javascript
// Load plugins dynamically
async function loadPlugins() {
  const pluginFiles = ['analytics-plugin', 'search-plugin'];
  
  for (const file of pluginFiles) {
    try {
      const module = await import(`./plugins/${file}.js`);
      const plugin = module.default();
      console.log(`Loaded plugin: ${plugin.name}`);
    } catch (err) {
      console.error(`Failed to load plugin ${file}:`, err);
    }
  }
}
```

## Plugin Configuration

Create a plugin config file:

```json
// plugins/config.json
{
  "enabled": [
    {
      "name": "analytics",
      "config": {
        "trackingId": "GA-XXXXXXXXX"
      }
    },
    {
      "name": "search",
      "config": {
        "minQueryLength": 2,
        "maxResults": 10
      }
    }
  ]
}
```

## Testing Plugins

```javascript
// tests/plugins/my-plugin.test.js
import myPlugin from '../../plugins/my-plugin.js';

describe('My Plugin', () => {
  test('should initialize correctly', () => {
    const plugin = myPlugin();
    expect(plugin.name).toBe('my-plugin');
    expect(plugin.version).toBeDefined();
  });
  
  test('should perform expected action', () => {
    const plugin = myPlugin();
    const result = plugin.doSomething();
    expect(result).toBeDefined();
  });
});
```

## Contributing Plugins

If you create a useful plugin, consider sharing it:

1. Document your plugin thoroughly
2. Add tests
3. Include usage examples
4. Submit a pull request

## Resources

- [Extension Guide](../docs/EXTENSION_GUIDE.md)
- [API Documentation](../docs/API.md)
- [Main README](../README.md)

---

**Happy plugin development! 🚀**
