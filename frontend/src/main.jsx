import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast'

// Toast provider configured with dark theme
// Mount React app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: 'rgb(var(--surface))',
          color: 'rgb(var(--ink))',
          border: '1.5px solid rgb(var(--ink))',
          borderRadius: '4px',
          boxShadow: '3px 3px 0 rgb(var(--ink))',
          fontSize: '14px',
        },
        duration: 3000,
      }}
    />
  </React.StrictMode>,
)
