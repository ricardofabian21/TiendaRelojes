function iniciarSesion() {

    let correo = document.getElementById("correo").value;
    let contrasena = document.getElementById("contrasena").value;

    if (correo == "") {

        alert("Debe ingresar su correo");

    } else if (correo.length > 100) {

        alert("El correo no puede tener más de 100 caracteres");

    } else if (
        !correo.endsWith("@duoc.cl") &&
        !correo.endsWith("@profesor.duoc.cl") &&
        !correo.endsWith("@gmail.com") &&
        !correo.endsWith("@icloud.com") &&
        !correo.endsWith("@hotmail.com")
    ) {

        alert("Debe ingresar un correo válido");

    } else if (contrasena == "") {

        alert("Debe ingresar su contraseña");

    } else if (contrasena.length < 4 || contrasena.length > 10) {

        alert("La contraseña debe tener entre 4 y 10 caracteres");

    } else if (correo == "duoc@duoc.cl" && contrasena == "1234") {

        window.location.href = "../usuario/home.html";

    } else if (correo == "admin@duoc.cl" && contrasena == "1234") {

        window.location.href = "../admin/home.html";

    } else {

        alert("Correo o contraseña incorrectos");

    }

}