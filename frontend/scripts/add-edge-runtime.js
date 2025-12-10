// Script to add Edge Runtime to all pages
// Run with: node scripts/add-edge-runtime.js

const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '..', 'src', 'app', '[locale]');

function addEdgeRuntime(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    if (content.includes("export const runtime = 'edge'")) {
        console.log(`✓ Already has edge runtime: ${filePath}`);
        return false;
    }

    // Find the last import statement
    const lines = content.split('\n');
    let lastImportIndex = -1;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('import ') || lines[i].startsWith("import{") || lines[i].trim().startsWith('from ')) {
            lastImportIndex = i;
        }
    }

    if (lastImportIndex === -1) {
        // If no imports found, add after 'use client' if exists
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes("'use client'") || lines[i].includes('"use client"')) {
                lastImportIndex = i;
                break;
            }
        }
    }

    if (lastImportIndex === -1) {
        lastImportIndex = 0;
    }

    // Insert edge runtime export
    lines.splice(lastImportIndex + 1, 0, '', "// Edge Runtime for Cloudflare Pages", "export const runtime = 'edge';");

    fs.writeFileSync(filePath, lines.join('\n'));
    console.log(`✅ Added edge runtime: ${filePath}`);
    return true;
}

function processDirectory(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (item === 'page.tsx') {
            addEdgeRuntime(fullPath);
        }
    }
}

// Process all pages
processDirectory(pagesDir);

// Also process API routes
const apiDir = path.join(__dirname, '..', 'src', 'app', 'api');
if (fs.existsSync(apiDir)) {
    function processApiDirectory(dir) {
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                processApiDirectory(fullPath);
            } else if (item === 'route.ts' || item === 'route.tsx') {
                addEdgeRuntime(fullPath);
            }
        }
    }
    processApiDirectory(apiDir);
}

console.log('\n✨ Done adding edge runtime to all pages!');
