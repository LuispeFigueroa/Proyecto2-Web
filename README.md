# Tienda Musical — Proyecto 2

Aplicación web para gestionar el inventario y ventas de una tienda de instrumentos musicales.

Desarrollada con React, FastAPI y PostgreSQL. Desplegada mediante Docker.

**README y parte de la documentacion fueron asistidas por IA**

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React + Vite + Material UI |
| Backend | FastAPI (Python) |
| Base de datos | PostgreSQL 15 |
| Infraestructura | Docker + Docker Compose |

---

## Version en produccion

La aplicacion esta desplegada y disponible en:

| Servicio | URL |
|---|---|
| Aplicacion web | https://proyecto2-web.vercel.app |
| API | https://proyecto2-web-production.up.railway.app |
| Documentacion API | https://proyecto2-web-production.up.railway.app/docs |

### Usuarios de prueba (produccion)

Todos los usuarios tienen la contrasena `password123`.

| Usuario | Nombre | Cargo |
|---|---|---|
| cmendez | Carlos Mendez | Gerente |
| sherrera | Sofia Herrera | Vendedora |
| mtorres | Miguel Torres | Vendedor |
| agarcia | Ana Garcia | Cajera |
| edavis | Emily Davis | Contadora |

---

## Correr localmente

### Requisitos

- Docker Desktop instalado y corriendo
- Git

No se requiere instalar Python, Node.js ni ninguna otra dependencia. Docker se encarga de todo.

### 1. Clonar el repositorio

```bash
git clone https://github.com/LuispeFigueroa/Proyecto2Web.git
cd Proyecto2Web
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

El archivo `.env` ya viene con las credenciales correctas. No es necesario modificarlo.

### 3. Levantar el proyecto

```bash
docker compose up --build
```

Este comando levanta los tres servicios automaticamente:

- Base de datos PostgreSQL, inicializada con el esquema y datos de prueba
- Backend FastAPI
- Frontend React

La primera vez puede tardar unos minutos mientras Docker descarga las imagenes.

### 4. Acceder a la aplicacion

| Servicio | URL |
|---|---|
| Aplicacion web | http://localhost:5173 |
| API | http://localhost:8000 |
| Documentacion API | http://localhost:8000/docs |

### 5. Detener el proyecto

```bash
docker compose down
```

Para eliminar tambien los datos almacenados:

```bash
docker compose down -v
```

---

## Credenciales

### Base de datos

| Variable | Valor |
|---|---|
| Usuario | proy2 |
| Contrasena | secret |
| Base de datos | tienda_db |
| Host | db |

---

## Autenticacion

La aplicacion usa bcrypt para hashear las contrasenas. Ningun password se guarda en texto plano.

### Login
Ingresa con tu usuario y contrasena en la pantalla de login. La sesion se mantiene activa usando React Context y localStorage.

### Crear cuenta
Un empleado nuevo puede registrarse en `/register`. El formulario crea el empleado y su cuenta de acceso en una sola transaccion. Se requiere:

- Nombre completo
- Cargo
- Email
- Usuario
- Contrasena (minimo 6 caracteres)

### Seguridad
- Las contrasenas se hashean con bcrypt antes de guardarse en la base de datos
- La verificacion de contrasena se hace comparando el hash, nunca el texto plano
- Las rutas del frontend estan protegidas con React Router y AuthContext

### Login
Ingresa con tu usuario y contrasena en la pantalla de login. La sesion se mantiene activa usando React Context y localStorage.

### Crear cuenta
Un empleado nuevo puede registrarse en `/register`. El formulario crea el empleado y su cuenta de acceso en una sola transaccion. Se requiere:

- Nombre completo
- Cargo
- Email
- Usuario
- Contrasena (minimo 6 caracteres)

### Usuarios de prueba

Todos los usuarios de prueba tienen la contrasena `password123`.

| Usuario | Nombre | Cargo |
|---|---|---|
| cmendez | Carlos Mendez | Gerente |
| sherrera | Sofia Herrera | Vendedora |
| mtorres | Miguel Torres | Vendedor |
| agarcia | Ana Garcia | Cajera |
| rsilva | Roberto Silva | Vendedor |

---

## Estructura del proyecto

```
Proyecto2Web/
├── docker-compose.yml
├── .env.example
├── README.md
├── db/
│   └── init.sql
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── main.py
│   ├── database.py
│   └── routers/
│       ├── auth.py
│       ├── productos.py
│       ├── clientes.py
│       ├── empleados.py
│       ├── ventas.py
│       └── reportes.py
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── eslint.config.js
    ├── vite.config.js
    └── src/
        ├── context/
        │   ├── AuthContext.jsx
        │   ├── ThemeContext.jsx
        │   └── VentaContext.jsx
        ├── components/
        │   └── Navbar.jsx
        ├── pages/
        │   ├── Login.jsx
        │   ├── Home.jsx
        │   ├── Productos.jsx
        │   ├── Clientes.jsx
        │   ├── Ventas.jsx
        │   └── Reportes.jsx
        └── api/
            └── axios.js
