import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/inscription',
    name: 'Inscription',
    component: () => import('../views/Inscription.vue')
  },
  {
    path: '/authentification',
    name: 'Authentification',
    component: () => import('../views/Authentification.vue')
  },

   {
  path: '/listing',
  name: 'Listing',
  component: () => import('../views/Listing.vue')
},
  {
  path: '/perso',
  name: 'Perso',
  component: () => import('../views/Perso.vue')
  },
  {
    path: '/creation',
    name: 'Creation',
    component: () => import('../views/Creation.vue')
    },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({

  routes
})

export default router
