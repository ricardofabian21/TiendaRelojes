function correoEsValido(correo) {
    return correo.endsWith("@duoc.cl") ||
        correo.endsWith("@profesor.duoc.cl") ||
        correo.endsWith("@gmail.com");
}

function contrasenaEsValida(contrasena) {
    return contrasena.length >= 4 && contrasena.length <= 10;
}

function iniciarSesion() {

    let correo = document.getElementById("correo").value.trim();
    let contrasena = document.getElementById("contrasena").value;

    if (correo == "") {

        alert("Debe ingresar su correo");

    } else if (correo.length > 100) {

        alert("El correo no puede tener más de 100 caracteres");

    } else if (!correoEsValido(correo)) {

        alert("Debe ingresar un correo válido");

    } else if (contrasena == "") {

        alert("Debe ingresar su contraseña");

    } else if (!contrasenaEsValida(contrasena)) {

        alert("La contraseña debe tener entre 4 y 10 caracteres");

    } else {

        const usuario = obtenerUsuarios().find(u => u.correo === correo && u.contrasena === contrasena);

        if (!usuario) {
            alert("Correo o contraseña incorrectos");
            return;
        }

        localStorage.setItem("usuarioSesion", JSON.stringify(usuario));

        if (usuario.rol === "admin") {
            window.location.href = "../admin/home.html";
        } else {
            window.location.href = "../index.html";
        }

    }

}


function registrarUsuario() {

    let nombre = document.getElementById("nombre").value.trim();
    let apellido = document.getElementById("apellido").value.trim();
    let correo = document.getElementById("correoRegistro").value.trim();
    let contrasena = document.getElementById("contrasenaRegistro").value;

    if (nombre == "") {

        alert("Debe ingresar su nombre");

    } else if (nombre.length > 50) {

        alert("El nombre no puede tener más de 50 caracteres");

    } else if (apellido == "") {

        alert("Debe ingresar su apellido");

    } else if (apellido.length > 100) {

        alert("El apellido no puede tener más de 100 caracteres");

    } else if (correo == "") {

        alert("Debe ingresar su correo");

    } else if (correo.length > 100) {

        alert("El correo no puede tener más de 100 caracteres");

    } else if (!correoEsValido(correo)) {

        alert("Debe ingresar un correo válido");

    } else if (contrasena == "") {

        alert("Debe ingresar una contraseña");

    } else if (!contrasenaEsValida(contrasena)) {

        alert("La contraseña debe tener entre 4 y 10 caracteres");

    } else {

        const nuevoUsuario = agregarUsuario(nombre, apellido, correo, contrasena, "cliente");

        if (!nuevoUsuario) {
            alert("Ya existe un usuario registrado con ese correo");
            return;
        }

        alert("Usuario registrado correctamente");

        window.location.href = "../login/login.html";

    }

}


const usuariosPredefinidos = [
    {
        id: 1,
        nombre: "Admin",
        apellido: "Chronos",
        correo: "admin@duoc.cl",
        contrasena: "1234",
        rol: "admin"
    },
    {
        id: 2,
        nombre: "Juan",
        apellido: "Pérez",
        correo: "juan.perez@gmail.com",
        contrasena: "pass123",
        rol: "cliente"
    },
    {
        id: 3,
        nombre: "María",
        apellido: "González",
        correo: "m.gonzalez@duoc.cl",
        contrasena: "duoc2024",
        rol: "cliente"
    },
    {
        id: 4,
        nombre: "Diego",
        apellido: "Soto",
        correo: "d.soto@profesor.duoc.cl",
        contrasena: "profesor24",
        rol: "cliente"
    }
];


