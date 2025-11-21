// === CLASES ===
class Producto {
  constructor(nombre, precio, imagen, cantidad = 1) {
    this.nombre = nombre;
    this.precio = precio;
    this.imagen = imagen;  // <--- unificado
    this.cantidad = cantidad;
  }
}

// ============================================
// === RF7: LISTA DOBLEMENTE ENLAZADA ========
// ============================================

class Nodo {
  constructor(producto) {
    this.producto = producto;
    this.prev = null;
    this.next = null;
  }
}

class ListaDoble {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  agregar(producto) {
    const nuevo = new Nodo(producto);

    if (!this.head) {
      this.head = this.tail = nuevo;
      return;
    }

    this.tail.next = nuevo;
    nuevo.prev = this.tail;
    this.tail = nuevo;
  }

  obtenerTodos() {
    const arr = [];
    let actual = this.head;
    while (actual) {
      arr.push(actual.producto);
      actual = actual.next;
    }
    return arr;
  }

  // === Extensión para cumplir OCP ===
  [Symbol.iterator]() {
    let actual = this.head;
    return {
      next() {
        if (actual) {
          const value = actual.producto;
          actual = actual.next;
          return { value, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
}

// Instancia global para productos
const listaProductos = new ListaDoble();


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
function agregarAlCarrito(nombre, precio, imagen) {
  const carrito = obtenerCarrito();
  const index = carrito.findIndex(p => p.nombre === nombre);

  if (index !== -1) {
    if (carrito[index].cantidad < 50) {
      carrito[index].cantidad += 1;
    } else {
      alert("Has alcanzado la cantidad máxima de 50 unidades por producto.");
    }
  } else {
    carrito.push(new Producto(nombre, precio, imagen));
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
        <img src="${p.imagen}" alt="${p.nombre}" width="50">
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

// ===================================
//   CARGAR PRODUCTOS DESDE FASTAPI
//   *MODIFICADO PARA RF7*
// ===================================
async function cargarProductos() {
  const productosContainer = document.querySelector(".productos");
  if (!productosContainer) return;

  try {
    const res = await fetch("/api/productos");
    const productos = await res.json();

    // Convertir cada entrada en un Producto REAL
    productos.forEach(p => {
      listaProductos.agregar(
        new Producto(p.nombre, p.precio, p.imagen)
      );
    });

    const productosMemoria = listaProductos.obtenerTodos();

    productosContainer.innerHTML = productosMemoria
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


// === EVENTOS ===
document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
  renderizarCarrito();
  actualizarContadorCarrito();
});
