import { RouteRecordRaw } from 'vue-router';

import {
  Restaurant as OrdersIcon,
  Dashboard as DashboardIcon,
  TagGroup as CategoriesIcon,
  ServiceDesk as DishesIcon,
  UserProfile as CustomersIcon,
  UserSettings as UsersIcon,
} from '@vicons/carbon';

import {
  Login,
  Dashboard,
  Orders,
  Customers,
  Categories,
  Dishes,
  Users,
  NotFoundPage,
} from '@/pages';

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login, meta: { title: 'Login', public: true } },
  { path: '/:notFound', component: NotFoundPage, meta: { public: true } },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { title: 'Dashboard', icon: DashboardIcon, navigational: true, divided: true },
  },
  {
    path: '/orders',
    component: Orders,
    meta: { title: 'Orders', icon: OrdersIcon, navigational: true },
  },
  {
    path: '/customers',
    component: Customers,
    meta: { title: 'Customers', icon: CustomersIcon, navigational: true, divided: true },
  },
  {
    path: '/categories',
    component: Categories,
    meta: { title: 'Categories', icon: CategoriesIcon, navigational: true },
  },
  {
    path: '/dishes',
    component: Dishes,
    meta: { title: 'Dishes', icon: DishesIcon, navigational: true, divided: true },
  },
  {
    path: '/users',
    component: Users,
    meta: { title: 'Users', icon: UsersIcon, navigational: true },
  },
];