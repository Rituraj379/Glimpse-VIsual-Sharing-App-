import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [tailwindcss(), react()],
    server: {
      port: Number(env.VITE_PORT) || 5181,
      strictPort: false,
    },
  };
});
