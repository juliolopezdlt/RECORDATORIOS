<script setup>
import { ref, onMounted } from "vue";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const logueado = ref(false);
const auth = getAuth();

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      logueado.value = user;
      console.log("usuario logueado");

      //creamos la variable para que el main la vea
      localStorage.setItem("idUsuario", user.uid);
    } else {
      //eliminamos la variable si cierra sesion
      localStorage.removeItem("idUsuario");
      logueado.value = null;
      console.log("no hay usuario");
    }
  });
});
</script>
<template>
  <header>
    <h1>Mis Recordatorios</h1>
    <nav>
      <RouterLink to="/">Inicio</RouterLink>

      <RouterLink v-if="!logueado" to="/login">Login</RouterLink>

      <RouterLink v-if="logueado" to="/privado">Mi Panel</RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style>
header {
  border-bottom: 1px solid var(--c-border);
  background: rgba(13, 15, 20, 0.85);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  height: 64px;
  max-width: 100%;
}

header h1 {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--c-text);
  letter-spacing: 0.01em;
}

nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

nav a {
  color: var(--c-text-soft);
  padding: 0.45rem 0.9rem;
  border-radius: var(--r-sm);
  font-size: 0.875rem;
  transition: all 0.2s;
}

nav a:hover {
  color: var(--c-text);
  background: var(--c-bg-mute);
}

nav a.router-link-active {
  color: var(--c-gold);
}

main {
  max-width: 860px;
  margin: 0 auto;
}
</style>
