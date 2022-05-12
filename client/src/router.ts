import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from './views/Query.vue'
import Query from './views/Query.vue'
import Nodee from './views/Node.vue'
import Webpage from './views/Webpage.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/',
    name: 'Queries',
    component: Query
  },
  {
    path: '/',
    name: 'Nodes',
    component: Nodee
  },
  {
    path: '/',
    name: 'Webpages',
    component: Webpage
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
