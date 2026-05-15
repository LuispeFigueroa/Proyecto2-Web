from fastapi import APIRouter
from database import get_connection

router = APIRouter()

@router.get("/")
def get_empleados():
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT id_empleado, nombre, cargo FROM empleados ORDER BY nombre")
        rows = cur.fetchall()
        cols = [d[0] for d in cur.description]
        return [dict(zip(cols, row)) for row in rows]
    finally:
        cur.close()
        conn.close()