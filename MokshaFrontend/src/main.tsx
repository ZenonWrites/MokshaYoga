import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// THREE.Clock was deprecated in r176; @react-three/fiber still uses it internally.
// Suppress the warning until R3F ships a fix.
const _warn = console.warn.bind(console)
console.warn = (...args: unknown[]) => {
  if (typeof args[0] === 'string' && args[0].includes('THREE.Clock')) return
  _warn(...args)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
