import path from "node:path"
import react from "@vitejs/plugin-react"
import { coverageConfigDefaults, defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react(), stubNextAssetImport()],
  resolve: {
    tsconfigPaths: true,
  },
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

function stubNextAssetImport() {
  return {
    name: "stub-next-asset-import",
    transform(_code: string, id: string) {
      if (/(jpg|jpeg|png|webp|gif|svg)$/.test(id)) {
        const imgSrc = path.relative(process.cwd(), id)
        return {
          code: `export default { src: '/${imgSrc}', height: 1, width: 1 }`,
        }
      }
    },
  }
}
