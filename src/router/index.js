import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'

const routes = [
  { path: '/', name: 'Dashboard', component: DashboardView },
  { path: '/stock', name: 'Stock', component: () => import('../views/StockView.vue') },
  { path: '/order', name: 'Order', component: () => import('../views/OrderView.vue') },
  { path: '/tracking', name: 'Tracking', component: () => import('../views/TrackingView.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
