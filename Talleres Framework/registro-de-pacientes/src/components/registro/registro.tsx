import { component$, useStyles$ } from "@builder.io/qwik";
import estilos from "./registro.css?inline";
import { usePacientes } from "./logica";

const TIPOS_SANGRE = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

export const Registro = component$(() => {
  useStyles$(estilos);

  const { estado, limpiar, registrar, editar, eliminar } = usePacientes();

  return (
    <section class="registro-contenedor">
      <h1>Registro de Pacientes</h1>

      <form
        class="registro-form"
        preventdefault:submit
        onSubmit$={registrar}
      >
        <div class="campo">
          <label for="nombre">Nombre completo</label>
          <input
            id="nombre"
            type="text"
            placeholder="Ej. Ana María López"
            value={estado.nombre}
            onInput$={(_, el) => {
              estado.nombre = el.value;
            }}
          />
        </div>

        <div class="campo">
          <label for="cedula">Cédula (10 dígitos)</label>
          <input
            id="cedula"
            type="text"
            inputMode="numeric"
            maxLength={10}
            placeholder="0123456789"
            value={estado.cedula}
            onInput$={(_, el) => {
              estado.cedula = el.value.replace(/\D/g, "").slice(0, 10);
            }}
          />
        </div>

        <div class="campo">
          <label for="telefono">Teléfono (10 dígitos)</label>
          <input
            id="telefono"
            type="text"
            inputMode="numeric"
            maxLength={10}
            placeholder="0987654321"
            value={estado.telefono}
            onInput$={(_, el) => {
              estado.telefono = el.value.replace(/\D/g, "").slice(0, 10);
            }}
          />
        </div>

        <div class="campo">
          <label for="sangre">Tipo de sangre</label>
          <select
            id="sangre"
            value={estado.sangre}
            onChange$={(_, el) => {
              estado.sangre = el.value;
            }}
          >
            <option value="">Seleccione un tipo</option>
            {TIPOS_SANGRE.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {estado.error && <p class="error-mensaje">{estado.error}</p>}

        <div class="acciones">
          <button type="submit" class="btn-primario">
            {estado.editando >= 0 ? "Actualizar" : "Registrar"}
          </button>

          {estado.editando >= 0 && (
            <button type="button" class="btn-secundario" onClick$={limpiar}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div class="lista-pacientes">
        <h2>Pacientes registrados ({estado.pacientes.length})</h2>

        {estado.pacientes.length === 0 ? (
          <p class="vacio">Aún no hay pacientes registrados.</p>
        ) : (
          <ul class="lista">
            {estado.pacientes.map((paciente, i) => (
              <li key={`${paciente.cedula}-${i}`} class="fila-paciente">
                <div class="datos">
                  <strong>{paciente.nombre}</strong>
                  <span>Cédula: {paciente.cedula}</span>
                  <span>Teléfono: {paciente.telefono}</span>
                  <span>Tipo de sangre: {paciente.sangre}</span>
                </div>
                <div class="fila-acciones">
                  <button
                    type="button"
                    class="btn-editar"
                    onClick$={() => editar(i)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    class="btn-eliminar"
                    onClick$={() => eliminar(i)}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
});