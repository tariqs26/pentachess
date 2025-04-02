import { defineConfig, coverageConfigDefaults } from "vitest/config"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    coverage: {
      exclude: [
        ...coverageConfigDefaults.exclude,
        "{next,postcss,tailwind}.config.*",
        "src/**/types.ts",
        "src/app/api/auth/",
        "src/components/ui/",
        "src/lib/",
      ],
    },
  },
})
