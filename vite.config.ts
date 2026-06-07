//Libs
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import electron from "vite-plugin-electron"

//Main
export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        entry: "src/main/main.ts"
      },
      {
        entry: "src/preload/preload.ts",
        onclean(options) {
          options.clean(options.dest)
        },
        vite: {
          build: {
            lib: {
              entry: "src/preload/preload.ts",
              formats: ["cjs"]
            }
          }
        }
      }
    ])
  ]
})
