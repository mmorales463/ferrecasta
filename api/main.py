from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os
import logging
from datetime import datetime

# ============================================================
# 🚀 Configuración de FastAPI
# ============================================================
app = FastAPI(
    title="Ferretería Castaño API",
    description="Backend y servidor de frontend de Ferretería Castaño S.A.S.",
    version="1.0.0"
)

# ============================================================
# 🌍 CORS
# ============================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# 📁 Rutas de carpetas
# ============================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # api/
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, ".."))  
FRONTEND_DIR = os.path.join(PROJECT_ROOT, "frontend")
STATIC_DIR = os.path.join(PROJECT_ROOT, "static")

# ============================================================
# 📦 Archivos estáticos (img, css, js)
# ============================================================
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
app.mount("/frontend", StaticFiles(directory=FRONTEND_DIR), name="frontend")

# ============================================================
# 🧰 LOGGING DE REQUESTS PARA AZURE LOG STREAM
# ============================================================
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = datetime.utcnow()
    logging.info(f"➡️ Request: {request.method} {request.url}")
    response = await call_next(request)
    process_time = (datetime.utcnow() - start_time).total_seconds()
    logging.info(f"⬅️ Response: {response.status_code} {request.url} - {process_time:.3f}s")
    return response

# ============================================================
# 🧰 API DE PRODUCTOS (RF2)
# ============================================================
@app.get("/api/productos")
async def obtener_productos():
    return [
        {"nombre": "Martillo", "precio": 22000, "imagen": "/static/martillo.png"},
        {"nombre": "Taladro", "precio": 150000, "imagen": "/static/taladro.jpg"},
        {"nombre": "Llave Inglesa", "precio": 30000, "imagen": "/static/llave.png"},
        {"nombre": "Batería", "precio": 12000, "imagen": "/static/bateria.png"},
    ]

# ============================================================
# 📩 API: Contacto (RF6)
# ============================================================
class Contacto(BaseModel):
    nombre: str
    correo: str
    mensaje: str

@app.post("/api/contacto")
async def recibir_contacto(data: Contacto):
    logging.info("📨 Nuevo mensaje desde formulario:")
    logging.info(f"Nombre: {data.nombre}")
    logging.info(f"Correo: {data.correo}")
    logging.info(f"Mensaje: {data.mensaje}")
    return {"status": "ok", "mensaje": "Mensaje recibido exitosamente"}

# ============================================================
# 🌐 SERVIR LAS PÁGINAS HTML
# ============================================================
@app.get("/")
async def home():
    return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))

@app.get("/productos")
async def productos():
    return FileResponse(os.path.join(FRONTEND_DIR, "productos.html"))

@app.get("/contacto")
async def contacto():
    return FileResponse(os.path.join(FRONTEND_DIR, "contacto.html"))

@app.get("/quienes-somos")
async def quienes_somos():
    return FileResponse(os.path.join(FRONTEND_DIR, "quienes-somos.html"))
