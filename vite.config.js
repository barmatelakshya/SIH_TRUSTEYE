import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: '/SIH_TRUSTEYE/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
