// === CAMBIO DE SECCIONES ===
const links = document.querySelectorAll("nav a");
const secciones = document.querySelectorAll(".seccion");

links.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    links.forEach(l => l.classList.remove("activo"));
    link.classList.add("activo");

    const id = link.getAttribute("href").replace("#", "");
    secciones.forEach(s => s.classList.remove("activa"));
    document.getElementById(id).classList.add("activa");
  });
});

// === PRODUCTOS DINÁMICOS ===
const productosDiv = document.querySelector(".productos");

const productos = [
  { nombre: "Martillo", precio: 25000, imagen: "martillo.png" },
  { nombre: "bateria", precio: 15000, imagen: "bateria.png" },
  { nombre: "flexometro", precio: 18000, imagen: "flexometro.jpg" },
  { nombre: "Taladro", precio: 180000, imagen: "taladro.jpg" },
  { nombre: "Llave inglesa", precio: 28000, imagen: "llave.png" }
];


productos.forEach(p => {
  const div = document.createElement("div");
  div.classList.add("producto");
  div.innerHTML = `
    <img src="${p.imagen}" alt="${p.nombre}">
    <h3>${p.nombre}</h3>
    <p>$${p.precio.toLocaleString()}</p>
    <button onclick="agregarAlCarrito('${p.nombre}', ${p.precio})">Agregar</button>
  `;
  productosDiv.appendChild(div);
});

// === CARRITO ===
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function actualizarCarrito() {
  const contador = document.getElementById("contador");
  const carritoItems = document.getElementById("carrito-items");
  const total = document.getElementById("total");
  carritoItems.innerHTML = "";

  carrito.forEach((item, i) => {
    const div = document.createElement("div");
    div.innerHTML = `
      ${item.nombre} - $${item.precio.toLocaleString()}
      <button onclick="eliminarItem(${i})">❌</button>
    `;
    carritoItems.appendChild(div);
  });

  contador.textContent = carrito.length;
  total.textContent = carrito.reduce((acc, i) => acc + i.precio, 0).toLocaleString();
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarAlCarrito(nombre, precio) {
  carrito.push({ nombre, precio });
  actualizarCarrito();
}

function eliminarItem(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

function vaciarCarrito() {
  carrito = [];
  actualizarCarrito();
}

function mostrarCarrito() {
  document.getElementById("carrito").classList.toggle("activo");
}

actualizarCarrito();
