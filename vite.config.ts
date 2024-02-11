import React from "@vitejs/plugin-react"
import UnoCSS from "unocss/vite"
import { defineConfig, loadEnv } from "vite"
import NitroDeploy from "vite-plugin-nitro-deploy"
import TsconfigPaths from "vite-tsconfig-paths"

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  // @ts-expect-error
  import.meta.env = env
  await import("./src/env")

  const proxyPath = env["VITE_PROXY_PATH"]
  const proxyTarget = env["VITE_PROXY_TARGET"]

  return {
    plugins: [
      TsconfigPaths(),
      React({
        babel: {
          presets: [
            [
              "jotai/babel/preset",
              {
                customAtomNames: [
                  "atomDark",
                  "atomWithQuery",
                  "atomWithSuspenseQuery",
                  "atomWithLocation",
                ],
              },
            ],
          ],
        },
      }),
      UnoCSS(),
      NitroDeploy({
        nitro: {
          enabled: true,
        },
      }),
    ],
    server: {
      proxy: {
        [proxyPath]: {
          target: proxyTarget,
          secure: false,
          changeOrigin: true,
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom"],
            zod: ["zod"],
          },
        },
      },
    },
  }
})
