import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { VentaProvider } from './context/VentaContext'
import App from './App'
import theme from './theme'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <VentaProvider>
        <ThemeProvider>
          <MuiThemeProvider theme={theme}>
            <App />
          </MuiThemeProvider>
        </ThemeProvider>
      </VentaProvider>
    </AuthProvider>
  </BrowserRouter>
)