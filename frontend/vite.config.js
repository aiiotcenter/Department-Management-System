import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default {
  server: {
    allowedHosts: ['aiiot.center', 'www.aiiot.center'], // allow your domain(s)
    host: true, // optional: allow external access
    port: 9802
  }
}
