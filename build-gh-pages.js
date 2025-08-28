#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a static version of the app for GitHub Pages
function createStaticBuild() {
  console.log('Creating GitHub Pages build...');
  
  // Create the build script that will be run by GitHub Actions
  const buildScript = `
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared"),
      "@assets": path.resolve(__dirname, "./attached_assets"),
    },
  },
  root: "./client",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'client/index.html')
      }
    }
  },
  base: '/ME-Dictionary/',
  define: {
    'process.env.NODE_ENV': '"production"',
    'import.meta.env.PROD': true
  }
});
`;

  // Write the GitHub Pages specific Vite config
  fs.writeFileSync('vite.gh-pages.config.js', buildScript);
  
  console.log('✅ Created vite.gh-pages.config.js for GitHub Pages build');
}

// Create a static HTML fallback for the SPA
function createSPAFallback() {
  const fallbackHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="apple-mobile-web-app-title" content="Dictionary">
  <meta name="theme-color" content="#0891b2">
  <meta name="description" content="Bilingual Bangla-English dictionary with prayer time auto-silence feature">
  
  <link rel="manifest" href="/ME-Dictionary/manifest.json">
  <link rel="icon" type="image/png" href="/ME-Dictionary/icon-192.png">
  <link rel="apple-touch-icon" href="/ME-Dictionary/icon-192.png">
  
  <title>Bangla-English Dictionary</title>
  <script>
    // SPA fallback: redirect all 404s to main app for client-side routing
    var l = window.location;
    // Only redirect if we're in the ME-Dictionary path and not already at root
    if (l.pathname.startsWith('/ME-Dictionary/') && l.pathname !== '/ME-Dictionary/') {
      // Store the original path for client-side routing
      sessionStorage.setItem('redirectPath', l.pathname + l.search);
      window.location.href = '/ME-Dictionary/';
    }
  </script>
</head>
<body>
  <div id="root">
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
      <div style="text-align: center;">
        <h2>Loading Dictionary App...</h2>
        <p>If the app doesn't load, <a href="/ME-Dictionary/">click here</a></p>
      </div>
    </div>
  </div>
</body>
</html>`;

  if (!fs.existsSync('client/public')) {
    fs.mkdirSync('client/public', { recursive: true });
  }
  
  fs.writeFileSync('client/public/404.html', fallbackHTML);
  console.log('✅ Created 404.html for SPA routing');
}

createStaticBuild();
createSPAFallback();
console.log('🎉 GitHub Pages setup complete!');