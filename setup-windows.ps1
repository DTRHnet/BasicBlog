# BasicBlog Setup Script for Windows
# PowerShell script to create a new BasicBlog project

# Colors
$colors = @{
  Reset   = "`e[0m"
  Red     = "`e[31m"
  Green   = "`e[32m"
  Yellow  = "`e[33m"
  Blue    = "`e[34m"
  Magenta = "`e[35m"
  Cyan    = "`e[36m"
  White   = "`e[37m"
  Bold    = "`e[1m"
}

# ASCII Art Banner
function Show-Banner {
  Write-Host ""
  Write-Host "$($colors.Cyan)" -NoNewline
  Write-Host "    ____  ___   _____ ____  ______ __               " 
  Write-Host "   / __ )/   | / ___//  _/ / ____// /_   ____ _____ "
  Write-Host "  / __  / /| | \__ \ / /  / /    / __ \ / __ \`/ __ \"
  Write-Host " / /_/ / ___ |___/ // /  / /___ / /_/ // /_/ / /_/ /"
  Write-Host "/_____/_/  |_/____/___/  \____//_.___/ \____/\__, / "
  Write-Host "                                            /____/  "
  Write-Host "$($colors.Reset)"
  Write-Host "$($colors.Magenta)           A DTRH.net Project$($colors.Reset)"
  Write-Host "$($colors.White)      admin [AT] dtrh [dot] net$($colors.Reset)"
  Write-Host ""
}

# Display banner
Show-Banner

Write-Host "$($colors.Bold)$($colors.Green)Welcome to BasicBlog Setup!$($colors.Reset)"
Write-Host "$($colors.White)This script will help you create a new BasicBlog project.$($colors.Reset)"
Write-Host ""

# Get project name
$projectName = Read-Host "$($colors.Yellow)Enter your project name$($colors.Reset)"
if ([string]::IsNullOrWhiteSpace($projectName)) {
  Write-Host "$($colors.Red)Error: Project name cannot be empty.$($colors.Reset)"
  exit 1
}

# Sanitize project name (replace spaces with underscores)
$sanitizedName = $projectName -replace '\s+', '_'
if ($sanitizedName -ne $projectName) {
  Write-Host "$($colors.Cyan)Note: Spaces replaced with underscores: $sanitizedName$($colors.Reset)"
}

# Get project location
$defaultLocation = Join-Path $env:USERPROFILE $sanitizedName
Write-Host "$($colors.Yellow)Enter project location (press Enter for default)$($colors.Reset)"
Write-Host "$($colors.White)Default: $defaultLocation$($colors.Reset)"
$projectLocation = Read-Host "Location"

if ([string]::IsNullOrWhiteSpace($projectLocation)) {
  $projectLocation = $defaultLocation
}

# Resolve full path
$projectPath = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($projectLocation)

Write-Host ""
Write-Host "$($colors.Bold)$($colors.Cyan)Project Configuration:$($colors.Reset)"
Write-Host "  Name: $($colors.Green)$sanitizedName$($colors.Reset)"
Write-Host "  Path: $($colors.Green)$projectPath$($colors.Reset)"
Write-Host ""

Write-Host "$($colors.Bold)$($colors.Green)Creating project...$($colors.Reset)"
Write-Host ""

# Check if directory exists
if (Test-Path $projectPath) {
  Write-Host "$($colors.Red)Error: Directory already exists: $projectPath$($colors.Reset)"
  $overwrite = Read-Host "$($colors.Yellow)Overwrite? (y/N)$($colors.Reset)"
  if ($overwrite -ne 'y' -and $overwrite -ne 'Y') {
    Write-Host "$($colors.Red)Setup cancelled.$($colors.Reset)"
    exit 1
  }
  Remove-Item -Path $projectPath -Recurse -Force
}

# Create project directory
Write-Host "$($colors.Cyan)→ Creating project directory...$($colors.Reset)"
New-Item -ItemType Directory -Path $projectPath -Force | Out-Null

# Create themes directory
Write-Host "$($colors.Cyan)→ Creating theme structure...$($colors.Reset)"
$themeDir = Join-Path $projectPath "themes" "basic"
New-Item -ItemType Directory -Path $themeDir -Force | Out-Null

# Get the directory where this script is located (BasicBlog root)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Check if we're in the BasicBlog directory
if (-not (Test-Path (Join-Path $scriptDir "cli.js"))) {
  Write-Host "$($colors.Red)Error: This script must be run from the BasicBlog root directory.$($colors.Reset)"
  exit 1
}

