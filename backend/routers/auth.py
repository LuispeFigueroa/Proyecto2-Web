from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import get_connection

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(req: LoginRequest):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            SELECT u.id_usuario, u.username, e.nombre, e.cargo
            FROM usuarios u
            JOIN empleados e ON e.id_empleado = u.id_empleado
            WHERE u.username = %s
        """, (req.username,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
        cols = [d[0] for d in cur.description]
        user = dict(zip(cols, row))
        return {"user": user}
    finally:
        cur.close()
        conn.close()