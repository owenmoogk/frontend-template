import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';

export const ProjectJsonPath = path.resolve(
  __dirname,
  'src',
  'api',
  'projects.json'
);

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
    eslint({
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      emitWarning: true,
      emitError: false,
      failOnWarning: false,
      failOnError: false,
    }),
  ],
  server: {
    port: 3000,
  },
  base: '/ical-display/',
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@api': path.resolve(__dirname, './src/api'),
      '@global': path.resolve(__dirname, './src/global'),
    },
  },
});
