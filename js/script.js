function iniciarSesion() {

    let correo = document.getElementById("correo").value;
    let contrasena = document.getElementById("contrasena").value;

    let correoGuardado = localStorage.getItem("correoUsuario");
    let contrasenaGuardada = localStorage.getItem("contrasenaUsuario");

    if (correo == "") {

        alert("Debe ingresar su correo");

    } else if (correo.length > 100) {

        alert("El correo no puede tener más de 100 caracteres");

    } else if (
        !correo.endsWith("@duoc.cl") &&
        !correo.endsWith("@profesor.duoc.cl") &&
        !correo.endsWith("@gmail.com")
    ) {

        alert("Debe ingresar un correo válido");

    } else if (contrasena == "") {

        alert("Debe ingresar su contraseña");

    } else if (contrasena.length < 4 || contrasena.length > 10) {

        alert("La contraseña debe tener entre 4 y 10 caracteres");

    } else if (correo == "admin@duoc.cl" && contrasena == "1234") {

        window.location.href = "../admin/home.html";

    } else if (correo == correoGuardado && contrasena == contrasenaGuardada) {

        window.location.href = "../index.html";

    } else {

        alert("Correo o contraseña incorrectos");

    }

}


function registrarUsuario() {

    let nombre = document.getElementById("nombre").value;
    let apellido = document.getElementById("apellido").value;
    let correo = document.getElementById("correoRegistro").value;
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

    } else if (
        !correo.endsWith("@duoc.cl") &&
        !correo.endsWith("@profesor.duoc.cl") &&
        !correo.endsWith("@gmail.com")
    ) {

        alert("Debe ingresar un correo válido");

    } else if (contrasena == "") {

        alert("Debe ingresar una contraseña");

    } else if (contrasena.length < 4 || contrasena.length > 10) {

        alert("La contraseña debe tener entre 4 y 10 caracteres");

    } else {

        localStorage.setItem("correoUsuario", correo);
        localStorage.setItem("contrasenaUsuario", contrasena);

        alert("Usuario registrado correctamente");

        window.location.href = "../login/login.html";

    }

}