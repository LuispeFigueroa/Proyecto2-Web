import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { VentaProvider } from './context/VentaContext'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <VentaProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </VentaProvider>
    </AuthProvider>
  </BrowserRouter>
)
