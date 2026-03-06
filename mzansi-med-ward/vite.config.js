import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- The new import

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- Add it here
  ],
})