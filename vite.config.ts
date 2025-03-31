import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Permite conexões de fora da sua máquina local
    port: 3000,        // Ou qualquer outra porta desejada
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
