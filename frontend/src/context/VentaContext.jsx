import { createContext, useContext, useReducer, useCallback } from 'react'

const VentaContext = createContext(null)

const initialState = {
    cliente: null,
    empleado: null,
    items: [],
}

function ventaReducer(state, action) {
    switch (action.type) {
        case 'SET_CLIENTE':
            return { ...state, cliente: action.payload }

        case 'SET_EMPLEADO':
            return { ...state, empleado: action.payload }

        case 'ADD_ITEM': {
            const exists = state.items.find(i => i.id_producto === action.payload.id_producto)
            if (exists) {
                return {
                    ...state,
                    items: state.items.map(i =>
                        i.id_producto === action.payload.id_producto
                            ? { ...i, cantidad: i.cantidad + 1 }
                            : i
                    )
                }
            }
            return { ...state, items: [...state.items, { ...action.payload, cantidad: 1 }] }
        }

        case 'REMOVE_ITEM':
            return { ...state, items: state.items.filter(i => i.id_producto !== action.payload) }

        case 'UPDATE_CANTIDAD':
            return {
                ...state,
                items: state.items.map(i =>
                    i.id_producto === action.payload.id_producto
                        ? { ...i, cantidad: action.payload.cantidad }
                        : i
                )
            }

        case 'RESET':
            return initialState

        default:
            return state
    }
}

export function VentaProvider({ children }) {
    const [state, dispatch] = useReducer(ventaReducer, initialState)

    const setCliente = useCallback((cliente) => {
        dispatch({ type: 'SET_CLIENTE', payload: cliente })
    }, [])

    const setEmpleado = useCallback((empleado) => {
        dispatch({ type: 'SET_EMPLEADO', payload: empleado })
    }, [])

    const addItem = useCallback((producto) => {
        dispatch({ type: 'ADD_ITEM', payload: producto })
    }, [])

    const removeItem = useCallback((id_producto) => {
        dispatch({ type: 'REMOVE_ITEM', payload: id_producto })
    }, [])

    const updateCantidad = useCallback((id_producto, cantidad) => {
        dispatch({ type: 'UPDATE_CANTIDAD', payload: { id_producto, cantidad } })
    }, [])

    const reset = useCallback(() => {
        dispatch({ type: 'RESET' })
    }, [])

    const total = state.items.reduce((acc, i) => acc + i.precio * i.cantidad, 0)

    return (
        <VentaContext.Provider value={{
            ...state,
            total,
            setCliente,
            setEmpleado,
            addItem,
            removeItem,
            updateCantidad,
            reset
        }}>
            {children}
        </VentaContext.Provider>
    )
}

export function useVenta() {
    return useContext(VentaContext)
}