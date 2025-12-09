# BasicBlog Advanced Panes System - Feature Update

## 🎉 New Features Implemented

### 1. **Multi-Row Layouts** ✅
Panes can now be organized into rows! Each line in `panes.cfg` represents a separate row.

**Example:**
```
|header 100 15|
|sidebar 25|main 50|footer 25|
|bottom-nav 100|
```

This creates:
- Row 1: Full-width header
- Row 2: Three-column layout
- Row 3: Full-width bottom navigation

### 2. **Height Percentages** ✅
Specify height as a percentage of viewport height (vh).

**Format:** `|pane_name width% height%|`

**Examples:**
```
|header 100 10|     # 100% width, 10% height
|sidebar 25 80|     # 25% width, 80% height
|main|              # Auto width, auto height (fits content)
```

**How it works:**
- If height is specified, pane has fixed height with scrollable overflow
- If height is omitted, pane expands to fit content
- Height applies to the entire row if any pane in the row has it

### 3. **Docking Positions** ✅
Dock panes to specific positions: top, bottom, left, or right.

**Format:** `|pane_name width% dock:position|`

**Supported positions:**
- `dock:top` - Always at the top
- `dock:bottom` - Always at the bottom
- `dock:left` - Always on the left
- `dock:right` - Always on the right

**Examples:**
```
|header 100 dock:top|
|footer 100 dock:bottom|
|sidebar 20 dock:left|
|ads 15 dock:right|
```

### 4. **Strict Validation** ✅
Enhanced error checking with clear messages.

**Validates:**
- ✅ Panes in `entries.json` must exist in `panes.cfg`
- ✅ Panes in `panes.cfg` should have entries (warns if empty)
- ✅ No duplicate pane names
- ✅ Valid width/height ranges (1-100)
- ✅ Valid dock positions

**Error Messages:**
```
❌ ERROR: entries.json references pane 'sidebar' which is not defined in panes.cfg.
⚠️  WARNING: Pane 'footer' defined in panes.cfg has no entries in entries.json.
❌ VALIDATION FAILED: Pane/Entry mismatch detected.
```

## 📝 Complete Format Specification

### Basic Syntax
```
|pane_name [width%] [height%] [dock:position]|
```

### Parameters

| Parameter | Required | Format | Range | Default |
|-----------|----------|--------|-------|---------|
| name | ✅ Yes | Alphanumeric, -, _ | - | - |
| width | ❌ No | Integer | 1-100 | Auto-calculated |
| height | ❌ No | Integer | 1-100 | Auto (fits content) |
| dock | ❌ No | dock:position | top/bottom/left/right | none |

### Examples

**Simple single pane:**
```
|main|
```

**Two columns:**
```
|sidebar 30|main|
```

**With height:**
```
|header 100 15|
|content 100 70|
|footer 100 15|
```

**With docking:**
```
|nav 100 dock:top|
|main|
|footer 100 dock:bottom|
```

**Complex layout:**
```
# Header with fixed height
|header 100 10 dock:top|

# Main content area
|sidebar 20|main 60|ads 20|

# Footer docked to bottom
|footer 100 5 dock:bottom|
```

## 🎨 Visual Examples

### Example 1: Blog Layout
```
|header 100 15|
|sidebar 25|main 50|related 25|
|footer 100|
```

Result:
```
┌─────────────────────────────────────┐
│           Header (15vh)             │
├────────┬──────────────┬─────────────┤
│Sidebar │     Main     │   Related   │
│  (25%) │     (50%)    │    (25%)    │
│        │              │             │
├────────┴──────────────┴─────────────┤
│           Footer (auto)             │
└─────────────────────────────────────┘
```

### Example 2: Dashboard Layout
```
|top-nav 100 8 dock:top|
|side-menu 15|dashboard 70|widgets 15|
|status-bar 100 5 dock:bottom|
```

Result:
```
┌─────────────────────────────────────┐ ← Docked top
│         Top Nav (8vh)               │
├────┬──────────────────────┬─────────┤
│Side│     Dashboard        │ Widgets │
│Menu│       (70%)          │  (15%)  │
│15% │                      │         │
├────┴──────────────────────┴─────────┤
│      Status Bar (5vh)               │ ← Docked bottom
└─────────────────────────────────────┘
```

## 🔧 Implementation Details