# Create config files
Write-Host "$($colors.Cyan)→ Creating configuration files...$($colors.Reset)"

# config.yaml (Root)
$configContent = @"
title: $sanitizedName
theme: basic
output_dir: ./build
multi_page: false
author: Your Name
description: Welcome to $sanitizedName - A blog powered by BasicBlog
"@
Set-Content -Path (Join-Path $projectPath "config.yaml") -Value $configContent

# menu.json (Root)
$menuContent = @"
[
  {
    "label": "Home",
    "url": "/"
  },
  {
    "label": "About",
    "url": "#about"
  },
  {
    "label": "Blog",
    "url": "#blog"
  },
  {
    "label": "Contact",
    "url": "#contact"
  }
]
"@
Set-Content -Path (Join-Path $projectPath "menu.json") -Value $menuContent

# panes.cfg (Theme - themes/basic/panes.cfg)
$panesContent = @"
# Basic Theme Layout
# Header
|header 100 15 dock:top|
# Content
|sidebar 25|main|
# Footer
|footer 100 dock:bottom|
"@
Set-Content -Path (Join-Path $themeDir "panes.cfg") -Value $panesContent

# Create Advanced Theme
$advancedThemeDir = Join-Path $projectPath "themes" "advanced"
New-Item -ItemType Directory -Path $advancedThemeDir -Force | Out-Null

$advancedPanesContent = @"
# Advanced Theme Layout
# Top Nav
|nav 100 8 dock:top|
# Hero
|hero 100 30 dock:top|
# Sidebars
|left-panel 20 dock:left|
|right-panel 20 dock:right|
# Main
|main-content|
# Status
|status-bar 100 5 dock:bottom|
"@
Set-Content -Path (Join-Path $advancedThemeDir "panes.cfg") -Value $advancedPanesContent

# entries.json (Root)
$entriesContent = @"
{
  "header": [
    {
      "type": "html",
      "content": "<div style='text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px;'><h1 style='margin: 0; font-size: 2.5rem;'>$sanitizedName</h1><p style='margin: 10px 0 0 0;'>Powered by BasicBlog</p></div>"
    }
  ],
  "sidebar": [
    {
      "type": "markdown",
      "title": "Theme System",
      "content": "## Themes\n\nThis blog has multiple themes installed!\n\n- **basic** (Active)\n- **advanced**\n\nTry switching in config.yaml!"
    }
  ],
  "main": [
    {
      "type": "markdown",
      "title": "Getting Started",
      "content": "# Hello, World!\n\nWelcome to your new blog powered by **BasicBlog**.\n\n## Theme System\n\nYou have two themes installed by default:\n1. **basic**: A simple sidebar layout (Active)\n2. **advanced**: A complex dashboard-style layout\n\n### Try switching themes!\n1. Open config.yaml\n2. Change theme: basic to theme: advanced\n3. Run basicblog generate\n\nEnjoy! 🎉"
    }
  ],
  "footer": [
    {
      "type": "text",
      "content": "© 2025 $sanitizedName | Powered by BasicBlog"
    }
  ]
}
"@
Set-Content -Path (Join-Path $projectPath "entries.json") -Value $entriesContent

Write-Host "$($colors.Green)✓ Configuration files created$($colors.Reset)"
Write-Host ""
Write-Host "$($colors.Bold)$($colors.Green)Initializing Project...$($colors.Reset)"

# Store original location
$originalLocation = Get-Location

# Navigate to project
Set-Location $projectPath

Write-Host "$($colors.Cyan)→ Generating blog...$($colors.Reset)"
$cliPath = Join-Path $scriptDir "cli.js"

# Execute Generate
node $cliPath generate .

if ($LASTEXITCODE -ne 0) {
  Write-Host "$($colors.Red)Error: Blog generation failed.$($colors.Reset)"
  exit 1
}

Write-Host "$($colors.Cyan)→ Installing dependencies in build/...$($colors.Reset)"
Set-Location "build"
npm install

Write-Host ""
Write-Host "$($colors.Bold)$($colors.Green)═══════════════════════════════════════$($colors.Reset)"
Write-Host "$($colors.Bold)$($colors.Green)  Project successfully created and built! 🎉$($colors.Reset)"
Write-Host "$($colors.Bold)$($colors.Green)═══════════════════════════════════════$($colors.Reset)"
Write-Host ""
Write-Host "Starting development server..."
Write-Host "$($colors.Yellow)Press Ctrl+C to stop the server.$($colors.Reset)"
Write-Host ""

npm run dev

# Reset location
Set-Location $originalLocation
