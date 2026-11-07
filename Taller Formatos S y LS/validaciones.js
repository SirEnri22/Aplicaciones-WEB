const STORAGE_KEY = 'registroEstudiantes';

// Las expresiones regulares ayudan a revisar el formato antes de guardar.
const reglas = {
  cedula: /^\d{10}$/,
  nombre: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:[ '-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/,
  telefono: /^[0-9+()\-\s]{7,15}$/,
  correo: /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/,
  direccion: /^[A-Za-z0-9ÁÉÍÓÚÜÑáéíóúüñ.,#°'\-/\s]{5,120}$/
};

const form = document.querySelector('#student-form');
const studentList = document.querySelector('#student-list');
const emptyState = document.querySelector('#empty-state');
const countLabel = document.querySelector('#student-count');
const searchInput = document.querySelector('#search-input');
const formMessage = document.querySelector('#form-message');
const fieldNames = ['cedula', 'apellidos', 'nombres', 'direccion', 'telefono', 'correo', 'facultad', 'nivel', 'paralelo'];

function leerEstudiantes() {
  try {
    const datos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    console.error('No se pudieron leer los registros guardados:', error);
    return [];
  }
}

function guardarEstudiantes(estudiantes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estudiantes));
    return true;
  } catch (error) {
    formMessage.textContent = 'No se pudo guardar. Revisa si el navegador permite almacenamiento local.';
    formMessage.classList.remove('success');
    console.error('No se pudieron guardar los registros:', error);
    return false;
  }
}

function validarCampo(campo) {
  const valor = campo.value.trim();
  let mensaje = '';

  if (!valor) {
    mensaje = 'Este campo es obligatorio.';
  } else if (campo.name === 'cedula' && !reglas.cedula.test(valor)) {
    mensaje = 'La cédula debe tener exactamente 10 números.';
  } else if (['apellidos', 'nombres'].includes(campo.name) && !reglas.nombre.test(valor)) {
    mensaje = 'Escribe solo letras, espacios, guion o apóstrofo.';
  } else if (campo.name === 'direccion' && !reglas.direccion.test(valor)) {
    mensaje = 'Revisa la dirección (5 a 120 caracteres).';
  } else if (campo.name === 'telefono' && (!reglas.telefono.test(valor) || (valor.match(/\d/g) || []).length < 7)) {
    mensaje = 'Escribe un teléfono válido de 7 a 15 caracteres.';
  } else if (campo.name === 'correo' && !reglas.correo.test(valor)) {
    mensaje = 'Escribe un correo válido, por ejemplo nombre@correo.com.';
  }

  const errorElement = document.querySelector(`#${campo.name}-error`);
  if (errorElement) errorElement.textContent = mensaje;
  campo.setAttribute('aria-invalid', mensaje ? 'true' : 'false');
  return !mensaje;
}

function limpiarMensaje() {
  formMessage.textContent = '';
  formMessage.classList.remove('success');
}

function crearCelda(texto) {
  const celda = document.createElement('td');
  celda.textContent = texto;
  return celda;
}

function dibujarLista() {
  const estudiantes = leerEstudiantes();
  const busqueda = searchInput.value.trim().toLocaleLowerCase('es');
  const filtrados = estudiantes.filter((estudiante) =>
    `${estudiante.nombres} ${estudiante.apellidos} ${estudiante.cedula}`.toLocaleLowerCase('es').includes(busqueda)
  );

  studentList.replaceChildren();
  countLabel.textContent = estudiantes.length;
  emptyState.hidden = filtrados.length > 0;

  filtrados.forEach((estudiante) => {
    const fila = document.createElement('tr');
    const persona = document.createElement('td');
    const nombre = document.createElement('span');
    const correo = document.createElement('span');
    nombre.className = 'student-name';
    nombre.textContent = `${estudiante.apellidos}, ${estudiante.nombres}`;
    correo.className = 'student-email';
    correo.textContent = estudiante.correo;
    persona.append(nombre, correo);
    fila.append(persona, crearCelda(estudiante.cedula), crearCelda(estudiante.facultad));

    const nivel = document.createElement('td');
    const etiqueta = document.createElement('span');
    etiqueta.className = 'level-pill';
    etiqueta.textContent = `${estudiante.nivel} · ${estudiante.paralelo}`;
    nivel.append(etiqueta);
    fila.append(nivel, crearCelda(estudiante.telefono));

    const acciones = document.createElement('td');
    const eliminar = document.createElement('button');
    eliminar.className = 'delete-button';
    eliminar.type = 'button';
    eliminar.textContent = 'Eliminar';
    eliminar.setAttribute('aria-label', `Eliminar a ${estudiante.nombres} ${estudiante.apellidos}`);
    eliminar.addEventListener('click', () => eliminarEstudiante(estudiante.cedula));
    acciones.append(eliminar);
    fila.append(acciones);
    studentList.append(fila);
  });

  if (estudiantes.length > 0 && filtrados.length === 0) {
    emptyState.hidden = false;
    emptyState.querySelector('h3').textContent = 'No encontramos coincidencias';
    emptyState.querySelector('p').textContent = 'Prueba con otro nombre o número de cédula.';
  } else {
    emptyState.querySelector('h3').textContent = 'Aún no hay registros';
    emptyState.querySelector('p').textContent = 'Cuando guardes un estudiante, aparecerá en esta lista.';
  }
}

function eliminarEstudiante(cedula) {
  const estudiantes = leerEstudiantes().filter((estudiante) => estudiante.cedula !== cedula);
  if (guardarEstudiantes(estudiantes)) dibujarLista();
}

form.addEventListener('submit', (evento) => {
  evento.preventDefault();
  limpiarMensaje();
  const camposValidos = fieldNames.map((nombre) => validarCampo(form.elements[nombre])).every(Boolean);
  if (!camposValidos) {
    formMessage.textContent = 'Hay campos por revisar antes de guardar.';
    return;
  }

  const estudiante = Object.fromEntries(fieldNames.map((nombre) => [nombre, form.elements[nombre].value.trim()]));
  const estudiantes = leerEstudiantes();
  if (estudiantes.some((actual) => actual.cedula === estudiante.cedula)) {
    const cedula = form.elements.cedula;
    cedula.setAttribute('aria-invalid', 'true');
    document.querySelector('#cedula-error').textContent = 'Ya existe un registro con esta cédula.';
    formMessage.textContent = 'Revisa la cédula ingresada.';
    return;
  }

  if (!guardarEstudiantes([...estudiantes, estudiante])) return;
  form.reset();
  fieldNames.forEach((nombre) => {
    form.elements[nombre].setAttribute('aria-invalid', 'false');
    document.querySelector(`#${nombre}-error`).textContent = '';
  });
  formMessage.textContent = 'Estudiante guardado correctamente.';
  formMessage.classList.add('success');
  dibujarLista();
});

fieldNames.forEach((nombre) => {
  const campo = form.elements[nombre];
  campo.addEventListener('blur', () => validarCampo(campo));
  campo.addEventListener('input', limpiarMensaje);
  campo.addEventListener('change', limpiarMensaje);
});

form.addEventListener('reset', () => {
  window.setTimeout(() => {
    fieldNames.forEach((nombre) => {
      form.elements[nombre].setAttribute('aria-invalid', 'false');
      document.querySelector(`#${nombre}-error`).textContent = '';
    });
    limpiarMensaje();
  });
});

searchInput.addEventListener('input', dibujarLista);
document.querySelector('#current-year').textContent = new Date().getFullYear();
dibujarLista();
