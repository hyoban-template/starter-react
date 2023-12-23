import { StrictMode, Suspense } from "react"
import { createRoot } from "react-dom/client"

import { Routes } from "./routes"

createRoot(document.querySelector("#root")!).render(
  <StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes />
    </Suspense>
  </StrictMode>,
)
