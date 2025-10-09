import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/SIH_TRUSTEYE/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
