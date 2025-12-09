#!/usr/bin/env node

import { Command } from 'commander';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { parseConfig, parseMenu, parseEntries } from './src/utils/configParser.js';
import { parsePanes, validateEntriesAgainstPanes, flattenPanes } from './src/utils/panesParser.js';
import { logInfo, logWarn, logError } from './src/utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

/**
 * Generate the blog application
 * @param {string} configDir - Directory containing configuration files
 * @param {Object} options - Command options
 */
async function generateBlog(configDir, options) {
    try {
        logInfo('Starting BasicBlog generation...');
        logInfo(`Configuration directory: ${configDir}`);

        // 1. Resolve Root Config First to Determine Theme
        const rootConfigPath = path.join(configDir, 'config.yaml');
        if (!fs.existsSync(rootConfigPath)) {
            // If config.yaml doesn't exist, try to parse it anyway to get formatted error or let it fail
        }
        const config = parseConfig(rootConfigPath);

        // 2. Determine Theme
        let themeName = config.theme || 'basic';
        // Handle legacy color modes 'light'/'dark' -> default to 'basic' theme
        if (['light', 'dark'].includes(themeName)) themeName = 'basic';

        const themeDir = path.join(configDir, 'themes', themeName);
        const activeThemeDir = fs.existsSync(themeDir) ? themeDir : null;

        if (activeThemeDir) {
            logInfo(`🎨 Using Theme: ${themeName}`);
        } else {
            logInfo(`Using root configuration (Theme '${themeName}' not found in 'themes/' folder)`);
        }

        // 3. Helper to resolve files (Theme > Root)
        const resolveFile = (filename) => {
            if (activeThemeDir) {
                const themeFile = path.join(activeThemeDir, filename);
                if (fs.existsSync(themeFile)) {
                    logInfo(`   Using theme version of ${filename}`);
                    return themeFile;
                }
            }
            logInfo(`   Using root version of ${filename}`);
            return path.join(configDir, filename);
        };

        // 4. Resolve Paths
        const menuPath = resolveFile('menu.json');
        const panesPath = resolveFile('panes.cfg');
        const entriesPath = resolveFile('entries.json');

        // 5. Parse Content
        const menu = parseMenu(menuPath);
        const rows = parsePanes(panesPath);  // Returns rows format
        const panes = flattenPanes(rows);    // Flatten for validation and legacy support
        const entries = parseEntries(entriesPath);

        // Validate entries against panes
        const validatedEntries = validateEntriesAgainstPanes(entries, rows);

        // Prepare blog data (include both rows and flattened panes for backward compatibility)
        const blogData = {
            config,
            menu,
            rows,
            panes,
            entries: validatedEntries,
        };

        // Determine output directory
        const outputDir = path.resolve(config.output_dir);
        logInfo(`Output directory: ${outputDir}`);

        // Create output directory if it doesn't exist
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
            logInfo(`Created output directory: ${outputDir}`);
        }

        // Copy the entire src directory to output
        const srcDir = path.join(__dirname, 'src');
        const publicDir = path.join(__dirname, 'public');
        const indexHtmlPath = path.join(__dirname, 'index.html');
        // Note: We need to resolve these relative to the CLI script location, handled by __dirname
        const viteConfigPath = path.join(__dirname, 'vite.config.js');
        const packageJsonPath = path.join(__dirname, 'package.json');
        const tailwindConfigPath = path.join(__dirname, 'tailwind.config.js');
        const postcssConfigPath = path.join(__dirname, 'postcss.config.js');

        // Create blog-data.js file with the configuration
        const blogDataJs = `window.__BLOG_DATA__ = ${JSON.stringify(blogData, null, 2)};`;
        const blogDataPath = path.join(outputDir, 'blog-data.js');
        fs.writeFileSync(blogDataPath, blogDataJs);
        logInfo('Generated blog-data.js');

        // Update index.html to include blog-data.js
        let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
        if (!indexHtml.includes('blog-data.js')) {
            indexHtml = indexHtml.replace(
                '</head>',
                '  <script src="/blog-data.js"></script>\n  </head>'
            );
        }

        // Update meta tags matches existing logic
        indexHtml = indexHtml.replace(
            /<title>.*?<\/title>/,
            `<title>${config.title}</title>`
        );

        if (!indexHtml.includes('<meta name="description"')) {
            indexHtml = indexHtml.replace(
                '</head>',
                `  <meta name="description" content="${config.description || 'A blog generated by BasicBlog'}" />\n  </head>`
            );
        }

        if (config.author && !indexHtml.includes('<meta name="author"')) {
            indexHtml = indexHtml.replace(
                '</head>',
                `  <meta name="author" content="${config.author}" />\n  </head>`
            );
        }

        fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml);
        logInfo('Updated index.html with metadata');

        // Copy Build Files
        const filesToCopy = [
            { src: viteConfigPath, dest: path.join(outputDir, 'vite.config.js') },
            { src: packageJsonPath, dest: path.join(outputDir, 'package.json') },
            { src: tailwindConfigPath, dest: path.join(outputDir, 'tailwind.config.js') },
            { src: postcssConfigPath, dest: path.join(outputDir, 'postcss.config.js') },
        ];

        filesToCopy.forEach(({ src, dest }) => {
            if (fs.existsSync(src)) {
                fs.copyFileSync(src, dest);
                logInfo(`Copied ${path.basename(src)}`);
            }
        });

        // Copy Directories
        const copyRecursive = (src, dest) => {
            if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
            const items = fs.readdirSync(src, { withFileTypes: true });
            for (const item of items) {
                const srcPath = path.join(src, item.name);
                const destPath = path.join(dest, item.name);
                if (item.isDirectory()) copyRecursive(srcPath, destPath);
                else fs.copyFileSync(srcPath, destPath);
            }
        };

        copyRecursive(srcDir, path.join(outputDir, 'src'));
        logInfo('Copied src directory');

        if (fs.existsSync(publicDir)) {
            copyRecursive(publicDir, path.join(outputDir, 'public'));
            logInfo('Copied public directory');
        }

        // Generate summary log
        const totalEntries = Object.values(validatedEntries).reduce((sum, arr) => sum + arr.length, 0);

        const warnings = [];
        panes.forEach(pane => {
            if (!validatedEntries[pane.name] || validatedEntries[pane.name].length === 0) {
                warnings.push(`Pane '${pane.name}' has no content`);
            }
        });

        console.log('\n' + '='.repeat(60));
        console.log('✅ BasicBlog generation complete!');
        console.log('='.repeat(60));
        console.log(`🎨 Theme:         ${themeName}`);
        console.log(`📁 Output:        ${outputDir}`);
        console.log(`📊 Stats:         ${rows.length} rows, ${panes.length} panes, ${totalEntries} entries`);
        if (warnings.length > 0) {
            console.log(`⚠️  Warnings: ${warnings.length}`);
            warnings.forEach(w => console.log(`   - ${w}`));
        }
        console.log('\n📝 Next steps:');
        console.log(`   1. cd ${path.relative(process.cwd(), outputDir) || '.'}`);
        console.log(`   2. npm install`);
        console.log(`   3. npm run dev`);
        console.log('='.repeat(60) + '\n');

        logInfo('Blog generation completed successfully');

    } catch (error) {
        logError('Fatal error during blog generation', error);
        console.error('\n❌ Error generating blog:', error.message);
        process.exit(1);
    }
}