function inicializarUsuarios() {
    // Verificamos si la clave "listaUsuarios" ya existe
    if (!localStorage.getItem("listaUsuarios")) {
        localStorage.setItem("listaUsuarios", JSON.stringify(usuariosPredefinidos));
        console.log("Usuarios predefinidos cargados en localStorage.");
        return;
    }

    // Migración: agrega el campo "rol" a listas guardadas antes de que existiera ese campo.
    const listaUsuarios = obtenerUsuarios();
    let migrado = false;

    listaUsuarios.forEach(usuario => {
        if (!usuario.rol) {
            usuario.rol = usuario.correo === "admin@duoc.cl" ? "admin" : "cliente";
            migrado = true;
        }
    });

    if (migrado) {
        localStorage.setItem("listaUsuarios", JSON.stringify(listaUsuarios));
        console.log("Usuarios existentes migrados con el campo 'rol'.");
    } else {
        console.log("Ya existen usuarios en localStorage, usando datos existentes.");
    }
}

function obtenerUsuarios() {
    let usuarios = localStorage.getItem("listaUsuarios");
    return usuarios ? JSON.parse(usuarios) : [];
}

// Agrega un usuario a listaUsuarios. Devuelve null si el correo ya está en uso.
function agregarUsuario(nombre, apellido, correo, contrasena, rol) {
    const listaUsuarios = obtenerUsuarios();

    if (listaUsuarios.some(usuario => usuario.correo === correo)) {
        return null;
    }

    const nuevoId = listaUsuarios.reduce((maxId, usuario) => Math.max(maxId, usuario.id), 0) + 1;

    const nuevoUsuario = { id: nuevoId, nombre, apellido, correo, contrasena, rol };

    listaUsuarios.push(nuevoUsuario);
    localStorage.setItem("listaUsuarios", JSON.stringify(listaUsuarios));

    return nuevoUsuario;
}

// Evita que datos de usuario (nombre, correo, etc.) se interpreten como HTML al insertarlos con innerHTML.
function escaparHTML(texto) {
    const div = document.createElement("div");
    div.textContent = texto ?? "";
    return div.innerHTML;
}


function mostrarUsuariosTabla() {
    const cuerpoTabla = document.getElementById("cuerpoTablaUsuarios");

    if (!cuerpoTabla) return;

    const listaUsuarios = obtenerUsuarios();

    cuerpoTabla.innerHTML = "";

    listaUsuarios.forEach(usuario => {
        const fila = `
            <tr>
                <td>${usuario.id}</td>
                <td>${escaparHTML(usuario.nombre)}</td>
                <td>${escaparHTML(usuario.apellido) || ''}</td> <!-- Maneja si no hay apellido -->
                <td>${escaparHTML(usuario.correo)}</td>
                <td>
                    <!-- Botones de acción reutilizando estilos CSS -->
                    <button onclick="prepararEdicion(${usuario.id})">Editar</button>
                    <button class="btn-eliminar" onclick="confirmarEliminar(${usuario.id})">Eliminar</button>
                </td>
            </tr>
        `;
        // Insertamos la fila al final del cuerpo de la tabla
        cuerpoTabla.innerHTML += fila;
    });

    console.log(`📊 Tabla actualizada con ${listaUsuarios.length} usuarios.`);
}

function crearUsuarioAdmin() {
    const nombre = document.getElementById("nombreNuevoUsuario").value.trim();
    const apellido = document.getElementById("apellidoNuevoUsuario").value.trim();
    const correo = document.getElementById("correoNuevoUsuario").value.trim();
    const contrasena = document.getElementById("contrasenaNuevoUsuario").value;

    if (nombre == "") {

        alert("Debe ingresar el nombre");

    } else if (apellido == "") {

        alert("Debe ingresar el apellido");

    } else if (correo == "") {

        alert("Debe ingresar el correo");

    } else if (!correoEsValido(correo)) {

        alert("Debe ingresar un correo válido");

    } else if (!contrasenaEsValida(contrasena)) {

        alert("La contraseña debe tener entre 4 y 10 caracteres");

    } else {

        const nuevoUsuario = agregarUsuario(nombre, apellido, correo, contrasena, "cliente");

        if (!nuevoUsuario) {
            alert("Ya existe un usuario registrado con ese correo");
            return;
        }

        alert("Usuario creado correctamente");

        window.location.href = "../Mostrar_Usuario/mostrar_usuario.html";
    }
}

function prepararEdicion(id) {
    window.location.href = "../Editar_Usuario/editar_usuario.html?id=" + id;
}

