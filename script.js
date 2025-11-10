// === CLASES DE PRODUCTOS Y LISTA DOBLE ===
class Producto {
  constructor(nombre, precio, img) {
    this.nombre = nombre;
    this.precio = precio;
    this.img = img;
  }

  toString() {
    return `Producto{nombre=${this.nombre}, precio=${this.precio}}`;
  }
}

class Node {
  constructor(item) {
    this.item = item;
    this.next = null;
    this.prev = null;
  }
}

class ListaDoble {
  constructor() {
    this.first = null;
    this.last = null;
    this.count = 0;
  }

  isEmpty() {
    return this.first === null;
  }

  size() {
    return this.count;
  }

  adicionar(item) {
    this.adicionarFinal(item);
  }

  adicionarInicio(item) {
    const node = new Node(item);
    if (this.isEmpty()) {
      this.first = node;
      this.last = node;
    } else {
      node.next = this.first;
      this.first.prev = node;
      this.first = node;
    }
    this.count++;
  }

  adicionarFinal(item) {
    const node = new Node(item);
    if (this.isEmpty()) {
      this.first = node;
      this.last = node;
    } else {
      node.prev = this.last;
      this.last.next = node;
      this.last = node;
    }
    this.count++;
  }

  obtenerPrimero() {
    return this.first ? this.first.item : null;
  }

  obtenerFinal() {
    return this.last ? this.last.item : null;
  }

  quitarPrimero() {
    if (this.isEmpty()) return null;
    const item = this.first.item;
    this.first = this.first.next;
    if (this.first) this.first.prev = null;
    else this.last = null;
    this.count--;
    return item;
  }

  quitarUltimo() {
    if (this.isEmpty()) return null;
    const item = this.last.item;
    this.last = this.last.prev;
    if (this.last) this.last.next = null;
    else this.first = null;
    this.count--;
    return item;
  }

  vaciar() {
    this.first = null;
    this.last = null;
    this.count = 0;
  }

  obtener(index) {
    if (index < 0 || index >= this.count) return null;

    let current;
    if (index <= this.count / 2) {
      current = this.first;
      for (let i = 0; i < index; i++) current = current.next;
    } else {
      current = this.last;
      for (let i = this.count - 1; i > index; i--) current = current.prev;
    }
    return current.item;
  }

  [Symbol.iterator]() {
    let current = this.first;
    return {
      next() {
        if (current) {
          const value = current.item;
          current = current.next;
          return { value, done: false };
        } else {
          return { done: true };
        }
      }
    };
  }
}

// === EJEMPLO DE USO CON TU CARRITO EXISTENTE ===
const listaProductos = new ListaDoble();

// Función para agregar producto a la lista y al carrito
function agregarProducto(nombre, precio, img) {
  const producto = new Producto(nombre, precio, img);
  listaProductos.adicionar(producto);
  // También lo agregamos al carrito visual
  agregarAlCarrito(nombre, precio, img);
}

// Ejemplo de agregar productos automáticamente
agregarProducto("Martillo", 22000, "img/martillo.png");
agregarProducto("Taladro", 150000, "img/taladro.png");
agregarProducto("Llave Inglesa", 30000, "img/llave.png");

// Si quieres, puedes recorrer la lista de productos
// console.log([...listaProductos].map(p => p.toString()));
