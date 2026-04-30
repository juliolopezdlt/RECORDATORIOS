import "./assets/main.css";
import { createApp } from "vue";
import App from "./App.vue";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { createRouter, createWebHistory } from "vue-router";

// Importamos solo las páginas principales
import LandingPage from "./components/LandingPage.vue";
import AuthPanel from "./components/AuthPanel.vue";
import Privado from "./components/Privado.vue";
import supabase from "./components/supabase.vue";

const routes = [
  { path: "/", component: LandingPage },
  { path: "/login", component: AuthPanel },
  { path: "/privado", component: Privado, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from) => {
  const estasLogueado = localStorage.getItem("idUsuario");

  if (to.meta.requiresAuth && !estasLogueado) {
    return "/"; //en lugar de false, lo mandamos al inicio si intenta entrar sin permiso
  }
  if (estasLogueado && to.path === "/") {
    return "/privado";
  }
  return true;
});

const firebaseConfig = {
  apiKey: "AIzaSyDkHErHFqKw_5Zg2_K8Gfm7zvqu3O7h-Eo",
  authDomain: "recordatorios-c0481.firebaseapp.com",
  projectId: "recordatorios-c0481",
  storageBucket: "recordatorios-c0481.firebasestorage.app",
  messagingSenderId: "466722893594",
  appId: "1:466722893594:web:6f48b22db8728f703846a3",
};

const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);

const vueApp = createApp(App);
vueApp.use(router);
vueApp.mount("#app");
