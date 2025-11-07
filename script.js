// === CAMBIO DE SECCIONES ===
const enlaces = document.querySelectorAll("nav a");
const secciones = document.querySelectorAll(".seccion");

enlaces.forEach(enlace => {
  enlace.addEventListener("click", e => {
    e.preventDefault();

    // Cambiar clase activa en menú
    enlaces.forEach(a => a.classList.remove("activo"));
    enlace.classList.add("activo");

    // Mostrar sección seleccionada
    const id = enlace.getAttribute("data-seccion");
    secciones.forEach(sec => sec.classList.remove("activa"));
    document.getElementById(id).classList.add("activa");
  });
});

// === CARRITO ===
let carrito = [];
const carritoDiv = document.getElementById("carrito");
const carritoItems = document.getElementById("carrito-items");
const contador = document.getElementById("contador");
const total = document.getElementById("total");
const finalizarBtn = document.getElementById("finalizarCompra");

// Mostrar / Ocultar carrito
document.getElementById("carrito-btn").addEventListener("click", () => {
  carritoDiv.classList.toggle("activo");
});

// Agregar producto al carrito
function agregarAlCarrito(nombre, precio, img) {
  const item = carrito.find(i => i.nombre === nombre);
  if (item) {
    item.cantidad++;
  } else {
    carrito.push({ nombre, precio, img, cantidad: 1 });
  }
  actualizarCarrito();
}

// Actualizar vista del carrito
function actualizarCarrito() {
  carritoItems.innerHTML = "";
  let totalCompra = 0;

  carrito.forEach(item => {
    totalCompra += item.precio * item.cantidad;

    const div = document.createElement("div");
    div.classList.add("item-carrito");
    div.innerHTML = `
      <img src="${item.img}" width="40">
      <span>${item.nombre}</span>
      <span>x${item.cantidad}</span>
      <div class="botones-carrito">
        <button onclick="aumentarCantidad('${item.nombre}')">+</button>
        <button onclick="disminuirCantidad('${item.nombre}')">-</button>
        <button onclick="eliminarProducto('${item.nombre}')">🗑️</button>
      </div>
    `;
    carritoItems.appendChild(div);
  });

  contador.textContent = carrito.reduce((acc, i) => acc + i.cantidad, 0);
  total.textContent = `Total: $${totalCompra.toLocaleString()}`;
}

// Aumentar cantidad
function aumentarCantidad(nombre) {
  const item = carrito.find(i => i.nombre === nombre);
  if (item) item.cantidad++;
  actualizarCarrito();
}

// Disminuir cantidad
function disminuirCantidad(nombre) {
  const item = carrito.find(i => i.nombre === nombre);
  if (item) {
    item.cantidad--;
    if (item.cantidad <= 0) eliminarProducto(nombre);
  }
  actualizarCarrito();
}

// Eliminar un producto del carrito
function eliminarProducto(nombre) {
  carrito = carrito.filter(i => i.nombre !== nombre);
  actualizarCarrito();
}

// Vaciar todo el carrito
function vaciarCarrito() {
  carrito = [];
  actualizarCarrito();
  alert("Carrito vaciado correctamente.");
}

// Finalizar compra
if (finalizarBtn) {
  finalizarBtn.addEventListener("click", () => {
    if (carrito.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }
    alert("Compra finalizada. Se generará un documento con tu pedido (simulado).");
    vaciarCarrito();
  });
}

// === FORMULARIO DE CONTACTO ===
const form = document.getElementById("formContacto");
if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault();
    alert("Mensaje enviado correctamente. Gracias por contactarnos.");
    form.reset();
  });
}
