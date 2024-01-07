import fs from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import React from "@vitejs/plugin-react-swc"
import UnoCSS from "unocss/vite"
import { defineConfig, loadEnv } from "vite"

import type { Plugin } from "vite"

const _dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : dirname(fileURLToPath(import.meta.url))

type ViteProxyPluginOptions = {
  proxyPath?: string
  proxyTarget?: string
}

function ViteProxyPlugin(options?: ViteProxyPluginOptions): Plugin {
  const { proxyPath = "/api", proxyTarget = "http://localhost:3000" } =
    options ?? {}

  return {
    name: "vite-proxy-plugin",
    apply: "build",
    closeBundle: () => {
      fs.writeFileSync(
        "nginx.conf",
        `
server {
  listen 80;

  root /usr/share/nginx/html;
  index index.html;

  # 开启 gzip 压缩
  gzip on;
  gzip_types text/plain text/css application/javascript application/json;

  location ^~${proxyPath}/ {
    rewrite ^/(.*)$ /$1 break;
    proxy_pass ${proxyTarget};
    proxy_http_version 1.1;
  }

  location / {
    try_files $uri $uri/ /index.html =404;
  }
}`,
        "utf-8",
      )
    },
  }
}

const env = loadEnv(
  process.env["RAILWAY_ENVIRONMENT_NAME"] ??
    process.env["NODE_ENV"] ??
    "development",
  process.cwd(),
)

const proxyPath = env["VITE_PROXY_PATH"]
const proxyTarget = env["VITE_PROXY_TARGET"]

if (!proxyPath || !proxyTarget) {
  throw new Error("VITE_PROXY_PATH or VITE_PROXY_TARGET is not set")
}

export default defineConfig({
  plugins: [
    React({
      plugins: [
        [
          "@swc-jotai/debug-label",
          { atomNames: ["atomDark", "atomWithSuspenseQuery"] },
        ],
        [
          "@swc-jotai/react-refresh",
          { atomNames: ["atomDark", "atomWithSuspenseQuery"] },
        ],
      ],
    }),
    UnoCSS(),
    ViteProxyPlugin({
      proxyPath,
      proxyTarget,
    }),
  ],
  resolve: {
    alias: {
      "~": resolve(_dirname, "./src"),
    },
  },
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
          react: ["react", "react-dom", "react-router-dom"],
          zod: ["zod"],
        },
      },
    },
  },
})
