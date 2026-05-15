import { useEffect, useState, useCallback } from 'react'
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField,
    Alert, Snackbar, IconButton, Select, MenuItem,
    FormControl, InputLabel, Divider
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useVenta } from '../context/VentaContext'
import api from '../api/axios'

export default function Ventas() {
    const [ventas, setVentas] = useState([])
    const [clientes, setClientes] = useState([])
    const [empleados, setEmpleados] = useState([])
    const [productos, setProductos] = useState([])
    const [open, setOpen] = useState(false)
    const [detalle, setDetalle] = useState(null)
    const [detalleOpen, setDetalleOpen] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [productoSel, setProductoSel] = useState('')

    const { cliente, empleado, items, total, setCliente, setEmpleado, addItem, removeItem, updateCantidad, reset } = useVenta()

    const fetchVentas = useCallback(async () => {
        try {
            const res = await api.get('/ventas')
            setVentas(res.data)
        } catch {
            setError('Error al cargar ventas')
        }
    }, [])

    useEffect(() => { fetchVentas() }, [fetchVentas])

    useEffect(() => {
        api.get('/clientes').then(r => setClientes(r.data)).catch(() => { })
        api.get('/empleados').then(r => setEmpleados(r.data)).catch(() => { })
        api.get('/productos').then(r => setProductos(r.data)).catch(() => { })
    }, [])

    const handleAgregarProducto = () => {
        const p = productos.find(p => p.id_producto === parseInt(productoSel))
        if (!p) return
        addItem({ id_producto: p.id_producto, nombre: p.nombre, precio: parseFloat(p.precio) })
        setProductoSel('')
    }

    const handleSubmit = async () => {
        if (!cliente || !empleado) { setError('Selecciona cliente y empleado'); return }
        if (items.length === 0) { setError('Agrega al menos un producto'); return }
        try {
            await api.post('/ventas', {
                id_cliente: cliente,
                id_empleado: empleado,
                detalle: items.map(i => ({
                    id_producto: i.id_producto,
                    cantidad: i.cantidad,
                    precio_unitario: i.precio
                }))
            })
            setSuccess('Venta registrada exitosamente')
            reset()
            setOpen(false)
            fetchVentas()
        } catch (e) {
            setError(e.response?.data?.detail || 'Error al registrar venta')
        }
    }

    const handleVerDetalle = async (id) => {
        try {
            const res = await api.get(`/ventas/${id}`)
            setDetalle(res.data)
            setDetalleOpen(true)
        } catch {
            setError('Error al cargar detalle')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar esta venta?')) return
        try {
            await api.delete(`/ventas/${id}`)
            setSuccess('Venta eliminada')
            fetchVentas()
        } catch {
            setError('Error al eliminar')
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

    const q = val => `Q${parseFloat(val || 0).toFixed(2)}`

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h5" sx={{ color: '#42273B', fontWeight: 500 }}>
                        Ventas
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b6b55', mt: 0.5 }}>
                        {ventas.length} ventas registradas
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => { setError(''); setOpen(true) }}
                    sx={{ bgcolor: '#42273B', '&:hover': { bgcolor: '#2e1a28' }, borderRadius: 2, textTransform: 'none' }}
                >
                    Nueva venta
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 'none', border: '1px solid #c8cab0' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {['ID', 'Fecha', 'Cliente', 'Empleado', 'Total', 'Acciones'].map(h => (
                                <TableCell key={h} sx={{ color: '#6b6b55', fontWeight: 500, fontSize: 12, borderBottom: '1.5px solid #D4D6B9' }}>
                                    {h}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ventas.map(v => (
                            <TableRow key={v.id_venta} sx={{ '&:hover': { bgcolor: '#f5f5ee' } }}>
                                <TableCell sx={{ color: '#6b6b55', fontSize: 13 }}>{v.id_venta}</TableCell>
                                <TableCell sx={{ color: '#42273B', fontSize: 13 }}>{v.fecha}</TableCell>
                                <TableCell sx={{ color: '#42273B', fontSize: 13, fontWeight: 500 }}>{v.cliente}</TableCell>
                                <TableCell sx={{ color: '#6b6b55', fontSize: 13 }}>{v.empleado}</TableCell>
                                <TableCell sx={{ color: '#DA7422', fontWeight: 600, fontSize: 13 }}>{q(v.total)}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleVerDetalle(v.id_venta)} size="small"
                                        sx={{ color: '#6b6b55', '&:hover': { color: '#42273B' }, mr: 0.5 }}>
                                        <VisibilityIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(v.id_venta)} size="small"
                                        sx={{ color: '#6b6b55', '&:hover': { color: '#DE3C4B' } }}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal nueva venta */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth
                PaperProps={{ sx: { borderRadius: 3, border: '1px solid #c8cab0', boxShadow: 'none' } }}>
                <DialogTitle sx={{ color: '#42273B', fontWeight: 500 }}>Nueva venta</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '12px !important' }}>
                    {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

                    <FormControl size="small" sx={fieldSx}>
                        <InputLabel>Cliente</InputLabel>
                        <Select value={cliente || ''} onChange={e => setCliente(e.target.value)} label="Cliente">
                            {clientes.map(c => <MenuItem key={c.id_cliente} value={c.id_cliente}>{c.nombre}</MenuItem>)}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={fieldSx}>
                        <InputLabel>Empleado</InputLabel>
                        <Select value={empleado || ''} onChange={e => setEmpleado(e.target.value)} label="Empleado">
                            {empleados.map(e => <MenuItem key={e.id_empleado} value={e.id_empleado}>{e.nombre}</MenuItem>)}
                        </Select>
                    </FormControl>

                    <Divider />

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <FormControl size="small" fullWidth sx={fieldSx}>
                            <InputLabel>Agregar producto</InputLabel>
                            <Select value={productoSel} onChange={e => setProductoSel(e.target.value)} label="Agregar producto">
                                {productos.map(p => (
                                    <MenuItem key={p.id_producto} value={p.id_producto}>
                                        {p.nombre} — {q(p.precio)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button onClick={handleAgregarProducto} variant="outlined"
                            sx={{ borderColor: '#42273B', color: '#42273B', borderRadius: 2, textTransform: 'none', whiteSpace: 'nowrap' }}>
                            Agregar
                        </Button>
                    </Box>

                    {items.length > 0 && (
                        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e8e9d8', borderRadius: 2 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        {['Producto', 'Precio', 'Cant.', ''].map(h => (
                                            <TableCell key={h} sx={{ color: '#6b6b55', fontSize: 12, fontWeight: 500 }}>{h}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map(item => (
                                        <TableRow key={item.id_producto}>
                                            <TableCell sx={{ fontSize: 13 }}>{item.nombre}</TableCell>
                                            <TableCell sx={{ fontSize: 13, color: '#DA7422' }}>{q(item.precio)}</TableCell>
                                            <TableCell>
                                                <TextField
                                                    type="number"
                                                    value={item.cantidad}
                                                    onChange={e => updateCantidad(item.id_producto, parseInt(e.target.value) || 1)}
                                                    size="small"
                                                    sx={{ width: 60, ...fieldSx }}
                                                    inputProps={{ min: 1 }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <IconButton onClick={() => removeItem(item.id_producto)} size="small"
                                                    sx={{ color: '#DE3C4B' }}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell colSpan={2} sx={{ fontWeight: 600, color: '#42273B' }}>Total</TableCell>
                                        <TableCell colSpan={2} sx={{ fontWeight: 600, color: '#DA7422' }}>{q(total)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button onClick={() => { reset(); setOpen(false) }} sx={{ color: '#6b6b55', borderRadius: 2, textTransform: 'none' }}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} variant="contained"
                        sx={{ bgcolor: '#42273B', '&:hover': { bgcolor: '#2e1a28' }, borderRadius: 2, textTransform: 'none' }}>
                        Registrar venta
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal detalle */}
            <Dialog open={detalleOpen} onClose={() => setDetalleOpen(false)} maxWidth="sm" fullWidth
                PaperProps={{ sx: { borderRadius: 3, border: '1px solid #c8cab0', boxShadow: 'none' } }}>
                <DialogTitle sx={{ color: '#42273B', fontWeight: 500 }}>
                    Detalle de venta {detalle?.id_venta}
                </DialogTitle>
                <DialogContent>
                    {detalle && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                                <Typography sx={{ fontSize: 13, color: '#6b6b55' }}>Cliente: <strong style={{ color: '#42273B' }}>{detalle.cliente}</strong></Typography>
                                <Typography sx={{ fontSize: 13, color: '#6b6b55' }}>Empleado: <strong style={{ color: '#42273B' }}>{detalle.empleado}</strong></Typography>
                                <Typography sx={{ fontSize: 13, color: '#6b6b55' }}>Fecha: <strong style={{ color: '#42273B' }}>{detalle.fecha}</strong></Typography>
                                <Typography sx={{ fontSize: 13, color: '#DA7422', fontWeight: 600 }}>Total: {q(detalle.total)}</Typography>
                            </Box>
                            <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e8e9d8', borderRadius: 2 }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            {['Producto', 'Cant.', 'Precio Unit.', 'Subtotal'].map(h => (
                                                <TableCell key={h} sx={{ color: '#6b6b55', fontSize: 12, fontWeight: 500 }}>{h}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {detalle.detalle?.map(d => (
                                            <TableRow key={d.id_detalle}>
                                                <TableCell sx={{ fontSize: 13 }}>{d.producto}</TableCell>
                                                <TableCell sx={{ fontSize: 13 }}>{d.cantidad}</TableCell>
                                                <TableCell sx={{ fontSize: 13 }}>{q(d.precio_unitario)}</TableCell>
                                                <TableCell sx={{ fontSize: 13, color: '#DA7422' }}>{q(d.subtotal)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setDetalleOpen(false)} sx={{ color: '#6b6b55', borderRadius: 2, textTransform: 'none' }}>
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert severity="success" sx={{ borderRadius: 2 }}>{success}</Alert>
            </Snackbar>
        </Box>
    )
}