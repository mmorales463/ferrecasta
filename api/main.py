from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

# ============================================================
# 🚀 Configuración de la aplicación
# ============================================================
app = FastAPI(
    title="Ferretería Castaño API",
    description="API y frontend de Ferretería Castaño S.A.S.",
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
# 📁 Directorios base
# ============================================================
BASE_DIR = os.path.dirname(__file__)  # api/
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, ".."))  # PaginaFerreCastano/
FRONTEND_DIR = os.path.join(PROJECT_ROOT, "frontend")
STATIC_DIR = os.path.join(PROJECT_ROOT, "static")

# ============================================================
# 📦 Archivos estáticos (imagenes, css, js)
# ============================================================
# Sirve las imágenes (logo, productos, etc.)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# Sirve el frontend (css y js)
app.mount("/frontend", StaticFiles(directory=FRONTEND_DIR), name="frontend")

# ============================================================
# 🧰 API de productos
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
# 🌐 Páginas del frontend
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
