#!/bin/bash
# BasicBlog Setup Script for Linux/WSL
# Bash script to create a new BasicBlog project and start it

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
BOLD='\033[1m'
RESET='\033[0m'

# ASCII Art Banner
show_banner() {
    echo ""
    echo -e "${CYAN}    ____  ___   _____ ____  ______ __               ${RESET}"
    echo -e "${CYAN}   / __ )/   | / ___//  _/ / ____// /_   ____ _____ ${RESET}"
    echo -e "${CYAN}  / __  / /| | \__ \ / /  / /    / __ \ / __ \`/ __ \\${RESET}"
    echo -e "${CYAN} / /_/ / ___ |___/ // /  / /___ / /_/ // /_/ / /_/ /${RESET}"
    echo -e "${CYAN}/_____/_/  |_/____/___/  \____//_.___/ \____/\__, / ${RESET}"
    echo -e "${CYAN}                                            /____/  ${RESET}"
    echo ""
    echo -e "${MAGENTA}           A DTRH.net Project${RESET}"
    echo -e "${WHITE}      admin [AT] dtrh [dot] net${RESET}"
    echo ""
}

# Display banner
show_banner

echo -e "${BOLD}${GREEN}Welcome to BasicBlog Setup!${RESET}"
echo -e "${WHITE}This script will help you create a new BasicBlog project.${RESET}"
echo ""

# Get project name
echo -e -n "${YELLOW}Enter your project name: ${RESET}"
read project_name

if [ -z "$project_name" ]; then
    echo -e "${RED}Error: Project name cannot be empty.${RESET}"
    exit 1
fi

# Sanitize project name (replace spaces with underscores)
sanitized_name=$(echo "$project_name" | tr ' ' '_')
if [ "$sanitized_name" != "$project_name" ]; then
    echo -e "${CYAN}Note: Spaces replaced with underscores: $sanitized_name${RESET}"
fi

# Get project location
default_location="$HOME/$sanitized_name"
echo -e "${YELLOW}Enter project location (press Enter for default)${RESET}"
echo -e "${WHITE}Default: $default_location${RESET}"
echo -e -n "Location: "
read project_location

if [ -z "$project_location" ]; then
    project_location="$default_location"
fi

# Resolve full path
project_path=$(eval echo "$project_location")

echo ""
echo -e "${BOLD}${CYAN}Project Configuration:${RESET}"
echo -e "  Name: ${GREEN}$sanitized_name${RESET}"
echo -e "  Path: ${GREEN}$project_path${RESET}"
echo ""

echo -e "${BOLD}${GREEN}Creating project...${RESET}"
echo ""

# Check if directory exists
if [ -d "$project_path" ]; then
    echo -e "${RED}Error: Directory already exists: $project_path${RESET}"
    echo -e -n "${YELLOW}Overwrite? (y/N): ${RESET}"
    read overwrite
    if [ "$overwrite" != "y" ] && [ "$overwrite" != "Y" ]; then
        echo -e "${RED}Setup cancelled.${RESET}"
        exit 1
    fi
    rm -rf "$project_path"
fi

# Create project directory
echo -e "${CYAN}→ Creating project directory...${RESET}"
mkdir -p "$project_path"

# Create themes structure
echo -e "${CYAN}→ Creating theme structure...${RESET}"
mkdir -p "$project_path/themes/basic"

# Get the directory where this script is located (BasicBlog root)
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check if we're in the BasicBlog directory
if [ ! -f "$script_dir/cli.js" ]; then
    echo -e "${RED}Error: This script must be run from the BasicBlog root directory.${RESET}"
    exit 1
fi

# Create config files
echo -e "${CYAN}→ Creating configuration files...${RESET}"

# config.yaml (Root)
cat > "$project_path/config.yaml" << EOF
title: $sanitized_name
theme: basic
output_dir: ./build
multi_page: false
author: Your Name
description: Welcome to $sanitized_name - A blog powered by BasicBlog
EOF

# menu.json (Root)
cat > "$project_path/menu.json" << 'EOF'
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
EOF

# panes.cfg (Theme - themes/basic/panes.cfg)
cat > "$project_path/themes/basic/panes.cfg" << 'EOF'
# Basic Theme Layout
# Header
|header 100 15 dock:top|
# Content
|sidebar 25|main|
# Footer
|footer 100 dock:bottom|
EOF

# Create Advanced Theme
mkdir -p "$project_path/themes/advanced"
cat > "$project_path/themes/advanced/panes.cfg" << 'EOF'
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
EOF

# entries.json (Root)
cat > "$project_path/entries.json" << 'EOF'
{
  "header": [
    {
      "type": "html",
      "content": "<div style='text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px;'><h1 style='margin: 0; font-size: 2.5rem;'>PROJECT_NAME_PLACEHOLDER</h1><p style='margin: 10px 0 0 0;'>Powered by BasicBlog</p></div>"
    }
  ],
  "sidebar": [
    {
      "type": "markdown",
      "title": "Theme System",
      "content": "## Themes\n\nThis blog has multiple themes installed!\n\n- **basic** (Active)\n- **advanced**\n\nTry switching in `config.yaml`!"
    }
  ],
  "main": [
    {
      "type": "markdown",
      "title": "Getting Started",
      "content": "# Hello, World!\n\nWelcome to your new blog powered by **BasicBlog**.\n\n## Theme System\n\nYou have two themes installed by default:\n1. **basic**: A simple sidebar layout (Active)\n2. **advanced**: A complex dashboard-style layout\n\n### Try switching themes!\n1. Open `config.yaml`\n2. Change `theme: basic` to `theme: advanced`\n3. Run `basicblog generate`\n\nEnjoy! 🎉"
    }
  ],
  "footer": [
    {
      "type": "text",
      "content": "© 2025 PROJECT_NAME_PLACEHOLDER | Powered by BasicBlog"
    }
  ]
}
EOF

# Replace placeholder with actual project name
sed -i "s/PROJECT_NAME_PLACEHOLDER/$sanitized_name/g" "$project_path/entries.json"

echo -e "${GREEN}✓ Configuration files created${RESET}"
echo ""
echo -e "${BOLD}${GREEN}Initializing Project...${RESET}"

# Navigate to project directory
cd "$project_path"

echo -e "${CYAN}→ Installing BasicBlog CLI locally...${RESET}"

CLI_PATH="$script_dir/cli.js"

echo -e "${CYAN}→ Generating blog...${RESET}"
node "$CLI_PATH" generate .

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Blog generation failed.${RESET}"
    exit 1
fi

echo -e "${CYAN}→ Installing dependencies in build/...${RESET}"
cd build
npm install

echo -e ""
echo -e "${BOLD}${GREEN}═══════════════════════════════════════${RESET}"
echo -e "${BOLD}${GREEN}  Project successfully created and built! 🎉${RESET}"
echo -e "${BOLD}${GREEN}═══════════════════════════════════════${RESET}"
echo -e ""
echo -e "Starting development server..."
echo -e "${YELLOW}Press Ctrl+C to stop the server.${RESET}"
echo -e ""

npm run dev
