<script setup>
import { ref, computed } from "vue";
import { collection, query, where } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";
import { useCollection } from "vuefire";
import { db } from "../main.js";
import { doc, deleteDoc } from "firebase/firestore";
import { supabase } from "../supabase.js";

//id de usuario para diferenciar las listas de tareas
const props = defineProps({
  idUsuario: String,
  nombreUsuario: String,
});

//VARIABLE PARA EL ADMIN
const esAdmin = computed(() => {
  const idAdmin = "W23W5SSFqAXsMN7aV9dMU8WssQ22";
  return props.idUsuario === idAdmin;
});

const miLista = ref(false);

const consulta = computed(() => {
  if (!props.idUsuario) return null;

  const idAdmin = "W23W5SSFqAXsMN7aV9dMU8WssQ22";

  if (props.idUsuario == idAdmin && !miLista.value) {
    return collection(db, "tareas");
  } else {
    return query(
      collection(db, "tareas"),
      where("usuario", "==", props.idUsuario),
    );
  }
});

const tareas = useCollection(consulta);

async function borrarListaTareas() {
  tareas.value.forEach(async (tarea) => {
    await deleteDoc(doc(db, "tareas", tarea.id));
  });

  console.log("Cementerio vaciado...");
}

var indiceModal = ref("");
var mostrarModal = ref(false);
var archivoModal = ref("");
function borrarElemento(id, archivoNombre) {
  indiceModal.value = id;
  archivoModal.value = archivoNombre;
  mostrarModal.value = true;
}

//FUNCION BORRADO
async function borrado() {
  if (indiceModal.value !== null) {
    if (archivoModal.value) {
      await supabase.storage
        .from("ArchivosAdjuntos")
        .remove([archivoModal.value]);
      console.log("archivo borrado de supabase");
    }
    await deleteDoc(doc(db, "tareas", indiceModal.value));
    cerrarModal();
  }
}

//FUNCION PARA CERRAR MODAL
function cerrarModal() {
  mostrarModal.value = false;
  indiceModal.value = null;
}

//Para tachar las tareas PREGUNTAR A JOSE MAÑANA
const tacharTareas = async (tarea) => {
  const docRef = doc(db, "tareas", tarea.id);
  await updateDoc(docRef, {
    completada: tarea.completada,
  });
};
var editarElemento = ref(null);
//ACTUALIZAR PRODUCTO
async function actualizarProducto(id, nuevoNombre) {
  const nuevaTarea = doc(db, "tareas", id);
  await updateDoc(nuevaTarea, { nombre: nuevoNombre });
  editarElemento.value = null;
}
</script>
<template>
  <div>
    <button @click="borrarListaTareas">Borrar lista</button>
    <button v-if="esAdmin" @click="miLista = !miLista" class="btn-toggle-admin">
      {{ miLista ? "Ver TODOS los usuarios" : "Ver SOLO mis recordatorios" }}
    </button>
    <div v-if="tareas.length == 0">No hay recordatorios...</div>
    <div v-else>
      <ul>
        <li v-for="tarea in tareas" :key="tarea.id">
          <div v-if="esAdmin">
            <p>Usuario: {{ tarea.nombreUsuario }}</p>
          </div>
          <span :class="{ 'texto-tachado': tarea.completada }"
            >{{ tarea.nombre }}
          </span>
          <a
            v-if="tarea.archivoUrl"
            :href="tarea.archivoUrl"
            target="_blank"
            download
            class="descarga"
          >
            {{ tarea.archivoNombre }}
          </a>
          <button @click="borrarElemento(tarea.id, tarea.archivoNombre)">
            🗑️
          </button>
          <button @click="editarElemento = tarea.id">✏️</button>
          <input
            type="checkbox"
            @change="tacharTareas(tarea)"
            v-model="tarea.completada"
          />

          <div v-if="editarElemento == tarea.id">
            <input
              v-model="tarea.nombre"
              @keyup.enter="actualizarProducto(tarea.id, tarea.nombre)"
            />
            <button @click="actualizarProducto(tarea.id, tarea.nombre)">
              Cambiar
            </button>
            <button @click="editarElemento = null">Cancelar</button>
          </div>
        </li>
      </ul>

      <div v-if="mostrarModal" class="modal-overlay">
        <p>Estas seguro de que quieres borrar el elemento</p>
        <button @click="borrado">Si</button>
        <button @click="cerrarModal">No</button>
        <label>Hecho</label>
      </div>
    </div>
  </div>
