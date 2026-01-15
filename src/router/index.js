import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Index.vue'
import CameraStudio from '@/views/CameraStudio.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/studio',
    name: 'Studio',
    component: CameraStudio
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
