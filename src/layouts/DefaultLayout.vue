<template>
    <div class="container mt-4">
      <header class="mb-4">
        <h1 class="text-center">Управление учетными записями</h1>
        <nav class="d-flex justify-content-center gap-3">
          <router-link to="/" class="btn btn-primary">Список учетных записей</router-link>
          <router-link to="/add" class="btn btn-success">Добавить учетную запись</router-link>
        </nav>
      </header>
      <main>
        <router-view />
      </main>
    </div>
  </template>
  
  <script lang="ts">
  export default {
    name: 'DefaultLayout',
  };
  </script>