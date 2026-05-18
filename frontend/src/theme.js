import { createTheme } from '@mui/material/styles'

export const getTheme = (mode) => createTheme({
    palette: {
        mode,
        ...(mode === 'light' ? {
            background: { default: '#F5F6F8', paper: '#ffffff' },
            primary: { main: '#42273B' },
            secondary: { main: '#6C8EAD' },
            error: { main: '#DE3C4B' },
            text: { primary: '#42273B', secondary: '#64748B' },
        } : {
            background: { default: '#121212', paper: '#1e1e1e' },
            primary: { main: '#6C8EAD' },
            secondary: { main: '#90caf9' },
            error: { main: '#DE3C4B' },
        }),
    },
    typography: {
        fontFamily: '"Inter", "Roboto", sans-serif',
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: mode === 'light' ? '#6C8EAD' : '#1a1a2e',
                    borderBottom: `1px solid ${mode === 'light' ? '#5a7a9a' : '#2a2a3e'}`,
                    boxShadow: 'none',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: { borderRadius: 8, textTransform: 'none' },
                containedPrimary: {
                    backgroundColor: mode === 'light' ? '#42273B' : '#6C8EAD',
                    '&:hover': { backgroundColor: mode === 'light' ? '#2e1a28' : '#5a7a9a' },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: { backgroundImage: 'none' },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: { borderColor: mode === 'light' ? '#E2E8F0' : '#333' },
                head: { color: mode === 'light' ? '#64748B' : '#aaa', fontWeight: 500, fontSize: 12 },
            },
        },
        MuiChip: {
            styleOverrides: { root: { borderRadius: 6 } },
        },
    },
})
