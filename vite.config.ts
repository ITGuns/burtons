import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (/three|@react-three/.test(id)) return 'three'
            if (id.includes('gsap')) return 'gsap'
            if (id.includes('framer-motion')) return 'motion'
            if (/recharts|d3-/.test(id)) return 'charts'
            if (id.includes('@supabase')) return 'supabase'
          }
        },
      },
    },
  },
})
