import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allow external connections
    port: 9802,
    allowedHosts: ['aiiot.center', 'www.aiiot.center'],
    hmr: {
      host: 'aiiot.center', // your domain
      protocol: 'wss',
      port: 443
    }
  }
});
