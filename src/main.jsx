import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { captureAttribution } from './lib/attribution.js'

// Record how this visitor arrived (utm / referrer / click ids) before anything
// navigates client-side and the original URL params are gone.
captureAttribution()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
