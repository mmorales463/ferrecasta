// === CLASES ===
class Producto {
  constructor(nombre, precio, img, cantidad = 1) {
    this.nombre = nombre;
    this.precio = precio;
    this.img = img;
    this.cantidad = cantidad;
  }
}

// === UTILIDADES ===
function obtenerCarrito() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
  const carrito = obtenerCarrito();
  const contador = document.getElementById("contador");

  if (contador) {
    const totalItems = carrito.reduce((sum, p) => sum + p.cantidad, 0);
    contador.textContent = totalItems;
  }

  const totalElem = document.getElementById("total");
  if (totalElem) {
    const total = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
    totalElem.textContent = `Total: $${total.toLocaleString()}`;
  }
}

// === FUNCIONES DEL CARRITO ===
function agregarAlCarrito(nombre, precio, img) {
  const carrito = obtenerCarrito();
  const index = carrito.findIndex(p => p.nombre === nombre);

  if (index !== -1) {
    // Limite máximo por producto
    if (carrito[index].cantidad < 50) {
      carrito[index].cantidad += 1;
    } else {
      alert("Has alcanzado la cantidad máxima de 50 unidades por producto.");
    }
  } else {
    carrito.push(new Producto(nombre, precio, img));
  }

  guardarCarrito(carrito);
  renderizarCarrito();
}

function eliminarDelCarrito(nombre) {
  const carrito = obtenerCarrito();
  const index = carrito.findIndex(p => p.nombre === nombre);

  if (index !== -1) {
    carrito[index].cantidad -= 1;
    if (carrito[index].cantidad <= 0) {
      carrito.splice(index, 1);
    }
  }

  guardarCarrito(carrito);
  renderizarCarrito();
}

function aumentarCantidad(nombre) {
  const carrito = obtenerCarrito();
  const index = carrito.findIndex(p => p.nombre === nombre);

  if (index !== -1) {
    if (carrito[index].cantidad < 50) {
      carrito[index].cantidad += 1;
    } else {
      alert("Has alcanzado la cantidad máxima de 50 unidades por producto.");
    }
  }

  guardarCarrito(carrito);
  renderizarCarrito();

  // Animación al aumentar
  const cantidadSpans = document.querySelectorAll(".item-carrito");
  cantidadSpans.forEach(div => {
    const span = div.querySelector(".cantidad");
    const productoNombre = div.querySelector("span").textContent.split(" - ")[0];
    if (productoNombre === nombre) {
      span.classList.add("cantidad-pop");
      setTimeout(() => span.classList.remove("cantidad-pop"), 200);
    }
  });
}

function vaciarCarrito() {
  localStorage.removeItem("carrito");
  renderizarCarrito();
}

// === MOSTRAR CARRITO ===
function renderizarCarrito() {
  const carrito = obtenerCarrito();
  const carritoContainer = document.getElementById("carrito-items");
  const totalElem = document.getElementById("total");

  if (!carritoContainer) return;

  if (carrito.length === 0) {
    carritoContainer.innerHTML = "<p>🛒 El carrito está vacío</p>";
    if (totalElem) totalElem.textContent = "Total: $0";
    actualizarContadorCarrito();
    return;
  }

  carritoContainer.innerHTML = carrito
    .map(
      (p) => `
      <div class="item-carrito">
        <img src="${p.img}" alt="${p.nombre}" width="50">
        <span>${p.nombre} - $${(p.precio * p.cantidad).toLocaleString()}</span>
        <div class="cantidad-control">
          <button class="menos" onclick="eliminarDelCarrito('${p.nombre}')">–</button>
          <span class="cantidad">${p.cantidad}</span>
          <button class="mas" onclick="aumentarCantidad('${p.nombre}')">+</button>
        </div>
      </div>
    `
    )
    .join("");

  const total = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
  if (totalElem) totalElem.textContent = `Total: $${total.toLocaleString()}`;
  actualizarContadorCarrito();
}

// === CARGAR PRODUCTOS DESDE FASTAPI ===
async function cargarProductos() {
  const productosContainer = document.querySelector(".productos");
  if (!productosContainer) return;

  try {
    const res = await fetch("/api/productos");
    const productos = await res.json();

    productosContainer.innerHTML = productos
      .map(
        (p, i) => `
        <div class="producto" style="animation-delay: ${i * 0.1}s;">
          <img src="${p.imagen}" alt="${p.nombre}">
          <h3>${p.nombre}</h3>
          <p>$${p.precio.toLocaleString()}</p>
          <button onclick="agregarAlCarrito('${p.nombre}', ${p.precio}, '${p.imagen}')">
            Agregar al carrito
          </button>
        </div>
      `
      )
      .join("");

  } catch (error) {
    console.error("Error cargando productos:", error);
    productosContainer.innerHTML = "<p>Error cargando productos.</p>";
  }
}

// =========================
//   FORMULARIO DE CONTACTO (RF6)
// =========================
const formContacto = document.getElementById("formContacto");

if (formContacto) {
  formContacto.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      nombre: document.getElementById("nombre").value,
      correo: document.getElementById("correo").value,
      mensaje: document.getElementById("mensaje").value
    };

    try {
      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert("Mensaje enviado correctamente.");
        formContacto.reset();
      } else {
        alert("Error al enviar el mensaje.");
      }
    } catch (error) {
      alert("Error de conexión con el servidor.");
    }
  });
}

// === EVENTOS ===
document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
  renderizarCarrito();
  actualizarContadorCarrito();

  // Toggle carrito
  const carritoBtn = document.getElementById("carrito-btn");
  const carritoDiv = document.getElementById("carrito");

  if (carritoBtn && carritoDiv) {
    carritoBtn.addEventListener("click", () => {
      carritoDiv.style.display = carritoDiv.style.display === "none" ? "block" : "none";
    });
  }
});
