from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os

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
BASE_DIR = os.path.dirname(__file__)          # api/
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, ".."))  
FRONTEND_DIR = os.path.join(PROJECT_ROOT, "frontend")
STATIC_DIR = os.path.join(PROJECT_ROOT, "static")

# ============================================================
# 📦 Archivos estáticos (img, css, js)
# ============================================================
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


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
    print("📨 Nuevo mensaje recibido desde el formulario:")
    print(f"Nombre: {data.nombre}")
    print(f"Correo: {data.correo}")
    print(f"Mensaje: {data.mensaje}")
    
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


# ============================================================
# 📄 SERVIR CSS Y JS (Incluye contacto.js)
# ============================================================
@app.get("/style.css")
async def style_css():
    return FileResponse(os.path.join(FRONTEND_DIR, "style.css"))

@app.get("/script.js")
async def script_js():
    return FileResponse(os.path.join(FRONTEND_DIR, "script.js"))

@app.get("/contacto.js")
async def contacto_js():
    return FileResponse(os.path.join(FRONTEND_DIR, "contacto.js"))
