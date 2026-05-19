from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import productos, clientes, ventas, reportes, auth, empleados

app = FastAPI(title="Tienda LP", redirect_slashes=False)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(productos.router, prefix="/productos", tags=["Productos"])
app.include_router(clientes.router, prefix="/clientes", tags=["Clientes"])
app.include_router(ventas.router, prefix="/ventas", tags=["Ventas"])
app.include_router(reportes.router, prefix="/reportes", tags=["Reportes"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(empleados.router, prefix="/empleados", tags=["Empleados"])
@app.get("/")
def root():
    return {"message": "Tienda LP en linea"}