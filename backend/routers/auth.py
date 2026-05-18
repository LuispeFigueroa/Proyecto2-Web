from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import get_connection
import bcrypt

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    nombre: str
    cargo: str
    email: str
    username: str
    password: str

@router.post("/login")
def login(req: LoginRequest):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            SELECT u.id_usuario, u.username, u.password_hash, e.nombre, e.cargo
            FROM usuarios u
            JOIN empleados e ON e.id_empleado = u.id_empleado
            WHERE u.username = %s
        """, (req.username,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
        cols = [d[0] for d in cur.description]
        user = dict(zip(cols, row))
        password_hash = user.pop('password_hash')
        if not bcrypt.checkpw(req.password.encode('utf-8'), password_hash.encode('utf-8')):
            raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
        return {"user": user}
    finally:
        cur.close()
        conn.close()

@router.post("/register", status_code=201)
def register(req: RegisterRequest):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("BEGIN")
        cur.execute("SELECT id_usuario FROM usuarios WHERE username = %s", (req.username,))
        if cur.fetchone():
            raise HTTPException(status_code=400, detail="El usuario ya existe")
        cur.execute("""
            INSERT INTO empleados (nombre, cargo, email, fecha_contrato)
            VALUES (%s, %s, %s, CURRENT_DATE)
            RETURNING id_empleado
        """, (req.nombre, req.cargo, req.email))
        id_empleado = cur.fetchone()[0]
        password_hash = bcrypt.hashpw(req.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        cur.execute("""
            INSERT INTO usuarios (username, password_hash, id_empleado)
            VALUES (%s, %s, %s)
        """, (req.username, password_hash, id_empleado))
        cur.execute("COMMIT")
        return {"message": "Empleado y cuenta creados exitosamente", "id_empleado": id_empleado}
    except HTTPException:
        cur.execute("ROLLBACK")
        raise
    except Exception as e:
        cur.execute("ROLLBACK")
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cur.close()
        conn.close()