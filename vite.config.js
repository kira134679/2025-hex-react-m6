import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  base: `/2025-hex-react-m2/`,
  plugins: [react()],
});
