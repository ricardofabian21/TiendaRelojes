function iniciarSesion() {

    let usuario = document.getElementById("usuario").value;
    let contrasena = document.getElementById("contrasena").value;

    if (usuario == "" || contrasena == "") {

        alert("Debe ingresar usuario y contraseña");

    } else if (usuario == "duoc" && contrasena == "1234") {

        window.location.href = "../usuario/home.html";

    } else if (usuario == "admin" && contrasena == "1234") {

        window.location.href = "../admin/home.html";

    } else {

        alert("Usuario o contraseña incorrectos");

    }

}