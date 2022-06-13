import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Webpages from './views/Webpages.vue'
import Visualisation from './views/Visualisation.vue'
import Executions from './views/Executions.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Webpages',
    component: Webpages
  },
  {
    path: '/executions',
    name: 'Executions',
    component: Executions
  },
  {
    path: '/visualisation',
    name: 'Visualisation',
    component: Visualisation
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
