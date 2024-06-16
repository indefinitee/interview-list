import { useUserStore } from '@/stores/user'
import type { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
const checkAuth = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  let isAuth = false

  onAuthStateChanged(getAuth(), (user) => {
    if (user && !isAuth) {
      isAuth = true
      next()
    } else if (!user && !isAuth) {
      isAuth = true
      next('/auth')
    }
  })
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/PageHome.vue')
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import('@/views/PageAuth.vue')
  },
  {
    path: '/interview/:id',
    name: 'interview',
    component: () => import('@/views/PageInterview.vue'),
    beforeEnter: checkAuth
  },
  {
    path: '/list',
    name: 'list',
    component: () => import('@/views/PageList.vue'),
    beforeEnter: checkAuth
  },
  {
    path: '/stats',
    name: 'stats',
    component: () => import('@/views/PageStats.vue'),
    beforeEnter: checkAuth
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router
