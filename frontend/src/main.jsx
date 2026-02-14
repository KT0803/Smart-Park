import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast'

// Mount React app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: { background: '#1f2937', color: '#f9fafb', border: '1px solid #374151' },
        duration: 3000,
      }}
    />
  </React.StrictMode>,
)
