import { createRouter, createWebHistory } from 'vue-router';

import { routes } from './routes';
import { watchTitle, watchAuth } from './interceptors';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeResolve(watchAuth);
router.beforeEach(watchTitle);

export { router };