/**
 * Create a new blog with starter configuration
 * @param {string} blogName - Name of the new blog
 * @param {Object} options - Command options
 */
async function createNewBlog(blogName, options) {
    try {
        const blogDir = path.resolve(blogName);
        if (fs.existsSync(blogDir)) {
            console.error(`❌ Error: Directory '${blogName}' already exists.`);
            process.exit(1);
        }

        console.log(`\n🚀 Creating new blog: ${blogName}\n`);
        fs.mkdirSync(blogDir, { recursive: true });

        // 1. Install Themes (Copy from templates)
        const templatesSrc = path.join(__dirname, 'themes');
        const themesDest = path.join(blogDir, 'themes');

        if (fs.existsSync(templatesSrc)) {
            const copyRecursive = (src, dest) => {
                if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
                const items = fs.readdirSync(src, { withFileTypes: true });
                for (const item of items) {
                    const srcPath = path.join(src, item.name);
                    const destPath = path.join(dest, item.name);
                    if (item.isDirectory()) copyRecursive(srcPath, destPath);
                    else fs.copyFileSync(srcPath, destPath);
                }
            };
            copyRecursive(templatesSrc, themesDest);
        } else {
            // Fallback if template folder missing: Create basic manually
            fs.mkdirSync(path.join(themesDest, 'basic'), { recursive: true });
            const panesContent = `|header 100 15 dock:top|\n|sidebar 25|main|\n|footer 100 dock:bottom|`;
            fs.writeFileSync(path.join(themesDest, 'basic', 'panes.cfg'), panesContent);
        }

        // 2. config.yaml
        const configContent = `title: ${blogName}
theme: basic
output_dir: ./build
multi_page: false
author: ${options.author || 'Your Name'}
description: ${options.description || `Welcome to ${blogName}`}
`;
        fs.writeFileSync(path.join(blogDir, 'config.yaml'), configContent);

        // 3. menu.json
        const menuContent = JSON.stringify([
            { label: 'Home', url: '/' },
            { label: 'About', url: '#about' },
            { label: 'Contact', url: '#contact' }
        ], null, 2);
        fs.writeFileSync(path.join(blogDir, 'menu.json'), menuContent);

        // 4. entries.json
        const entriesContent = JSON.stringify({
            header: [{ type: 'html', content: "<div class='p-8 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg'><h1 class='text-4xl font-bold'>Welcome</h1></div>" }],
            sidebar: [{ type: 'markdown', title: 'Themes', content: "This blog has multiple themes!\n\nCheck `themes/` folder to see:\n- basic\n- advanced" }],
            main: [
                {
                    type: 'markdown',
                    title: `Welcome to ${blogName}`,
                    content: `# Hello, World!\n\nThis is your new blog created with **BasicBlog**.\n\n## Theme System\n\nYou have two themes installed by default:\n1. **basic**: A simple sidebar layout (Active)\n2. **advanced**: A complex dashboard-style layout\n\n### Try switching themes!\n1. Open \`config.yaml\`\n2. Change \`theme: basic\` to \`theme: advanced\`\n3. Run \`basicblog generate\`\n\nEnjoy! 🎉`
                }
            ],
            footer: [{ type: 'text', content: "BasicBlog Theme System" }]
        }, null, 2);
        fs.writeFileSync(path.join(blogDir, 'entries.json'), entriesContent);

        console.log('✅ Blog structure created successfully!\n');
        console.log('📁 Project Structure:');
        console.log(`   ${blogName}/`);
        console.log('   ├── config.yaml');
        console.log('   ├── menu.json');
        console.log('   ├── entries.json');
        console.log('   └── themes/');
        console.log('       ├── basic/');
        console.log('       └── advanced/');
        console.log('📝 Next steps:');
        console.log(`   1. cd ${blogName}`);
        console.log(`   2. basicblog generate`);
        console.log(`   3. cd build && npm install && npm run dev\n`);

    } catch (error) {
        if (error.code && error.code !== 'ENOENT') {
            logError('Error creating new blog', error);
        }
        console.error('\n❌ Error creating blog:', error.message);
        process.exit(1);
    }
}

