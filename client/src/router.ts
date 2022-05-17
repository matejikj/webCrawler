import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import NewQuery from './views/NewQuery.vue'
import NodesList from './views/NodesList.vue'
import WebpageList from './views/WebpageList.vue'
import Visualisation from './views/Visualisation.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'NewQuery',
    component: NewQuery
  },
  {
    path: '/nodes',
    name: 'NodesList',
    component: NodesList
  },
  {
    path: '/webpages',
    name: 'WebpageList',
    component: WebpageList
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
