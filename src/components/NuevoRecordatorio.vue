<script setup>
import { ref } from "vue";
import { db } from "../main.js"; // Importamos la db que configuraste en main.js
import { collection, addDoc } from "firebase/firestore";
import { supabase } from "../supabase.js";

//SUPABASEEEEEEEEE

var archivoCogido = ref(null);
var errorEnSubida = false;
var URLArchivo = "";
var nombreArchivo = "";
var keyInput = ref(0);

function adjuntarArchivo(archivo) {
  archivoCogido.value = archivo.target.files[0];
  console.log("archivo seleccionado" + archivoCogido.value);
}
function quitarArchivo() {
  archivoCogido.value = null;
  URLArchivo = "";
  nombreArchivo = "";
  keyInput.value++;
}

const props = defineProps({
  idUsuario: String,
  nombreUsuario: String,
});

var valueInput = ref("");

async function anadirElemento() {
  if (valueInput.value.trim() === "") return;

  URLArchivo = "";
  nombreArchivo = "";

  if (archivoCogido.value) {
    const { data, error } = await supabase.storage
      .from("ArchivosAdjuntos")
      .upload(archivoCogido.value.name, archivoCogido.value);

    if (error) {
      console.log("Error subiendo archivo: " + error.message);
    } else {
      const { data: urlData } = supabase.storage
        .from("ArchivosAdjuntos")
        .getPublicUrl(archivoCogido.value.name);
      URLArchivo = urlData.publicUrl;
      nombreArchivo = archivoCogido.value.name;
    }
  }

  await addDoc(collection(db, "tareas"), {
    nombre: valueInput.value,
    tachar: false,
    usuario: props.idUsuario,
    fecha: new Date(),
    nombreUsuario: props.nombreUsuario,
    archivoUrl: URLArchivo,
    archivoNombre: nombreArchivo,
  });

  console.log("tarea añadida");
  keyInput.value++;
  valueInput.value = "";
  archivoCogido.value = null;
}
</script>
<template>
  <div>
    <input
      @keyup.enter="anadirElemento"
      v-model="valueInput"
      placeholder="Qué quieres recordar?"
    />

    <input
      type="file"
      name="archivo"
      @change="adjuntarArchivo"
      :key="keyInput"
    />
    <span v-if="archivoCogido">
      <button @click="quitarArchivo">Quitar archivo</button>
    </span>

    <button @click="anadirElemento">Añadir</button>
  </div>
</template>
<style scoped>
div {
  display: flex;
  gap: 0.75rem;
  margin: 2rem 0 1.5rem;
}

input {
  flex: 1;
  padding: 0.85rem 1.1rem;
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-radius: var(--r-md);
  color: var(--c-text);
  font-family: var(--font-body);
  font-size: 0.975rem;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

input::placeholder {
  color: var(--c-text-muted);
  font-style: italic;
}

input:focus {
  border-color: rgba(201, 168, 76, 0.35);
  box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.06);
}

button {
  padding: 0.85rem 1.75rem;
  background: var(--c-gold);
  color: #0d0f14;
  border: none;
  border-radius: var(--r-md);
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

button:hover {
  background: var(--c-gold-light);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(201, 168, 76, 0.2);
}

button:active {
  transform: translateY(0);
}
</style>