### Row-Based Structure
Panes are now organized into rows:
```javascript
[
  {
    row: 0,
    panes: [{ name: 'header', width: 100, height: 15, dock: null }],
    height: 15
  },
  {
    row: 1,
    panes: [
      { name: 'sidebar', width: 25, height: null, dock: null },
      { name: 'main', width: 50, height: null, dock: null },
      { name: 'footer', width: 25, height: null, dock: null }
    ],
    height: null
  }
]
```

### Backward Compatibility
- Old format still works: `|pane1|pane2|`
- Automatically converted to single-row layout
- `flattenPanes()` function provides legacy panes array

### CSS Implementation
- Heights use `vh` units (viewport height)
- Docking uses CSS `order` property
- Responsive: stacks vertically on mobile (<1024px)
- Overflow: auto for fixed-height panes

## 📚 Usage Guide

### Step 1: Define Layout in panes.cfg
```
# Header
|header 100 12|

# Main content
|sidebar 25|content|

# Footer
|footer 100 dock:bottom|
```

### Step 2: Add Content in entries.json
```json
{
  "header": [
    { "type": "html", "content": "<h1>My Blog</h1>" }
  ],
  "sidebar": [
    { "type": "markdown", "content": "## Navigation\n..." }
  ],
  "content": [
    { "type": "markdown", "content": "# Welcome\n..." }
  ],
  "footer": [
    { "type": "text", "content": "© 2025" }
  ]
}
```

### Step 3: Generate
```bash
basicblog generate
```

### Step 4: Verify
Check logs for validation:
```
✅ Validation passed: All panes and entries are properly matched.
```

## ⚠️ Common Errors & Solutions

### Error: Pane not defined
```
❌ ERROR: entries.json references pane 'sidebar' which is not defined in panes.cfg.
```
**Solution:** Add `sidebar` to panes.cfg or remove it from entries.json

### Warning: Empty pane
```
⚠️  WARNING: Pane 'footer' has no entries.
```
**Solution:** Add content to `footer` in entries.json or remove the pane

### Error: Duplicate name
```
❌ ERROR: Duplicate pane name 'main' found.
```
**Solution:** Ensure each pane has a unique name

### Warning: Invalid width
```
⚠️  WARNING: Invalid width '150' for pane 'sidebar'. Using auto width.
```
**Solution:** Use width between 1-100

## 🎯 Best Practices

1. **Use descriptive names:**
   ```
   |top-header|main-content|right-sidebar|
   ```

2. **Keep heights reasonable:**
   ```
   |header 100 10|   # ✅ Good
   |header 100 90|   # ❌ Too tall
   ```

3. **Don't over-dock:**
   ```
   # ✅ Good - 1-2 docked panes
   |nav 100 dock:top|
   |footer 100 dock:bottom|
   
   # ❌ Bad - everything docked
   |a 25 dock:left|
   |b 25 dock:right|
   |c 25 dock:top|
   |d 25 dock:bottom|
   ```

4. **Test on mobile:**
   - Panes stack vertically
   - Order matters
   - Fixed heights may need adjustment

5. **Match panes and entries:**
   - Every pane should have content
   - Every content should have a pane
   - Use validation to catch mismatches

## 🚀 Migration Guide

### From Old Format
**Old (single row):**
```
|sidebar 25|main 50|footer 25|
```

**New (same result):**
```
|sidebar 25|main 50|footer 25|
```
No changes needed! Old format still works.

### Adding Rows
**Old:**
```
|sidebar 20|main|
```

**New (with header):**
```
|header 100 15|
|sidebar 20|main|
```

### Adding Heights
**Old:**
```
|main|
```

**New:**
```
|main 100 80|
```

### Adding Docking
**Old:**
```
|nav|
|main|
```

**New:**
```
|nav 100 dock:top|
|main|
```

## 📊 Feature Comparison

| Feature | Old System | New System |
|---------|------------|------------|
| Rows | Single row only | Multiple rows ✅ |
| Heights | Auto only | Fixed or auto ✅ |
| Docking | No | Yes (4 positions) ✅ |
| Validation | Basic | Strict with errors ✅ |
| Width calc | Yes | Yes (enhanced) ✅ |
| Responsive | Yes | Yes (improved) ✅ |

## 🎉 Summary

The enhanced panes system provides:
- ✅ Multi-row layouts for complex designs
- ✅ Height control for fixed-size sections
- ✅ Docking for persistent UI elements
- ✅ Strict validation to catch errors early
- ✅ Backward compatibility with old configs
- ✅ Clear error messages for debugging

**Result:** More powerful, flexible, and robust layout system! 🚀
