import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

//config forwards requests that starts api to backend to retrieve anything backend related
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true, //pretends the request came from the backend
      },
    },
  },
})
