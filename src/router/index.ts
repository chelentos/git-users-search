import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import UsersList from '@/views/UsersList.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'UsersList',
    component: UsersList,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
