<script setup></script>
<template>
  <div class="hero-container">
    <h2>Bienvenido a la App de Recordatorios</h2>
    <p>
      Organiza tu día de forma sencilla. Inicia sesión para empezar a crear tus
      recordatorios.
    </p>
    <img src="/recordar.png" class="hero-image" alt="Recordatorios" />
  </div>
</template>
<style scoped>
.hero-container {
  max-width: 620px;
  margin: 6rem auto 3rem;
  text-align: center;
  padding: 4rem 2.5rem;
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-card), var(--shadow-glow);
  animation: fadeUp 0.6s ease-out both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

h2 {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  color: var(--c-text);
  line-height: 1.25;
  margin-bottom: 1.25rem;
}

h2::after {
  content: '';
  display: block;
  width: 40px;
  height: 2px;
  background: var(--c-gold);
  margin: 1rem auto 0;
  border-radius: 2px;
}

p {
  color: var(--c-text-soft);
  font-size: 1rem;
  max-width: 400px;
  margin: 0 auto 2rem;
  font-weight: 300;
  line-height: 1.7;
}

.hero-image {
  max-width: 180px;
  opacity: 0.7;
  filter: grayscale(0.3);
}
</style>
