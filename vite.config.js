import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  base: `/${import.meta.env.VITE_REPO_NAME}/`,
  plugins: [react()],
});
