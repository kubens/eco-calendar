import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    {
      name: 'global-crypto',
      config: () => ({
        test: {
          setupFiles: ['./tests/setup/global-crypto.ts'],
        },
      }),
    },
  ],
})
