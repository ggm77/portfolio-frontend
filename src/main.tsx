import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import type { PreloadedState } from './api/types'

declare global {
  interface Window {
    __PRELOADED_STATE__?: PreloadedState;
  }
}

const container = document.getElementById('root')!
const preloadedState = window.__PRELOADED_STATE__

if (preloadedState) {
  hydrateRoot(
    container,
    <StrictMode>
      <App preloadedState={preloadedState} />
    </StrictMode>,
  )
} else {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