</template>
<style scoped>
.descarga {
  font-size: 0.78rem;
  color: var(--c-gold);
  background: var(--c-gold-dim);
  border: 1px solid rgba(201, 168, 76, 0.2);
  padding: 0.25rem 0.7rem;
  border-radius: var(--r-sm);
  text-decoration: none;
  transition: all 0.2s;
  white-space: nowrap;
}

.descarga:hover {
  background: rgba(201, 168, 76, 0.2);
  color: var(--c-gold-light);
}
/* Botón borrar lista */
div > button:first-child {
  background: transparent;
  color: var(--c-danger);
  border: 1px solid var(--c-danger-dim);
  padding: 0.4rem 1rem;
  border-radius: var(--r-sm);
  font-family: var(--font-body);
  font-size: 0.78rem;
  cursor: pointer;
  margin-bottom: 1.25rem;
  transition: all 0.2s;
}
.texto-tachado {
  text-decoration: line-through;
  color: gray;
}

div > button:first-child:hover {
  background: var(--c-danger-dim);
}

/* Mensaje vacío */
div > div:not([v-if]) {
  text-align: center;
  color: var(--c-text-muted);
  padding: 3rem;
  font-style: italic;
}

ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-radius: var(--r-md);
  padding: 0.9rem 1.25rem;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  animation: slideIn 0.25s ease-out both;
  flex-wrap: wrap;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

li:hover {
  border-color: var(--c-border-hover);
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.25);
}

li p {
  font-size: 0.72rem;
  color: var(--c-gold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.75;
  width: 100%;
  margin-bottom: 0.2rem;
}

li span {
  flex: 1;
  color: var(--c-text);
  font-size: 0.975rem;
}

/* Botones de acción (🗑️ y ✏️) */
li > button {
  background: var(--c-bg-mute);
  border: 1px solid var(--c-border);
  color: var(--c-text-soft);
  width: 32px;
  height: 32px;
  border-radius: var(--r-sm);
  cursor: pointer;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.18s;
  opacity: 0;
  padding: 0;
}

li:hover > button {
  opacity: 1;
}

li > button:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: var(--c-border-hover);
}

/* Caja de edición */
li > div {
  display: flex;
  gap: 0.5rem;
  width: 100%;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

li > div input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  background: var(--c-bg-soft);
  border: 1px solid rgba(201, 168, 76, 0.35);
  border-radius: var(--r-sm);
  color: var(--c-text);
  font-family: var(--font-body);
  font-size: 0.9rem;
  outline: none;
  min-width: 0;
}

li > div button {
  opacity: 1;
  width: auto;
  height: auto;
  padding: 0.45rem 0.9rem;
  font-size: 0.82rem;
  font-weight: 500;
}

li > div button:first-of-type {
  background: var(--c-gold);
  color: #0d0f14;
  border-color: transparent;
  font-weight: 600;
}

li > div button:first-of-type:hover {
  background: var(--c-gold-light);
}

/* Modal */
/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-overlay p {
  font-family: var(--font-display);
  font-size: 1.1rem;
  color: var(--c-text);
  text-align: center;
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-radius: var(--r-lg) var(--r-lg) 0 0;
  padding: 2.5rem 3rem 2rem;
  width: 360px;
  margin: 0;
}

.modal-overlay label {
  display: none;
}

.modal-overlay button {
  opacity: 1;
  width: 180px;
  height: auto;
  padding: 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 0;
}

.modal-overlay button:first-of-type {
  background: var(--c-danger);
  color: white;
  border-color: transparent;
  font-weight: 600;
  border-radius: 0 0 0 var(--r-lg);
  border-right: 1px solid rgba(0, 0, 0, 0.15);
}

.modal-overlay button:first-of-type:hover {
  background: #e74c3c;
}

.modal-overlay button:last-of-type {
  background: var(--c-bg-mute);
  color: var(--c-text-soft);
  border: 1px solid var(--c-border);
  border-left: none;
  border-radius: 0 0 var(--r-lg) 0;
}

.modal-overlay button:last-of-type:hover {
  color: var(--c-text);
  background: rgba(163, 209, 13, 0.05);
}
.btn-toggle-admin {
  background: var(--c-gold-dim);
  color: var(--c-gold);
  border: 1px solid rgba(201, 168, 76, 0.25);
  padding: 0.4rem 1rem;
  border-radius: var(--r-sm);
  font-family: var(--font-body);
  font-size: 0.78rem;
  cursor: pointer;
  margin-bottom: 1.25rem;
  margin-left: 0.5rem;
  transition: all 0.2s;
}

.btn-toggle-admin:hover {
  background: rgba(201, 168, 76, 0.2);
}
</style>
