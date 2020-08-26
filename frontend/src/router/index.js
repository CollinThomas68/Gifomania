import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
import Creation from '../views/Creation.vue'
import Message from '../views/Message.vue'
import ChoixModeration from'../views/ChoixModeration.vue'

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
    path: '/choixModeration',
    name: 'ChoixModeration',
    component: ChoixModeration
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
  component: Creation
  },
  {
    path: '/message/:id',
    name: 'Message',
    component: Message
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
  mode:'history',
  routes
})

export default router
