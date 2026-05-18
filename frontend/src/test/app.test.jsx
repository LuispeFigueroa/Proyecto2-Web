import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { VentaProvider } from '../context/VentaContext'
import { ThemeProvider as MuiThemeProvider } from '@mui/material'
import theme from '../theme'
import Login from '../pages/Login'


// Mock de axios
vi.mock('../api/axios', () => ({
    default: {
        post: vi.fn(),
        get: vi.fn(() => Promise.resolve({ data: [] })),
    }
}))

const Wrapper = ({ children }) => (
    <MemoryRouter>
        <AuthProvider>
            <VentaProvider>
                <MuiThemeProvider theme={theme}>
                    {children}
                </MuiThemeProvider>
            </VentaProvider>
        </AuthProvider>
    </MemoryRouter>
)

//  renderiza correctamente
describe('Login', () => {
    it('renderiza el formulario de login', () => {
        render(<Wrapper><Login /></Wrapper>)
        expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument()
    })
})

// Validacion de campos vacios
// Prueba 2 — Validacion de campos vacios
// Prueba 2 — Validacion de campos vacios
describe('Login validacion', () => {
    it('muestra error si los campos estan vacios', async () => {
        render(<Wrapper><Login /></Wrapper>)
        const btn = screen.getByRole('button', { name: /ingresar/i })
        fireEvent.submit(btn)
        expect(await screen.findByText(/credenciales incorrectas/i)).toBeInTheDocument()
    })
})

// VentaContext agrega productos correctamente
import { renderHook, act } from '@testing-library/react'
import { useVenta } from '../context/VentaContext'

describe('VentaContext', () => {
    it('agrega un producto al carrito correctamente', () => {
        const wrapper = ({ children }) => (
            <VentaProvider>{children}</VentaProvider>
        )
        const { result } = renderHook(() => useVenta(), { wrapper })

        act(() => {
            result.current.addItem({
                id_producto: 1,
                nombre: 'Guitarra Fender',
                precio: 4500
            })
        })

        expect(result.current.items).toHaveLength(1)
        expect(result.current.items[0].nombre).toBe('Guitarra Fender')
        expect(result.current.total).toBe(4500)
    })
})