function confirmarEliminar(id) {
    const listaUsuarios = obtenerUsuarios();
    const usuario = listaUsuarios.find(u => u.id == id);

    if (!usuario) return;

    const confirmado = confirm(`¿Seguro que deseas eliminar al usuario "${usuario.nombre} ${usuario.apellido || ''}"?`);

    if (!confirmado) return;

    const listaActualizada = listaUsuarios.filter(u => u.id != id);

    localStorage.setItem("listaUsuarios", JSON.stringify(listaActualizada));

    mostrarUsuariosTabla();
}

function editarUsuarioPrompt() {
    window.location.href = "Editar_Usuario/editar_usuario.html";
}


function poblarSelectEdicion() {
    const select = document.getElementById("selectUsuarioEditar");

    if (!select) return;

    const listaUsuarios = obtenerUsuarios();

    select.innerHTML = '<option value="">-- Selecciona un usuario --</option>';

    listaUsuarios.forEach(usuario => {
        const opcion = document.createElement("option");
        opcion.value = usuario.id;
        opcion.textContent = `${usuario.nombre} ${usuario.apellido || ''} (${usuario.correo})`;
        select.appendChild(opcion);
    });

    // Si llegamos con un id en la URL (por ejemplo, desde el botón "Editar" de la tabla),
    // lo preseleccionamos y cargamos sus datos automáticamente.
    const idParametro = new URLSearchParams(window.location.search).get("id");

    if (idParametro) {
        select.value = idParametro;
        cargarUsuarioParaEditar(idParametro);
    }
}

function cargarUsuarioParaEditar(id) {
    const idUsuarioInput = document.getElementById("idUsuarioEditar");
    const nombreInput = document.getElementById("nombreEditarUsuario");
    const apellidoInput = document.getElementById("apellidoEditarUsuario");
    const correoInput = document.getElementById("correoEditarUsuario");
    const contrasenaInput = document.getElementById("contrasenaEditarUsuario");

    if (!id) {
        idUsuarioInput.value = "";
        nombreInput.value = "";
        apellidoInput.value = "";
        correoInput.value = "";
        contrasenaInput.value = "";
        return;
    }

    const usuario = obtenerUsuarios().find(u => u.id == id);

    if (!usuario) return;

    idUsuarioInput.value = usuario.id;
    nombreInput.value = usuario.nombre;
    apellidoInput.value = usuario.apellido || "";
    correoInput.value = usuario.correo;
    contrasenaInput.value = usuario.contrasena;
}

function guardarEdicionUsuario() {
    const id = document.getElementById("idUsuarioEditar").value;

    if (!id) {
        alert("Debe seleccionar un usuario para editar");
        return;
    }

    const nombre = document.getElementById("nombreEditarUsuario").value.trim();
    const apellido = document.getElementById("apellidoEditarUsuario").value.trim();
    const correo = document.getElementById("correoEditarUsuario").value.trim();
    const contrasena = document.getElementById("contrasenaEditarUsuario").value;

    if (nombre == "") {

        alert("Debe ingresar el nombre");

    } else if (apellido == "") {

        alert("Debe ingresar el apellido");

    } else if (correo == "") {

        alert("Debe ingresar el correo");

    } else if (!correoEsValido(correo)) {

        alert("Debe ingresar un correo válido");

    } else if (!contrasenaEsValida(contrasena)) {

        alert("La contraseña debe tener entre 4 y 10 caracteres");

    } else {

        const listaUsuarios = obtenerUsuarios();

        if (listaUsuarios.some(usuario => usuario.correo === correo && usuario.id != id)) {
            alert("Ya existe otro usuario registrado con ese correo");
            return;
        }

        const indice = listaUsuarios.findIndex(usuario => usuario.id == id);

        if (indice === -1) {
            alert("No se encontró el usuario a editar");
            return;
        }

        listaUsuarios[indice] = {
            id: listaUsuarios[indice].id,
            nombre: nombre,
            apellido: apellido,
            correo: correo,
            contrasena: contrasena,
            rol: listaUsuarios[indice].rol || "cliente"
        };

        localStorage.setItem("listaUsuarios", JSON.stringify(listaUsuarios));

        alert("Usuario actualizado correctamente");

        window.location.href = "../Mostrar_Usuario/mostrar_usuario.html";
    }
}
/* CRUD Productos */

