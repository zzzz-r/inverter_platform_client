import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/plant',
    name: 'PlantList',
    component: () => import("@/views/PlantList.vue"),
    // children: [{
    //   path: 'details',
    //   name: 'PlantDetails',
    //   component: () => import("@/views/PlantDetails.vue")
    // }]
  },
  {
    path: '/plant/details',
    name: 'PlantDetails',
    component: () => import("@/views/PlantDetails.vue")
  },
  {
    path: '/map',
    name: 'map',
    component: () => import("@/components/GetPosMap.vue")
  }
]

const router = new VueRouter({
  routes
})

export default router
