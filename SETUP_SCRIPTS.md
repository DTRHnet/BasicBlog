# BasicBlog Setup Scripts

Interactive automation scripts to instantly create, build, and launch new BasicBlog projects.

## 🪟 Windows (PowerShell)

### Usage

```powershell
.\setup-windows.ps1
```

### Requirements
- PowerShell 5.1 or later
- Node.js installed

### What it does
1. Asks for project name and location
2. Creates project directory and config files
3. **Automatically runs** `basicblog generate`
4. **Automatically runs** `npm install`
5. **Automatically starts** the dev server (`npm run dev`)

### Example

```powershell
PS> .\setup-windows.ps1

... (Banner) ...

Welcome to BasicBlog Setup!
Enter your project name: My Blog

...

→ Creating project directory...
→ Creating configuration files...
✓ Configuration files created
Initializing Project...
→ Generating blog...
→ Installing dependencies...

Project successfully created and built! 🎉
Starting development server...
```

## 🐧 Linux / WSL (Bash)

### Usage

```bash
chmod +x setup-linux.sh
./setup-linux.sh
```

### Requirements
- Bash
- Node.js installed

### What it does
1. Asks for project name and location
2. Creates project directory and config files
3. **Automatically runs** `basicblog generate`
4. **Automatically runs** `npm install`
5. **Automatically starts** the dev server (`npm run dev`)

### Example

```bash
$ ./setup-linux.sh

... (Banner) ...

Welcome to BasicBlog Setup!
Enter your project name: My Blog

...

→ Creating project directory...
→ Creating configuration files...
✓ Configuration files created
Initializing Project...
→ Generating blog...
→ Installing dependencies...
Starting development server...
```

## 📝 Configuration Files Created

The scripts create a fully working blog with:
- **Twice-Column Layout** (Header, Sidebar+Main, Footer)
- **Sample Content** in `entries.json`
- **Menu** in `menu.json`
- **Config** in `config.yaml`

## 🚀 After Setup

The script leaves the dev server running. When you stop it (Ctrl+C), you can resume working on your blog:

```bash
cd <your-project-path>

# Edit config files...

# Regenerate
basicblog generate

# Run dev server again
cd build
npm run dev
```

## 🔧 Troubleshooting

### "Bad escaped character in JSON"
This has been fixed in the latest version by using safe string generation. If you see this, ensure you are using the latest `setup-linux.sh`.

### "Execution Policy" (Windows)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### "Permission Denied" (Linux)
```bash
chmod +x setup-linux.sh
```

---

**BasicBlog** - A DTRH.net Project  
admin [AT] dtrh [dot] net