const productosPredefinidos = [
    { id: 1, nombre: "Michael Kors", precio: 199990, descripcion: "Descripción del producto próximamente.", imagen: "img/productos/michael-kors.png" },
    { id: 2, nombre: "Rolex", precio: 8990000, descripcion: "Submariner Date, resistente al agua hasta 300 metros.", imagen: "img/productos/rolex.png" },
    { id: 3, nombre: "Tommy Hilfiger", precio: 149990, descripcion: "Descripción del producto próximamente.", imagen: "img/productos/tommy.png" },
    { id: 4, nombre: "Armani", precio: 390990, descripcion: "Descripción del producto próximamente.", imagen: "img/productos/armani.png" },
    { id: 5, nombre: "Casio", precio: 59990, descripcion: "Descripción del producto próximamente.", imagen: "img/productos/casio.png" },
    { id: 6, nombre: "Seiko", precio: 249990, descripcion: "Descripción del producto próximamente.", imagen: "img/productos/seiko.png" },
    { id: 7, nombre: "Fossil", precio: 129990, descripcion: "Descripción del producto próximamente.", imagen: "img/productos/fossil.png" },
    { id: 8, nombre: "Guess", precio: 179990, descripcion: "Descripción del producto próximamente.", imagen: "img/productos/guess.png" },
    { id: 9, nombre: "Citizen", precio: 299990, descripcion: "Descripción del producto próximamente.", imagen: "img/productos/citizen.png" },
    { id: 10, nombre: "Diesel", precio: 159990, descripcion: "Descripción del producto próximamente.", imagen: "img/productos/diesel.png" },
    { id: 11, nombre: "Swatch", precio: 89990, descripcion: "Descripción del producto próximamente.", imagen: "img/productos/swatch.png" },
    { id: 12, nombre: "Tissot", precio: 450990, descripcion: "Descripción del producto próximamente.", imagen: "img/productos/tissot.png" }
];
 
function inicializarProductos() {
    if (!localStorage.getItem("listaProductos")) {
        localStorage.setItem("listaProductos", JSON.stringify(productosPredefinidos));
        console.log("Productos predefinidos cargados en localStorage.");
    }
}
 
function obtenerProductos() {
    let productos = localStorage.getItem("listaProductos");
    return productos ? JSON.parse(productos) : [];
}
 
// Agrega un producto NUEVO al catálogo (listaProductos). Devuelve null si ya existe uno con el mismo nombre.
function agregarProducto(nombre, precio, descripcion, imagen) {
    const listaProductos = obtenerProductos();
 
    if (listaProductos.some(producto => producto.nombre.toLowerCase() === nombre.toLowerCase())) {
        return null;
    }
 
    const nuevoId = listaProductos.reduce((maxId, producto) => Math.max(maxId, producto.id), 0) + 1;
 
    const nuevoProducto = { id: nuevoId, nombre, precio, descripcion, imagen };
 
    listaProductos.push(nuevoProducto);
    localStorage.setItem("listaProductos", JSON.stringify(listaProductos));
 
    return nuevoProducto;
}
 
function actualizarProducto(id, nombre, precio, descripcion, imagen) {
    const listaProductos = obtenerProductos();
 
    const indice = listaProductos.findIndex(producto => producto.id == id);
 
    if (indice === -1) return null;
 
    listaProductos[indice] = {
        id: listaProductos[indice].id,
        nombre: nombre,
        precio: precio,
        descripcion: descripcion,
        imagen: imagen || listaProductos[indice].imagen
    };
 
    localStorage.setItem("listaProductos", JSON.stringify(listaProductos));
 
    return listaProductos[indice];
}
 
function eliminarProductoStorage(id) {
    const listaProductos = obtenerProductos();
    const listaActualizada = listaProductos.filter(producto => producto.id != id);
    localStorage.setItem("listaProductos", JSON.stringify(listaActualizada));
}
 