/**
 * Build the blog for production
 * @param {Object} options - Command options
 */
async function buildBlog(options) {
    try {
        const buildDir = options.dir || './build';

        if (!fs.existsSync(buildDir)) {
            console.error(`❌ Error: Build directory '${buildDir}' not found.`);
            console.log('💡 Tip: Run "basicblog generate" first.');
            process.exit(1);
        }

        console.log('\n🔨 Building blog for production...\n');

        const { execSync } = await import('child_process');

        // Change to build directory and run build
        process.chdir(buildDir);

        // Install dependencies if needed
        if (!fs.existsSync('node_modules')) {
            console.log('📦 Installing dependencies...');
            execSync('npm install', { stdio: 'inherit' });
        }

        // Run build
        console.log('🏗️  Building...');
        execSync('npm run build', { stdio: 'inherit' });

        console.log('\n✅ Build complete!');
        console.log(`📁 Output: ${path.join(buildDir, 'dist')}\n`);

    } catch (error) {
        console.error('❌ Build failed:', error.message);
        process.exit(1);
    }
}

/**
 * Deploy the blog to various platforms
 * @param {string} provider - Deployment provider
 * @param {Object} options - Command options
 */
async function deployBlog(provider, options) {
    try {
        const buildDir = options.dir || './build';
        const distDir = path.join(buildDir, 'dist');

        if (!fs.existsSync(distDir)) {
            console.error(`❌ Error: Build output not found at '${distDir}'.`);
            console.log('💡 Tip: Run "basicblog build" first.');
            process.exit(1);
        }

        console.log(`\n🚀 Deploying to ${provider}...\n`);

        const { execSync } = await import('child_process');

        switch (provider.toLowerCase()) {
            case 'netlify':
                // Create netlify.toml if it doesn't exist
                const netlifyConfig = `[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`;
                const netlifyConfigPath = path.join(buildDir, 'netlify.toml');
                if (!fs.existsSync(netlifyConfigPath)) {
                    fs.writeFileSync(netlifyConfigPath, netlifyConfig);
                    console.log('✅ Created netlify.toml');
                }

                console.log('📤 Deploying to Netlify...');
                try {
                    execSync(`npx netlify-cli deploy --prod --dir=${distDir}`, {
                        stdio: 'inherit',
                        cwd: buildDir
                    });
                    console.log('\n✅ Deployed to Netlify!');
                } catch (err) {
                    console.log('\n💡 Install Netlify CLI: npm install -g netlify-cli');
                    console.log('💡 Then run: netlify login && netlify deploy --prod');
                }
                break;

            case 'vercel':
                console.log('📤 Deploying to Vercel...');
                try {
                    execSync('npx vercel --prod', {
                        stdio: 'inherit',
                        cwd: buildDir
                    });
                    console.log('\n✅ Deployed to Vercel!');
                } catch (err) {
                    console.log('\n💡 Install Vercel CLI: npm install -g vercel');
                    console.log('💡 Then run: vercel --prod');
                }
                break;

            case 'github':
            case 'gh-pages':
                console.log('📤 Deploying to GitHub Pages...');

                // Install gh-pages if needed
                const packageJson = JSON.parse(
                    fs.readFileSync(path.join(buildDir, 'package.json'), 'utf8')
                );

                if (!packageJson.devDependencies?.['gh-pages']) {
                    console.log('📦 Installing gh-pages...');
                    execSync('npm install -D gh-pages', {
                        stdio: 'inherit',
                        cwd: buildDir
                    });
                }

                // Add deploy script if not present
                if (!packageJson.scripts?.deploy) {
                    packageJson.scripts = packageJson.scripts || {};
                    packageJson.scripts.deploy = 'gh-pages -d dist';
                    fs.writeFileSync(
                        path.join(buildDir, 'package.json'),
                        JSON.stringify(packageJson, null, 2)
                    );
                    console.log('✅ Added deploy script to package.json');
                }

                execSync('npm run deploy', {
                    stdio: 'inherit',
                    cwd: buildDir
                });
                console.log('\n✅ Deployed to GitHub Pages!');
                break;

            default:
                console.error(`❌ Unknown provider: ${provider}`);
                console.log('💡 Supported providers: netlify, vercel, github');
                process.exit(1);
        }

    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
        process.exit(1);
    }
}

