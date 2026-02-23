import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/Login.vue'
import Dashboard from '@/pages/Dashboard.vue'

/**
 * Vue Router設定
 */

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Login,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
    },
  ],
})
