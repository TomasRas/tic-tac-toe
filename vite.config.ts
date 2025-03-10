import { defineConfig, UserConfig } from 'vite'
import type { UserConfig as VitestConfig } from 'vitest/node'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
    test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
})  as UserConfig & { test: VitestConfig }
