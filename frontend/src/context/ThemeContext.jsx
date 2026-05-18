import { createContext, useContext, useState, useMemo } from 'react'
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material'
import { getTheme } from '../theme'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
    const [mode, setMode] = useState('light')

    const toggleTheme = () => {
        setMode(prev => prev === 'light' ? 'dark' : 'light')
    }

    const muiTheme = useMemo(() => getTheme(mode), [mode])
    const value = useMemo(() => ({ mode, toggleTheme }), [mode])

    return (
        <ThemeContext.Provider value={value}>
            <MuiThemeProvider theme={muiTheme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    return useContext(ThemeContext)
}
