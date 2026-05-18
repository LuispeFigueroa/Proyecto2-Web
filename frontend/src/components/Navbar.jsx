import { useState } from 'react'
import {
    AppBar, Toolbar, Typography, Button, Box, IconButton,
    Tooltip, useMediaQuery, useTheme as useMuiTheme, Drawer, List,
    ListItem, ListItemButton, ListItemText
} from '@mui/material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
    const muiTheme = useMuiTheme()
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'))
    const [drawerOpen, setDrawerOpen] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const { mode, toggleTheme } = useTheme()

    const links = [
        { label: 'Inicio', to: '/', icon: <HomeIcon fontSize="small" /> },
        { label: 'Productos', to: '/productos' },
        { label: 'Clientes', to: '/clientes' },
        { label: 'Ventas', to: '/ventas' },
        { label: 'Reportes', to: '/reportes' },
    ]

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <AppBar position="fixed">
            <Toolbar>
                <Box component={Link} to="/"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700 }}>
                        Tienda Musical
                    </Typography>
                </Box>

                {isMobile ? (
                    <>
                        <Tooltip title={mode === 'light' ? 'Modo oscuro' : 'Modo claro'}>
                            <IconButton onClick={toggleTheme} sx={{ color: '#ffffff', mr: 1 }}>
                                {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
                            </IconButton>
                        </Tooltip>
                        <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: '#ffffff' }}>
                            <MenuIcon />
                        </IconButton>
                        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                            <List sx={{ width: 220, pt: 2 }}>
                                {links.map(link => (
                                    <ListItem key={link.to} disablePadding>
                                        <ListItemButton component={Link} to={link.to} onClick={() => setDrawerOpen(false)}>
                                            <ListItemText primary={link.label} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                                {user && (
                                    <ListItem disablePadding>
                                        <ListItemButton onClick={handleLogout}>
                                            <ListItemText primary="Cerrar sesión" />
                                        </ListItemButton>
                                    </ListItem>
                                )}
                            </List>
                        </Drawer>
                    </>
                ) : (
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        {links.map(link => (
                            <Button
                                key={link.to}
                                component={Link}
                                to={link.to}
                                startIcon={link.icon || null}
                                sx={{
                                    color: location.pathname === link.to ? '#ffffff' : '#D4D6B9cc',
                                    fontWeight: location.pathname === link.to ? 600 : 400,
                                    textTransform: 'none',
                                    '&:hover': { color: '#ffffff', bgcolor: '#ffffff20' }
                                }}
                            >
                                {link.label}
                            </Button>
                        ))}
                        <Tooltip title={mode === 'light' ? 'Modo oscuro' : 'Modo claro'}>
                            <IconButton onClick={toggleTheme} size="small" sx={{ color: '#D4D6B9', '&:hover': { color: '#ffffff' } }}>
                                {mode === 'light' ? <Brightness4Icon fontSize="small" /> : <Brightness7Icon fontSize="small" />}
                            </IconButton>
                        </Tooltip>
                        {user && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1, pl: 2, borderLeft: '1px solid #ffffff30' }}>
                                <Typography sx={{ color: '#D4D6B9', fontSize: 13 }}>
                                    {user.nombre}
                                </Typography>
                                <Tooltip title="Cerrar sesión">
                                    <IconButton onClick={handleLogout} size="small" sx={{ color: '#D4D6B9', '&:hover': { color: '#ffffff' } }}>
                                        <LogoutIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    )
}
