<script setup>
import { supabase } from "../supabase.js";

var archivoCogido;
var errorEnSubida = false;

async function altaRecordatorio() {
  if (archivoCogido) {
    //antes de escribir en la base necesiro subir el archivo a supabas
    const { data, error } = await supabase.storage
      .from("ArchivosAdjuntos")
      .upload(archivoCogido.name, archivoCogido.value);
    console.log("yeeeah");
    if (error) {
      console.log("se ha producido un error" + error);
      errorEnSubida = true;
    } else {
      console.log("archivo subido con exito");
      errorEnSubida = false;
    }
  }

  if (!archivoCogido || !errorEnSubida) {
    const { data } = await supabase.storage
      .from("ArchivosAdjuntos")
      .getPublicUrl(archivoCogido.name);
    console.log(data.publicUrl);
  }
}

function adjuntarArchivo(archivo) {
  archivoCogido = archivo.target.files[0];
  console.log("archivo seleccionado" + archivoCogido.name);
}
</script>
<template>
  <form @submit.prevent="altaRecordatorio">
    <input type="file" name="archivo" @change="adjuntarArchivo" />
    <button type="submit">Enviar</button>
  </form>
</template>
