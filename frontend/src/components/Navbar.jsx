import { AppBar, Toolbar, Typography, Button, Box, IconButton, Tooltip } from '@mui/material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'
import LogoutIcon from '@mui/icons-material/Logout'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout } = useAuth()

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
        <AppBar position="fixed" sx={{ bgcolor: '#6C8EAD', borderBottom: '1px solid #5a7a9a', boxShadow: 'none' }}>
            <Toolbar>
                <Box
                    component={Link}
                    to="/"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', flexGrow: 1 }}
                >
                    <MusicNoteIcon sx={{ color: '#D4D6B9', mr: 0.5 }} />
                    <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700 }}>
                        Tienda Musical
                    </Typography>
                </Box>

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

                    {user && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2, pl: 2, borderLeft: '1px solid #ffffff30' }}>
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
            </Toolbar>
        </AppBar>
    )
}