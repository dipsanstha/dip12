import { defineConfig } from 'vite';

export default defineConfig({
  // Development server configuration
  server: {
    port: 3000,
    host: true,
    open: true,
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    target: 'es2015',
    rollupOptions: {
      input: 'index.html',
      output: {
        // No manualChunks needed since 'vanilla-router' is not used
      }
    }
  },
  
  // Asset handling
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.ico'],
  
  // CSS configuration
  css: {
    devSourcemap: true
  },
  
  // Base URL for production
  base: './',
  
  // Plugin configuration (none needed for vanilla JS)
  plugins: []
});