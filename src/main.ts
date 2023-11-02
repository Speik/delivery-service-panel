import { createApp } from 'vue';
import { createPinia } from 'pinia';

import { router } from './router';
import App from './App.vue';

import './global.css';

const isDevelopment = (
  process.env.NODE_ENV === 'development'
);

const pinia = createPinia();
const app = createApp(App);

app.provide('isDevelopment', isDevelopment);
app.provide('appName', 'Delivery panel');
app.provide('router', router);

app.use(pinia);
app.use(router);

app.mount('#app');