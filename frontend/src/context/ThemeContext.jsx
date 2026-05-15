import { createContext, useContext, useState, useMemo } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
    const [mode, setMode] = useState('light')

    const toggleTheme = () => {
        setMode(prev => prev === 'light' ? 'dark' : 'light')
    }

    const value = useMemo(() => ({ mode, toggleTheme }), [mode])

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    return useContext(ThemeContext)
}