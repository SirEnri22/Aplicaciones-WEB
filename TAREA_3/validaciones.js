const formulario = document.getElementById('formularioCliente');
const alerta = document.getElementById('alerta');

let cedulasRegistradas = [];

function soloNumeros(texto) {
    return /^[0-9]+$/.test(texto);
}
function soloLetras(texto) {
    return /^[a-zA-ZáéíóúñÑüÜ\s]+$/.test(texto);
}

function marcarError(campo, mensaje, texto) {
    campo.classList.add('error');
    campo.classList.remove('valido');
    mensaje.textContent = texto;
}

function marcarOk(campo, mensaje) {
    campo.classList.remove('error');
    campo.classList.add('valido');
    mensaje.textContent = '';
}

function validarFormulario() {
    const cedula = document.getElementById('cedula');
    const errorCedula = document.getElementById('errorCedula');
    const nombre = document.getElementById('nombre');
    const errorNombre = document.getElementById('errorNombre');
    const direccion = document.getElementById('direccion');
    const errorDireccion = document.getElementById('errorDireccion');
    const celular = document.getElementById('celular');
    const errorCelular = document.getElementById('errorCelular');
    const correo = document.getElementById('correo');
    const errorCorreo = document.getElementById('errorCorreo');

    let hayError = false;

    // 1. Cédula: obligatoria, solo números, 10 dígitos y no repetida
    if (cedula.value == '') {
        marcarError(cedula, errorCedula, 'La cédula es obligatoria');
        hayError = true;
    } else if (!soloNumeros(cedula.value)) {
        marcarError(cedula, errorCedula, 'La cédula solo puede tener números');
        hayError = true;
    } else if (cedula.value.length != 10) {
        marcarError(cedula, errorCedula, 'La cédula debe tener 10 dígitos');
        hayError = true;
    } else if (cedulasRegistradas.indexOf(cedula.value) != -1) {
        marcarError(cedula, errorCedula, 'Esta cédula ya está registrada');
        hayError = true;
    } else {
        marcarOk(cedula, errorCedula);
    }

    if (nombre.value == '') {
        marcarError(nombre, errorNombre, 'El nombre es obligatorio');
        hayError = true;
    } else if (nombre.value.length < 3) {
        marcarError(nombre, errorNombre, 'El nombre debe tener al menos 3 caracteres');
        hayError = true;
    } else if (!soloLetras(nombre.value)) {
        marcarError(nombre, errorNombre, 'El nombre solo puede tener letras');
        hayError = true;
    } else {
        marcarOk(nombre, errorNombre);
    }

    if (direccion.value == '') {
        marcarError(direccion, errorDireccion, 'La dirección es obligatoria');
        hayError = true;
    } else if (direccion.value.length < 5) {
        marcarError(direccion, errorDireccion, 'La dirección debe tener al menos 5 caracteres');
        hayError = true;
    } else {
        marcarOk(direccion, errorDireccion);
    }

    if (celular.value == '') {
        marcarError(celular, errorCelular, 'El celular es obligatorio');
        hayError = true;
    } else if (!soloNumeros(celular.value)) {
        marcarError(celular, errorCelular, 'El celular solo puede tener números');
        hayError = true;
    } else if (celular.value.length != 10) {
        marcarError(celular, errorCelular, 'El celular debe tener 10 dígitos');
        hayError = true;
    } else if (celular.value.substring(0, 2) != '09') {
        marcarError(celular, errorCelular, 'El celular debe empezar con 09');
        hayError = true;
    } else {
        marcarOk(celular, errorCelular);
    }

    if (correo.value == '') {
        marcarError(correo, errorCorreo, 'El correo es obligatorio');
        hayError = true;
    } else if (correo.value.indexOf(' ') != -1) {
        marcarError(correo, errorCorreo, 'El correo no puede tener espacios');
        hayError = true;
    } else if (correo.value.indexOf('@') == -1) {
        marcarError(correo, errorCorreo, 'El correo debe tener un @');
        hayError = true;
    } else if (correo.value.lastIndexOf('.') < correo.value.indexOf('@')) {
        marcarError(correo, errorCorreo, 'El punto del correo va después del @');
        hayError = true;
    } else if (correo.value.lastIndexOf('.') == correo.value.length - 1) {
        marcarError(correo, errorCorreo, 'El correo debe tener texto después del punto');
        hayError = true;
    } else {
        marcarOk(correo, errorCorreo);
    }

    if (cedula.className.indexOf('error') != -1) {
        cedula.focus();
    } else if (nombre.className.indexOf('error') != -1) {
        nombre.focus();
    } else if (direccion.className.indexOf('error') != -1) {
        direccion.focus();
    } else if (celular.className.indexOf('error') != -1) {
        celular.focus();
    } else if (correo.className.indexOf('error') != -1) {
        correo.focus();
    }
    // Devolvemos true solo cuando NO hay errores, para poder registrar
    return hayError == false;
}

function mostrarAlerta(texto, tipo) {
    alerta.textContent = texto;
    alerta.className = 'alerta mostrar ' + tipo;
}

function limpiarTodo() {
    document.getElementById('cedula').className = '';
    document.getElementById('errorCedula').textContent = '';

    document.getElementById('nombre').className = '';
    document.getElementById('errorNombre').textContent = '';

    document.getElementById('direccion').className = '';
    document.getElementById('errorDireccion').textContent = '';

    document.getElementById('celular').className = '';
    document.getElementById('errorCelular').textContent = '';

    document.getElementById('correo').className = '';
    document.getElementById('errorCorreo').textContent = '';

    alerta.className = 'alerta';
    alerta.textContent = '';
}

formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();

    if (validarFormulario() == true) {
        cedulasRegistradas.push(document.getElementById('cedula').value);
        formulario.reset();
        mostrarAlerta('Cliente registrado correctamente', 'exito');
    } else {
        mostrarAlerta('Revise los campos marcados en rojo', 'fallo');
    }
});
formulario.addEventListener('reset', function () {
    limpiarTodo();
});