function formatearPrecio(numero) {
    return "$" + Number(numero).toLocaleString("es-CL");
}
 
// ===== Render del catálogo (productos.html) =====
 
function mostrarCatalogoProductos() {
    const grilla = document.getElementById("productos-grid");
 
    if (!grilla) return;
 
    const listaProductos = obtenerProductos();
 
    grilla.innerHTML = "";
 
    listaProductos.forEach(producto => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "producto-card";
        tarjeta.dataset.nombre = producto.nombre;
        tarjeta.dataset.precio = producto.precio;
        tarjeta.dataset.descripcion = producto.descripcion || "";

        const rutaImagen = (producto.imagen && producto.imagen.trim() !== "")
    ? producto.imagen
    : "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='170'><rect width='100%' height='100%' fill='%23f0f0f0'/><line x1='0' y1='0' x2='200' y2='170' stroke='%23999'/><line x1='200' y1='0' x2='0' y2='170' stroke='%23999'/></svg>";
 
        tarjeta.innerHTML = `
            <img src="${escaparHTML(rutaImagen)}" alt="${escaparHTML(producto.nombre)}" class="producto-img" onclick="abrirModal(this.closest('.producto-card'))">
            <h3>${escaparHTML(producto.nombre)}</h3>
            <p class="precio">${formatearPrecio(producto.precio)}</p>
            <div class="cantidad-selector">
                <button type="button" onclick="cambiarCantidad(this, -1)">-</button>
                <input type="text" class="cantidad-input" value="0" readonly>
                <button type="button" onclick="cambiarCantidad(this, 1)">+</button>
            </div>
            <button type="button" onclick="agregarAlCarrito(this)">Añadir</button>
        `;
 
        grilla.appendChild(tarjeta);
    });
}
 
// ===== CRUD de productos (panel admin) =====
 
function mostrarProductosTabla() {
    const cuerpoTabla = document.getElementById("cuerpoTablaProductos");
 
    if (!cuerpoTabla) return;
 
    const listaProductos = obtenerProductos();
 
    cuerpoTabla.innerHTML = "";
 
    listaProductos.forEach(producto => {
        const fila = `
            <tr>
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${formatearPrecio(producto.precio)}</td>
                <td>
                    <button onclick="prepararEdicionProducto(${producto.id})">Editar</button>
                    <button class="btn-eliminar" onclick="confirmarEliminarProducto(${producto.id})">Eliminar</button>
                </td>
            </tr>
        `;
        cuerpoTabla.innerHTML += fila;
    });
 
    console.log(`Tabla de productos actualizada con ${listaProductos.length} productos.`);
}
 
function crearProductoAdmin() {
    const nombre = document.getElementById("nombreNuevoProducto").value.trim();
    const precio = parseInt(document.getElementById("precioNuevoProducto").value);
    const descripcion = document.getElementById("descripcionNuevoProducto").value.trim();

    if (nombre == "") {

        alert("Debe ingresar el nombre del producto");

    } else if (isNaN(precio) || precio <= 0) {

        alert("Debe ingresar un precio válido");

    } else {

        const nuevoProducto = agregarProducto(nombre, precio, descripcion, "");

        if (!nuevoProducto) {
            alert("Ya existe un producto registrado con ese nombre");
            return;
        }

        alert("Producto creado correctamente");

        window.location.href = "mostrar_producto.html";
    }
}
 
function prepararEdicionProducto(id) {
    window.location.href = "editar_producto.html?id=" + id;
}
 
function confirmarEliminarProducto(id) {
    const listaProductos = obtenerProductos();
    const producto = listaProductos.find(p => p.id == id);
 
    if (!producto) return;
 
    const confirmado = confirm(`¿Seguro que deseas eliminar el producto "${producto.nombre}"?`);
 
    if (!confirmado) return;
 
    eliminarProductoStorage(id);
 
    mostrarProductosTabla();
}
 
function editarProductoPrompt() {
    window.location.href = "editar_producto.html";
}
 
