import { USER_URL } from './../utils/urls'
import { withTokenInstance } from './../api/axios'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Profile from '../pages/Profile.vue'
import Project from '../pages/Project.vue'
import Todo from '../pages/Todo.vue'
import axios from 'axios'

const source = axios.CancelToken.source()

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
    component: Profile
  },
  {
    path: '/projects/:id/todos',
    name: 'Project',
    component: Project
  },
  {
    path: '/projects/:id/todos/:todoId',
    name: 'Todo',
    component: Todo
  },
  {
    path: '/:catchAll(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

router.beforeEach(async (to, from, next) => {
  var isAuthenticated = false
  if (localStorage.getItem('tokens')) {
    try {
      const res = await withTokenInstance.get(USER_URL)
      isAuthenticated = true
    } catch (error) {
      console.log(error)
      isAuthenticated = false
    }
  } else {
    isAuthenticated = false
  }

  if (isAuthenticated) {
    if (to.name === 'Login' || to.name === 'Register') {
      next('/')
    } else {
      next()
    }
  } else {
    if (to.name === 'Home' || to.name === 'Project' || to.name === "Todo" || to.name === "Profile") {
      next('/login')
    } else {
      next()
    }
  }

  // if (!isAuthenticated && (to.name === 'Home' || to.name === 'Project')) {
  //   next('/login')
  // } else if (isAuthenticated && (to.name === 'Login' || to.name === 'Register')) {
  //   next('/')
  // } else {
  //   next()
  // }
})

export default router
