import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Box, Paper, Typography, TextField, Button, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import api from '../api/axios'

const CARGOS = ['Vendedor', 'Vendedora', 'Cajero', 'Cajera', 'Bodeguero', 'Tecnico', 'Gerente', 'Contador', 'Recepcionista']

export default function Register() {
    const [form, setForm] = useState({ nombre: '', cargo: '', email: '', username: '', password: '', confirmar: '' })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async () => {
        if (!form.nombre || !form.cargo || !form.email || !form.username || !form.password || !form.confirmar) {
            setError('Todos los campos son obligatorios')
            return
        }
        if (form.password !== form.confirmar) {
            setError('Las contraseñas no coinciden')
            return
        }
        if (form.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres')
            return
        }
        setLoading(true)
        setError('')
        try {
            await api.post('/auth/register', {
                nombre: form.nombre,
                cargo: form.cargo,
                email: form.email,
                username: form.username,
                password: form.password,
            })
            setSuccess('Empleado y cuenta creados exitosamente')
            setTimeout(() => navigate('/login'), 1500)
        } catch (e) {
            setError(e.response?.data?.detail || 'Error al crear cuenta')
        } finally {
            setLoading(false)
        }
    }

    const fieldSx = {
        '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#c8cab0' },
            '&:hover fieldset': { borderColor: '#42273B' },
            '&.Mui-focused fieldset': { borderColor: '#42273B' },
        },
        '& .MuiInputLabel-root.Mui-focused': { color: '#42273B' },
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#D4D6B9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper sx={{ width: 420, p: 4, borderRadius: 3, border: '1px solid #c8cab0', boxShadow: 'none' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#6C8EAD' }} />
                    <Typography sx={{ fontSize: 18, fontWeight: 600, color: '#42273B' }}>Tienda Musical</Typography>
                </Box>

                <Typography sx={{ fontSize: 22, fontWeight: 600, color: '#42273B', mb: 0.5 }}>Nuevo empleado</Typography>
                <Typography sx={{ fontSize: 13, color: '#6b6b55', mb: 3 }}>Crea el perfil y cuenta de acceso</Typography>

                {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{success}</Alert>}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                        <TextField name="nombre" label="Nombre completo *"
                            value={form.nombre} onChange={handleChange} size="small" sx={{ ...fieldSx, gridColumn: '1 / -1' }} />

                        <FormControl size="small" sx={fieldSx}>
                            <InputLabel>Cargo *</InputLabel>
                            <Select name="cargo" value={form.cargo} onChange={handleChange} label="Cargo *">
                                {CARGOS.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                            </Select>
                        </FormControl>

                        <TextField name="email" label="Email *"
                            value={form.email} onChange={handleChange} size="small" sx={fieldSx} />
                    </Box>

                    <Typography sx={{ fontSize: 12, color: '#6b6b55', mt: 1 }}>Credenciales de acceso</Typography>

                    <TextField name="username" label="Usuario *"
                        value={form.username} onChange={handleChange} size="small" fullWidth sx={fieldSx} />
                    <TextField name="password" label="Contraseña *" type="password"
                        value={form.password} onChange={handleChange} size="small" fullWidth sx={fieldSx} />
                    <TextField name="confirmar" label="Confirmar contraseña *" type="password"
                        value={form.confirmar} onChange={handleChange} size="small" fullWidth sx={fieldSx} />

                    <Button onClick={handleSubmit} variant="contained" fullWidth disabled={loading}
                        sx={{ mt: 1, bgcolor: '#42273B', '&:hover': { bgcolor: '#2e1a28' }, borderRadius: 2, py: 1.2, textTransform: 'none', fontSize: 14 }}>
                        {loading ? 'Creando...' : 'Crear empleado y cuenta'}
                    </Button>

                    <Typography sx={{ fontSize: 13, color: '#6b6b55', textAlign: 'center' }}>
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/login" style={{ color: '#42273B', fontWeight: 600 }}>Inicia sesión</Link>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    )
}