// CLI Configuration
program
    .name('basicblog')
    .description('BasicBlog - A dynamic blog generator with stunning UI')
    .version('1.0.0');

program
    .command('new <blog-name>')
    .description('Create a new blog with starter configuration')
    .option('-t, --theme <theme>', 'Theme (light or dark)', 'light')
    .option('-a, --author <author>', 'Author name', 'Your Name')
    .option('-d, --description <description>', 'Blog description')
    .action(async (blogName, options) => {
        await createNewBlog(blogName, options);
    });

program
    .command('generate [config-dir]')
    .description('Generate a blog from configuration files')
    .option('-o, --output <dir>', 'Output directory (overrides config.yaml)')
    .action(async (configDir = '.', options) => {
        await generateBlog(configDir, options);
    });

program
    .command('build')
    .description('Build the blog for production')
    .option('-d, --dir <directory>', 'Build directory', './build')
    .action(async (options) => {
        await buildBlog(options);
    });

program
    .command('deploy <provider>')
    .description('Deploy the blog (providers: netlify, vercel, github)')
    .option('-d, --dir <directory>', 'Build directory', './build')
    .action(async (provider, options) => {
        await deployBlog(provider, options);
    });

program
    .command('init')
    .description('Initialize a new blog in the current directory')
    .option('-t, --theme <theme>', 'Theme (light or dark)', 'light')
    .option('-a, --author <author>', 'Author name', 'Your Name')
    .action(async (options) => {
        await createNewBlog('.', options);
    });

program.parse();
