import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import { useAuth } from '../stores/auth'

const isAuthenticated = false

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../pages/Profile.vue')
  },
  {
    path: '/:catchAll(.*)*',
    component: HomeView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

router.beforeEach(async (to, from) => {
  if (!isAuthenticated && to.name !== 'Login' && to.name !== 'Register') {
    return { name: 'Login' }
  }
})

export default router
