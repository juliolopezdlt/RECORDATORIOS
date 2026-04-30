<script setup>
import { ref, onMounted } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import PerfilUsuario from "./PerfilUsuario.vue";
import NuevoRecordatorio from "./NuevoRecordatorio.vue";
import ListaComponentes from "./ListaComponentes.vue";

const usuario = ref(null);

const auth = getAuth();

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      usuario.value = user;
    }
  });
});
</script>

<template>
  <div v-if="usuario">
    <h2>Mi Panel Privado</h2>

    <PerfilUsuario :usuario="usuario" />
    <hr />

    <NuevoRecordatorio
      :idUsuario="usuario.uid"
      :nombreUsuario="usuario.email"
    />
    <ListaComponentes :idUsuario="usuario.uid" />
  </div>
</template>
<style scoped>
div {
  padding: 3rem 0 2rem;
  animation: fadeUp 0.5s ease-out both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

h2 {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  color: var(--c-text);
  letter-spacing: -0.02em;
  margin-bottom: 1.75rem;
}

hr {
  border: none;
  height: 1px;
  background: var(--c-border);
  margin: 1.5rem 0;
}
</style>
