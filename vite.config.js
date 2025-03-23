import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Export Vite configuration
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build",  // The build output folder
  },
  server: {
    historyApiFallback: true,  // This ensures routes fallback to index.html, allowing React Router to handle them
  },
})
