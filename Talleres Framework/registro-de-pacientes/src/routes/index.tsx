import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Registro } from "~/components/registro/registro";

export default component$(() => {
  return <Registro />;
});

export const head: DocumentHead = {
  title: "Registro de Pacientes - Qwik",
  meta: [
    {
      name: "description",
      content: "Taller de registro básico de pacientes con Qwik",
    },
  ],
};