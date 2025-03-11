// build.js
import { build } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildApp() {
  try {
    console.log('Starting build process...');
    
    const result = await build({
      root: __dirname,
      base: '/admin/',
      logLevel: 'info',
      configFile: resolve(__dirname, 'vite.config.ts'),
      mode: 'production',
      build: {
        outDir: 'dist',
        emptyOutDir: true,
        minify: 'terser',
        sourcemap: false,
      },
    });
    
    console.log('Build completed successfully!', result);
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildApp(); 