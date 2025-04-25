import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';

import AccountList from './components/AccountList.vue';
import AccountForm from './components/AccountForm.vue';

const pinia = createPinia();

const routes = [
  { path: '/', component: AccountList }, 
  { path: '/add', component: AccountForm }, 
  { path: '/edit/:id', component: AccountForm }, 
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);

app.use(pinia);
app.use(router);

app.mount('#app');