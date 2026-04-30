<script setup>
import { getAuth, signOut } from "firebase/auth";

import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  usuario: Object,
  nombreUsuario: String,
});

function cerrarSesion() {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      console.log("Ha cerrado la sesion");
      localStorage.removeItem("idUsuario");
      router.push("/");
    })
    .catch((error) => {
      console.log("Error al salir");
    });
}
</script>
<template>
  <div class="bienvenido">
    Bienvenido, {{ usuario.displayName }} >
    <img :src="usuario.photoURL" />
    <button @click="cerrarSesion">Cerrar sesión</button>
  </div>
</template>

<style scoped>
.bienvenido {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1.25rem;
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-radius: var(--r-md);
  margin-bottom: 1.5rem;
  color: var(--c-text-soft);
  font-size: 0.9rem;
  font-weight: 300;
}

.bienvenido img {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--c-border);
}

.bienvenido button {
  margin-left: auto;
  background: transparent;
  color: var(--c-text-soft);
  border: 1px solid var(--c-border);
  padding: 0.4rem 0.9rem;
  border-radius: var(--r-sm);
  font-family: var(--font-body);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.bienvenido button:hover {
  color: var(--c-danger);
  border-color: var(--c-danger-dim);
  background: var(--c-danger-dim);
}
</style>
