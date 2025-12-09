# 🎨 BasicBlog Theme System

The BasicBlog Theme System is designed to be **simple** yet **powerful**. It effectively allows you to override any configuration file by placing it in a theme folder.

## 📂 Structure

When you create a new blog, you will see a `themes/` directory:

```
my-blog/
├── config.yaml          # Sets "theme: basic"
├── menu.json            # Global menu
├── entries.json         # Global content
└── themes/
    └── basic/           # The "basic" theme
        └── panes.cfg    # Layout definition
```

## 🚀 How it Works (The "YOLO" Logic)

When `basicblog generate` runs, it looks at `config.yaml` to see which theme is active (e.g., `theme: basic`).

For every configuration file (`panes.cfg`, `menu.json`, `entries.json`), it follows this logic:

1.  **Check Theme Folder**: Does `themes/<theme>/<file>` exist?
    *   **Yes?** Use it! (It overrides everything)
    *   **No?** Check root folder.
2.  **Check Root Folder**: Does `./<file>` exist?
    *   **Yes?** Use it.
    *   **No?** Error (or empty default).

This means you can have a "Base" configuration in your root folder, and only override specific files in your theme.

## 🛠️ Customizing Your Theme

### 1. Changing the Layout
The `panes.cfg` file controls the grid layout. By default, it lives in `themes/basic/panes.cfg`.

**Edit `themes/basic/panes.cfg`:**
```ini
# Add a top navigation bar
|nav 100 10 dock:top| 

# Make the sidebar larger
|sidebar 30|main 70|

# Footer docked to bottom
|footer 100 dock:bottom|
```

### 2. Creating a New Theme
Want to try a crazy new layout without breaking your current one?

1.  Create a folder: `themes/experimental/`
2.  Create `themes/experimental/panes.cfg`:
    ```ini
    |main 100|
    |footer 100 20|
    ```
3.  Edit `config.yaml`:
    ```yaml
    theme: experimental
    ```
4.  Run `basicblog generate`.

**Boom!** Your blog is now using the experimental layout. Your original `basic` theme is safe.

### 3. Theme-Specific Content
You can even have different content for different themes.

*   Copy `entries.json` to `themes/experimental/entries.json`.
*   Change the "Welcome" message in the new file.
*   When you switch to `experimental`, the new content appears. When you switch back to `basic`, the original content returns.

## 📦 What can be themed?

| File | Purpose | Can be Themed? |
|------|---------|----------------|
| `panes.cfg` | Layout Grid | ✅ YES (Recommended) |
| `menu.json` | Navigation Links | ✅ YES |
| `entries.json` | Content | ✅ YES |
| `config.yaml` | Blog Meta | ❌ NO (This defines the theme) |

## 🌟 Best Practices

1.  **Keep Content Global**: Usually, you want your blog posts (`entries.json`) and menu (`menu.json`) to be the same regardless of the layout. Keep these in the **root** folder.
2.  **Theme the Layout**: Put `panes.cfg` in the **theme** folder. This allows you to switch visual structures easily.
3.  **Use Git**: Commiting your themes allows you to share them with others!

## 🔧 Troubleshooting

*   **"Theme not found"**: Ensure the folder name in `themes/` matches the `theme:` value in `config.yaml` exactly.
*   **"File used from root"**: If you check the build logs, it will tell you exactly which file calls are being served from the theme vs the root.

```
[INFO] Using Theme: basic
[INFO]    Using root version of menu.json
[INFO]    Using theme version of panes.cfg  <-- Overridden!
[INFO]    Using root version of entries.json
```