function poblarSelectEdicionProducto() {
    const select = document.getElementById("selectProductoEditar");
 
    if (!select) return;
 
    const listaProductos = obtenerProductos();
 
    select.innerHTML = '<option value="">-- Selecciona un producto --</option>';
 
    listaProductos.forEach(producto => {
        const opcion = document.createElement("option");
        opcion.value = producto.id;
        opcion.textContent = `${producto.nombre} (${formatearPrecio(producto.precio)})`;
        select.appendChild(opcion);
    });
 
    const idParametro = new URLSearchParams(window.location.search).get("id");
 
    if (idParametro) {
        select.value = idParametro;
        cargarProductoParaEditar(idParametro);
    }
}
 
function cargarProductoParaEditar(id) {
    const idInput = document.getElementById("idProductoEditar");
    const nombreInput = document.getElementById("nombreEditarProducto");
    const precioInput = document.getElementById("precioEditarProducto");
    const descripcionInput = document.getElementById("descripcionEditarProducto");
    const imagenInput = document.getElementById("imagenEditarProducto");
 
    if (!id) {
        idInput.value = "";
        nombreInput.value = "";
        precioInput.value = "";
        descripcionInput.value = "";
        imagenInput.value = "";
        return;
    }
 
    const producto = obtenerProductos().find(p => p.id == id);
 
    if (!producto) return;
 
    idInput.value = producto.id;
    nombreInput.value = producto.nombre;
    precioInput.value = producto.precio;
    descripcionInput.value = producto.descripcion || "";
    imagenInput.value = producto.imagen || "";
}
 
function guardarEdicionProducto() {
    const id = document.getElementById("idProductoEditar").value;
 
    if (!id) {
        alert("Debe seleccionar un producto para editar");
        return;
    }
 
    const nombre = document.getElementById("nombreEditarProducto").value.trim();
    const precio = parseInt(document.getElementById("precioEditarProducto").value);
    const descripcion = document.getElementById("descripcionEditarProducto").value.trim();
    const imagen = document.getElementById("imagenEditarProducto").value.trim();
 
    if (nombre == "") {
 
        alert("Debe ingresar el nombre del producto");
 
    } else if (isNaN(precio) || precio <= 0) {
 
        alert("Debe ingresar un precio válido");
 
    } else if (imagen == "") {
 
        alert("Debe ingresar la ruta de la imagen");
 
    } else {
 
        const listaProductos = obtenerProductos();
 
        if (listaProductos.some(producto => producto.nombre.toLowerCase() === nombre.toLowerCase() && producto.id != id)) {
            alert("Ya existe otro producto registrado con ese nombre");
            return;
        }
 
        const actualizado = actualizarProducto(id, nombre, precio, descripcion, imagen);
 
        if (!actualizado) {
            alert("No se encontró el producto a editar");
            return;
        }
 
        alert("Producto actualizado correctamente");
 
        window.location.href = "../Mostrar_Producto/mostrar_producto.html";
    }
}


    

/* Carrito de Compra */

let carrito = [];
let productoModalActual = null;

function formatearPrecio(numero) {
    return "$" + numero.toLocaleString("es-CL");
}

function actualizarContadorCarrito() {
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    document.getElementById("carrito-contador").textContent = `🛒 Carrito (${totalItems})`;

    const overlay = document.getElementById("carrito-overlay");
    if (overlay.classList.contains("activo")) {
        renderizarCarrito();
    }
}

function agregarProductoAlCarrito(nombre, precio, cantidad) {
    const existente = carrito.find(item => item.nombre === nombre);
    if (existente) {
        existente.cantidad += cantidad;
    } else {
        carrito.push({ nombre, precio, cantidad });
    }
    actualizarContadorCarrito();
}

// Cantidad en la tarjeta
function cambiarCantidad(boton, delta) {
    const card = boton.closest(".producto-card");
    const input = card.querySelector(".cantidad-input");
    let valor = parseInt(input.value) + delta;
    if (valor < 0) valor = 0;
    input.value = valor;
}

