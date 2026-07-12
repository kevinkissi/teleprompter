import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import './styles/global.css'

// Register the service worker for offline use. With registerType 'prompt' we do NOT
// pass an onNeedRefresh handler, so a newly built SW stays in "waiting" and never
// reloads the page mid-session — it takes over on the next natural launch.
registerSW({ immediate: true })

const rootEl = document.getElementById('root')
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
