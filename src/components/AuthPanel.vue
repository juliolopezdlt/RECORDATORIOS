<script setup>
import { ref } from "vue";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { useRouter } from "vue-router";
import { GithubAuthProvider } from "firebase/auth";

const router = useRouter();

//variables para los inicios
const auth = getAuth();
const provider = new GoogleAuthProvider();
const gitProvider = new GithubAuthProvider();

var registrado = ref(false);
var iniciado = ref(false);
var olvidadoContraseña = ref(false);
var correoOlvidado = ref("");
const email = ref("");
const contra = ref("");

const iniciarSesionEmail = () => {
  setPersistence(auth, browserSessionPersistence)
    .then(() => {
      return signInWithEmailAndPassword(auth, email.value, contra.value);
    })
    .then((userCredential) => {
      localStorage.setItem("idUsuario", userCredential.user.uid);

      router.push("/privado");
      console.log("Logueado con Email");
    })
    .catch((error) => {
      console.error("Error Email:", error.message);
      alert("Email o contraseña incorrectos");
    });
};

const iniciaSesionGitHub = () => {
  setPersistence(auth, browserSessionPersistence)
    .then(() => {
      return signInWithPopup(auth, gitProvider);
    })
    .then((result) => {
      localStorage.setItem("idUsuario", result.user.uid);

      router.push("/privado");
      console.log("Logueado con GitHub");
    })
    .catch((error) => {
      console.error("Error Git:", error.message);
      alert("Error al conectar con GitHub");
    });
};

const iniciaSesionGoogle = () => {
  setPersistence(auth, browserSessionPersistence)
    .then(() => {
      return signInWithPopup(auth, provider);
    })
    .then((result) => {
      console.log("Logueado con Google");
      localStorage.setItem("idUsuario", result.user.uid);
      router.push("/privado");
    })
    .catch((error) => {
      console.error("Error Google:", error.message);
    });
};

function enviarCorrreoContraseña(email) {
  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("Correo enviado");
    })
    .catch((error) => {
      console.log(error.message);
    });
}

const registrar = () => {
  setPersistence(auth, browserSessionPersistence)
    .then(() => {
      return createUserWithEmailAndPassword(auth, email.value, contra.value);
    })
    .then((userCredential) => {
      localStorage.setItem("idUsuario", userCredential.user.uid);

      router.push("/privado");
      console.log("Registrado con persistencia de sesión");
    })
    .catch((error) => {
      console.error(error.message);
    });
};

function registro() {
  registrado.value = true;
}

function inicia() {
  iniciado.value = true;
}
</script>
<template>
  <div>
    <div class="login" v-if="!registrado && !iniciado && !olvidadoContraseña">
      <h3>Acceso</h3>
      <button @click="iniciaSesionGoogle">Inicia Sesión con Google</button>
      <button @click="iniciaSesionGitHub">Inicia Sesion GitHub</button>
      <button @click="registro">Registrarse</button>
      <button @click="inicia">Tengo cuenta Email</button>
    </div>

    <div v-if="olvidadoContraseña">
      <input v-model="correoOlvidado" type="email" placeholder="Email" />
      <button @click="enviarCorrreoContraseña(correoOlvidado)">
        Enviar correo
      </button>
      <button @click="olvidadoContraseña = false">Volver</button>
    </div>

    <div v-if="iniciado && !olvidadoContraseña">
      <h3>Iniciar Sesión con Email</h3>
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="contra" type="password" placeholder="Contraseña" />
      <button @click="iniciarSesionEmail">Iniciar Sesión</button>
      <button @click="olvidadoContraseña = true">Olvidé mi contraseña</button>
      <button @click="iniciado = false">Volver</button>
    </div>

    <div v-if="registrado">
      <h3>Registrarse</h3>
      <form @submit.prevent="registrar">
        <label>Correo Electronico</label>
        <input v-model="email" type="email" name="email" />
        <label>Contraseña</label>
        <input v-model="contra" type="password" name="contra" />
        <button type="submit">Registrarse</button>
        <button type="button" @click="registrado = false">Volver</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
div {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2.5rem;
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-card);
  animation: fadeUp 0.5s ease-out both;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

h3 {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--c-text);
  margin-bottom: 1.75rem;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--c-text-soft);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 0.4rem;
}

input {
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1.25rem;
  background: var(--c-bg-soft);
  border: 1px solid var(--c-border);
  border-radius: var(--r-sm);
  color: var(--c-text);
  font-family: var(--font-body);
  font-size: 0.95rem;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  box-sizing: border-box;
}

input::placeholder {
  color: var(--c-text-muted);
}

input:focus {
  border-color: rgba(201, 168, 76, 0.4);
  box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.07);
}

button {
  width: 100%;
  padding: 0.8rem 1rem;
  margin-bottom: 0.65rem;
  border: none;
  border-radius: var(--r-sm);
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--c-bg-mute);
  color: var(--c-text);
  border: 1px solid var(--c-border);
}

button:hover {
  border-color: var(--c-border-hover);
  background: rgba(255, 255, 255, 0.05);
  transform: translateY(-1px);
}

/* Primer botón de cada panel = acción principal */
.login button:first-of-type,
div > button:first-of-type,
form button[type="submit"] {
  background: var(--c-gold);
  color: #0d0f14;
  border-color: transparent;
  font-weight: 600;
}

.login button:first-of-type:hover,
div > button:first-of-type:hover,
form button[type="submit"]:hover {
  background: var(--c-gold-light);
  box-shadow: 0 4px 16px rgba(201, 168, 76, 0.25);
}
</style>
