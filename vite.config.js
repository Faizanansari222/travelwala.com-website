import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // The lazily loaded PDF chunk (jsPDF) is ~800 kB; nothing that large loads up front.
    chunkSizeWarningLimit: 900,
    rolldownOptions: {
      output: {
        // Keep long-lived vendor code in its own cacheable chunks.
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/ },
            { name: 'motion', test: /node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/ },
            // Vite's lazy-load helper is shared by app and PDF code; keep it out of the PDF chunk.
            { name: 'preload-helper', test: /preload-helper/ },
            // PDF quote libraries load only when a visitor downloads a quote.
            {
              name: 'pdf',
              test: /node_modules[\\/](jspdf|jspdf-autotable|@babel[\\/]runtime|fflate|fast-png|iobuffer|pako|canvg|core-js|dompurify|html2canvas|rgbcolor|stackblur-canvas|svg-pathdata|css-line-break|text-segmentation|base64-arraybuffer|utrie)[\\/]/,
            },
            { name: 'vendor', test: /node_modules[\\/]/ },
          ],
        },
      },
    },
  },
})