```

---

## Funcionalidades

### Autenticacion
La aplicacion requiere login para acceder. Todas las rutas estan protegidas mediante React Router y AuthContext. El estado de sesion se persiste en localStorage.

### CRUD
- Productos — crear, ver, editar y eliminar productos con categoria y proveedor
- Clientes — crear, ver, editar y eliminar clientes
- Ventas — registrar ventas con multiples productos, ver detalle y eliminar

### Reportes
- Ventas por mes con GROUP BY y HAVING
- Top productos con CTE y RANK()
- Ventas por cliente con totales agregados
- Ventas por periodo con filtro de fechas
- Vista detallada desde vista SQL
- Clientes guitarristas con subquery IN
- Productos sin ventas con NOT EXISTS
- Exportar cualquier reporte a CSV

### React
- React Router con 6 rutas
- AuthContext para sesion de usuario
- ThemeContext con useMemo
- VentaContext con useReducer y useCallback para el carrito de ventas
- Formularios controlados con validacion del lado del cliente
- Diseño responsivo con menu hamburguesa en movil

---

## Endpoints

### Autenticacion

| Metodo | Ruta | Descripcion |
|---|---|---|
| POST | /auth/login | Iniciar sesion |

### Productos

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | /productos | Lista todos los productos |
| GET | /productos/{id} | Obtiene un producto |
| POST | /productos | Crea un producto |
| PUT | /productos/{id} | Actualiza un producto |
| DELETE | /productos/{id} | Elimina un producto |

### Clientes

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | /clientes | Lista todos los clientes |
| GET | /clientes/{id} | Obtiene un cliente |
| POST | /clientes | Crea un cliente |
| PUT | /clientes/{id} | Actualiza un cliente |
| DELETE | /clientes/{id} | Elimina un cliente |

### Empleados

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | /empleados | Lista todos los empleados |

### Ventas

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | /ventas | Lista todas las ventas |
| GET | /ventas/{id} | Obtiene una venta con su detalle |
| POST | /ventas | Registra una venta con transaccion explicita |
| DELETE | /ventas/{id} | Elimina una venta |

### Reportes

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | /reportes/ventas-por-mes | GROUP BY + HAVING + agregacion |
| GET | /reportes/productos-mas-vendidos | CTE con RANK() |
| GET | /reportes/ventas-por-cliente | Total gastado por cliente |
| GET | /reportes/ventas-por-periodo | Filtro por rango de fechas |
| GET | /reportes/vista-ventas | Datos desde vista SQL |
| GET | /reportes/clientes-guitarristas | Subquery con IN |
| GET | /reportes/productos-sin-ventas | Subquery con NOT EXISTS |
| GET | /reportes/resumen | Metricas agregadas generales |

---

## Calidad de codigo

ESLint configurado para el proyecto. Para verificar:

```bash
cd frontend
npm run lint
```

---

## Pruebas unitarias

El proyecto incluye pruebas unitarias con Vitest y React Testing Library.

Para correr las pruebas:

```bash
cd frontend
npm run test
```

### Pruebas incluidas

| Prueba | Descripcion |
|---|---|
| Login renderiza el formulario | Verifica que los campos de usuario y contraseña se renderizan correctamente |
| Login validacion campos vacios | Verifica que se muestra un mensaje de error al enviar el formulario sin credenciales |
| VentaContext agrega productos | Verifica que el reducer agrega productos al carrito y calcula el total correctamente |

## Autor

Luis Pedro Figueroa

