import { defineConfig, type Plugin } from 'vite';
import { resolve } from 'path';
import { readFileSync, readdirSync, copyFileSync, mkdirSync, existsSync } from 'fs';

/** Vite plugin: serve CSV data from cv/cv_data/ submodule instead of public/data/ */
function cvDataPlugin(): Plugin {
  const cvDataDir = resolve(__dirname, 'cv/cv_data');

  return {
    name: 'cv-data',

    // Dev server: intercept requests to /BMSchilder/data/*.csv
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const match = req.url?.match(/\/BMSchilder\/data\/(.+\.csv)$/);
        if (match) {
          const filePath = resolve(cvDataDir, match[1]);
          try {
            const content = readFileSync(filePath, 'utf-8');
            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            res.end(content);
            return;
          } catch {
            // Fall through to next handler
          }
        }
        next();
      });
    },

    // Build: copy CSV files from cv/cv_data/ to dist/data/
    closeBundle() {
      const outDir = resolve(__dirname, 'dist/data');
      if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

      if (existsSync(cvDataDir)) {
        for (const file of readdirSync(cvDataDir)) {
          if (file.endsWith('.csv')) {
            copyFileSync(resolve(cvDataDir, file), resolve(outDir, file));
          }
        }
      }
    },
  };
}

export default defineConfig({
  base: '/BMSchilder/',
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [cvDataPlugin()],
});
