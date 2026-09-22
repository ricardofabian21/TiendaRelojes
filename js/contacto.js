function correoContactoEsValido(correo) {
    return correo.includes("@") && correo.includes(".");
}

function enviarMensajeContacto() {

    const nombre = document.getElementById("nombreContacto").value.trim();
    const correo = document.getElementById("correoContacto").value.trim();
    const comentario = document.getElementById("comentarioContacto").value.trim();

    const errorNombre = document.getElementById("errorNombre");
    const errorCorreo = document.getElementById("errorCorreo");
    const errorComentario = document.getElementById("errorComentario");
    const mensajeExito = document.getElementById("mensajeExito");

    errorNombre.textContent = "";
    errorCorreo.textContent = "";
    errorComentario.textContent = "";
    mensajeExito.classList.remove("visible");

    let formularioValido = true;

    if (nombre.length === 0 || nombre.length > 100) {
        errorNombre.textContent = "Ingresa tu nombre (máximo 100 caracteres).";
        formularioValido = false;
    }

    if (correo.length === 0 || correo.length > 100 || !correoContactoEsValido(correo)) {
        errorCorreo.textContent = "Ingresa un correo válido.";
        formularioValido = false;
    }

    if (comentario.length === 0 || comentario.length > 500) {
        errorComentario.textContent = "Ingresa tu comentario (máximo 500 caracteres).";
        formularioValido = false;
    }

    if (!formularioValido) {
        return;
    }

    mensajeExito.classList.add("visible");
    document.getElementById("formContacto").reset();
}
