import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initServiceWorker } from './pwa/swUpdate'
import App from './App'
import './styles/global.css'

// Register the service worker for offline use. A new build still never reloads
// the page on its own; it is offered in the Library and applied on a tap, so an
// update can neither interrupt a live session nor sit in "waiting" unnoticed.
initServiceWorker()

const rootEl = document.getElementById('root')
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
