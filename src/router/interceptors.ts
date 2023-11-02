import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { inject } from 'vue';

import { useAuth } from '@/composables';

const watchTitle = (route: RouteLocationNormalized) => {
  const appName = inject<string>('appName');
  const routeTitle = route.meta.title as string | undefined;

  const resultTitle = routeTitle
    ? `${appName} | ${routeTitle}`
    : appName ?? '<unknown>';

  document.title = resultTitle;
};

const watchAuth = (route: RouteLocationNormalized, _: any, next: NavigationGuardNext) => {
  const { authorizedUser } = useAuth();

  const isLoginPage = route.path === '/login';
  const isPublicPage = Boolean(route.meta.public);

  if (isLoginPage && authorizedUser) {
    return next('/dashboard');
  }

  if (!isPublicPage && !authorizedUser) {
    return next('/login');
  }

  return next();
};

export { watchTitle, watchAuth };