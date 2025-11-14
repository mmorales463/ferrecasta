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

// === CARGAR PRODUCTOS ===
function cargarProductos() {
  const productosContainer = document.querySelector(".productos");
  if (!productosContainer) return;

  const productos = [
    new Producto("Martillo", 22000, "/static/martillo.png"),
    new Producto("Taladro", 150000, "/static/taladro.jpg"),
    new Producto("Llave Inglesa", 30000, "/static/llave.png"),
    new Producto("Batería", 12000, "/static/bateria.png")
  ];

  productosContainer.innerHTML = productos
    .map(
      (p, i) => `
      <div class="producto" style="animation-delay: ${i * 0.1}s;">
        <img src="${p.img}" alt="${p.nombre}">
        <h3>${p.nombre}</h3>
        <p>$${p.precio.toLocaleString()}</p>
        <button onclick="agregarAlCarrito('${p.nombre}', ${p.precio}, '${p.img}')">
          Agregar al carrito
        </button>
      </div>
    `
    )
    .join("");
}

// === EVENTOS ===
document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
  renderizarCarrito();
  actualizarContadorCarrito();

  // Toggle carrito al hacer click en el icono
  const carritoBtn = document.getElementById("carrito-btn");
  const carritoDiv = document.getElementById("carrito");

  if (carritoBtn && carritoDiv) {
    carritoBtn.addEventListener("click", () => {
      carritoDiv.style.display = carritoDiv.style.display === "none" ? "block" : "none";
    });
  }
});
