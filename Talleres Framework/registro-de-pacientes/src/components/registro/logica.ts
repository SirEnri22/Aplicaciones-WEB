import { $, useStore, useVisibleTask$ } from "@builder.io/qwik";

export interface Paciente {
  nombre: string;
  cedula: string;
  telefono: string;
  sangre: string;
}

const STORAGE_KEY = "qwik_pacientes_registro";

export const usePacientes = () => {
  const estado = useStore({
    nombre: "",
    cedula: "",
    telefono: "",
    sangre: "",
    error: "",
    editando: -1, // -1 = crear nuevo, >= 0 = índice del paciente a editar
    pacientes: [] as Paciente[],
  });

  // Cargar datos guardados en localStorage al abrir la página
  useVisibleTask$(() => {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (guardado) {
      try {
        const parsed = JSON.parse(guardado);
        if (Array.isArray(parsed)) {
          estado.pacientes = parsed;
        }
      } catch {
        estado.pacientes = [];
      }
    }
  });

  const guardarEnStorage = $((lista: Paciente[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  });

  const limpiar = $(() => {
    estado.nombre = "";
    estado.cedula = "";
    estado.telefono = "";
    estado.sangre = "";
    estado.error = "";
    estado.editando = -1;
  });

  const registrar = $(async () => {
    const nombreLimpio = estado.nombre.trim();
    const cedulaLimpia = estado.cedula.trim();
    const telefonoLimpio = estado.telefono.trim();
    const sangreElegida = estado.sangre.trim();

    if (!nombreLimpio || !cedulaLimpia || !telefonoLimpio || !sangreElegida) {
      estado.error = "Todos los campos son obligatorios.";
      return;
    }

    const soloDiezDigitos = /^\d{10}$/;
    if (!soloDiezDigitos.test(cedulaLimpia)) {
      estado.error = "La cédula debe tener exactamente 10 números.";
      return;
    }

    if (!soloDiezDigitos.test(telefonoLimpio)) {
      estado.error = "El teléfono debe tener exactamente 10 números.";
      return;
    }

    const nuevoPaciente: Paciente = {
      nombre: nombreLimpio,
      cedula: cedulaLimpia,
      telefono: telefonoLimpio,
      sangre: sangreElegida,
    };

    if (estado.editando >= 0) {
      estado.pacientes[estado.editando] = nuevoPaciente;
    } else {
      estado.pacientes = [...estado.pacientes, nuevoPaciente];
    }

    await guardarEnStorage(estado.pacientes);
    await limpiar();
  });

  const editar = $((indice: number) => {
    const paciente = estado.pacientes[indice];
    if (!paciente) return;

    estado.nombre = paciente.nombre;
    estado.cedula = paciente.cedula;
    estado.telefono = paciente.telefono;
    estado.sangre = paciente.sangre;
    estado.error = "";
    estado.editando = indice;
  });

  const eliminar = $(async (indice: number) => {
    estado.pacientes.splice(indice, 1);
    estado.pacientes = [...estado.pacientes];

    if (estado.editando === indice) {
      await limpiar();
    } else if (estado.editando > indice) {
      estado.editando -= 1;
    }

    await guardarEnStorage(estado.pacientes);
  });

  return {
    estado,
    limpiar,
    registrar,
    editar,
    eliminar,
  };
};