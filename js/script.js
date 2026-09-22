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


document.addEventListener("DOMContentLoaded", () => {
    inicializarUsuarios();

    mostrarUsuariosTabla();

    poblarSelectEdicion();
});