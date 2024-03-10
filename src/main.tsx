import { Router } from 'joter'
import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'

import { routes } from './router'

createRoot(document.querySelector('#root')!).render(
  <StrictMode>
    <Suspense fallback="Loading...">
      <Router routes={routes} />
    </Suspense>
  </StrictMode>,
)