function agregarAlCarrito(boton) {
    const card = boton.closest(".producto-card");
    const input = card.querySelector(".cantidad-input");
    const cantidad = parseInt(input.value);

    if (cantidad <= 0) {
        return; // si está en 0, "Añadir" no hace nada
    }

    const nombre = card.dataset.nombre;
    const precio = parseInt(card.dataset.precio);
    agregarProducto(nombre, precio, cantidad);

    input.value = 0; // vuelve a cero para el próximo producto
}


/* Modales de Productos */


function abrirModal(card) {
    productoModalActual = card;
    document.getElementById("modal-nombre").textContent = card.dataset.nombre;
    document.getElementById("modal-precio").textContent = formatearPrecio(parseInt(card.dataset.precio));
    document.getElementById("modal-descripcion").textContent =
    card.dataset.descripcion || "Descripción del producto próximamente.";
    document.getElementById("modal-cantidad").value = 1;

    const imgTarjeta = card.querySelector(".producto-img");
    const modalImg = document.getElementById("modal-img");
    modalImg.src = imgTarjeta.src;
    modalImg.alt = imgTarjeta.alt;

    document.getElementById("modal-overlay").classList.add("activo");
}

function cerrarModal() {
    document.getElementById("modal-overlay").classList.remove("activo");
    productoModalActual = null;
}

function cerrarModalFuera(evento) {
    if (evento.target.id === "modal-overlay") {
        cerrarModal();
    }
}

function cambiarCantidadModal(delta) {
    const input = document.getElementById("modal-cantidad");
    let valor = parseInt(input.value) + delta;
    if (valor < 1) valor = 1;
    input.value = valor;
}

function agregarDesdeModal() {
    if (!productoModalActual) return;
    const nombre = productoModalActual.dataset.nombre;
    const precio = parseInt(productoModalActual.dataset.precio);
    const cantidad = parseInt(document.getElementById("modal-cantidad").value);
    agregarProducto(nombre, precio, cantidad);
    cerrarModal();
}


/* Modal Carrito */

function abrirCarrito() {
    renderizarCarrito();
    document.getElementById("carrito-overlay").classList.add("activo");
}

function cerrarCarrito() {
    document.getElementById("carrito-overlay").classList.remove("activo");
}

function cerrarCarritoFuera(evento) {
    if (evento.target.id === "carrito-overlay") {
        cerrarCarrito();
    }
}

function renderizarCarrito() {
    const lista = document.getElementById("carrito-lista");
    lista.innerHTML = "";

    if (carrito.length === 0) {
        lista.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
    } else {
        carrito.forEach(item => {
            const div = document.createElement("div");
            div.className = "carrito-item";
            div.innerHTML = `
                <div class="carrito-item-info">
                    <span class="nombre">${item.nombre}</span>
                    <span class="precio-unitario">${formatearPrecio(item.precio)} c/u</span>
                </div>
                <div class="carrito-item-controles">
                    <button type="button" onclick="cambiarCantidadCarrito('${item.nombre}', -1)">-</button>
                    <span class="cantidad">${item.cantidad}</span>
                    <button type="button" onclick="cambiarCantidadCarrito('${item.nombre}', 1)">+</button>
                    <button type="button" class="carrito-item-eliminar" onclick="eliminarDelCarrito('${item.nombre}')">&times;</button>
                </div>
            `;
            lista.appendChild(div);
        });
    }

    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    document.getElementById("carrito-total-monto").textContent = formatearPrecio(total);
}

function cambiarCantidadCarrito(nombre, delta) {
    const item = carrito.find(p => p.nombre === nombre);
    if (!item) return;
    item.cantidad += delta;
    if (item.cantidad <= 0) {
        carrito = carrito.filter(p => p.nombre !== nombre);
    }
    actualizarContadorCarrito();
}

function eliminarDelCarrito(nombre) {
    carrito = carrito.filter(p => p.nombre !== nombre);
    actualizarContadorCarrito();
}



document.addEventListener("DOMContentLoaded", () => {

    inicializarUsuarios();
    mostrarUsuariosTabla();
    poblarSelectEdicion();
 
    inicializarProductos();
    mostrarCatalogoProductos();
    mostrarProductosTabla();
    poblarSelectEdicionProducto();
});