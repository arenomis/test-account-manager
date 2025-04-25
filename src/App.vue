<template>
  <div id="app">
    <h1>Управление учетными записями</h1>
    <nav>
      <router-link to="/">Список учетных записей</router-link> |
      <router-link to="/add">Добавить учетную запись</router-link>
    </nav>
    <hr />
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

nav {
  margin-bottom: 20px;
}

nav a {
  margin: 0 10px;
  text-decoration: none;
  color: #42b983;
}

nav a.router-link-exact-active {
  font-weight: bold;
  color: #35495e;
}
</style>