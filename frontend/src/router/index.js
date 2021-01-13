import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store'
import axio from "axios";

const axios = axio.create({
  withCredentials: true
})

Vue.use(VueRouter)
// page de l'application
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/Connexion',
    name: 'Connexion',
    component: () => import(/* webpackChunkName: "about" */ '../views/Connexion.vue')
  },
  {
    path: '/Evenement/Création',
    name: 'EvenementsCreation',
    component: () => import(/* webpackChunkName: "about" */ '../views/Create_Update_Evenement.vue'),
    meta : {requireAuth : true, requireAdmin : true}
  },
  {
    path: '/PageProfil',
    name: 'PageProfil',
    component: () => import(/* webpackChunkName: "about" */ '../views/PageProfil.vue'),
    //meta : {requireAuth : false, requireAdmin : false}
  },
  {
    path: '/CreationCompte',
    name: 'CreationCompte',
    component: () => import(/* webpackChunkName: "about" */ '../views/CreationCompte.vue'),
    //meta : {requireAuth : false, requireAdmin : false}
  },
  {
    path: '/Evenement/:id',
    name: 'EvenementsModifier',
    component: () => import(/* webpackChunkName: "about" */ '../views/Create_Update_Evenement.vue'),
    meta : {requireAuth : true, requireAdmin : true}
  },
  {
    path: '/Evenement/:id/Planning',
    name: 'planningEvent',
    component: () => import(/* webpackChunkName: "about" */ '../views/Planning.vue'),
  },
  {
    path: '/Evenement/:id/Planning/:infoProf',
    name: 'planningEventProf',
    component: () => import(/* webpackChunkName: "about" */ '../views/Planning.vue'),
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/Groupe/Création',
    name: 'GroupCreation',
    component: () => import(/* webpackChunkName: "about" */ '../views/Group_Management.vue'),
    meta : {requireAuth : true, requireAdmin : false}
  },
  {
    path: '/Groupe/Modification',
    name: 'GroupModification',
    component: () => import(/* webpackChunkName: "about" */ '../views/Group_Management.vue'),
    meta : {requireAuth : true, requireAdmin : false}
  },
  {
    path: '/Groupe',
    name: 'GroupManagement',
    component: () => import(/* webpackChunkName: "about" */ '../views/Group_Management.vue'),
    meta : {requireAuth : true, requireAdmin : false}
  },
  {
    path: '/RecupPassword',
    name: 'RecupPassword',
    component: () => import(/* webpackChunkName: "about" */ '../views/RecupPassword.vue'),
    meta : {requireAuth : false, requireAdmin : false}
  },
  {
    path: '/Evenement',
    name: 'GestionEvent',
    component: () => import(/* webpackChunkName: "about" */ '../views/Event_Management.vue'),
    meta : {requireAuth : true, requireAdmin : true}
  },
  {
    path: '/Promo',
    name: 'promo',
    component: () => import(/* webpackChunkName: "about" */ '../views/Promo.vue'),
    meta : {requireAuth : true, requireAdmin : true}
  },
  { path: "*", // à mettre à la fin du routeur
    name: "404",
   component:  () => import(/* webpackChunkName: "about" */ '../views/Error.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from,next) => {
  if(to.meta.requireAuth){
    if(store.getters.isUpdate){ // on vient de recharger la page
      axios.post(`http://localhost:3000/api/Etudiant/VerifCo`).then((res) => {
        if(to.meta.requireAdmin){
            if(res.data.admin) {next();} // identifier
            else{ next({ name : "Connexion" });}
        }
        else{
          next(); // identifier
        }
        })
      .catch((error) => { 
        console.log(error);
        next({ // existe pas
          name : "Connexion"
        });
      });
    }
    else if(store.getters.isUser){ // il a accès
      if(to.meta.requireAdmin){
        if(store.getters.isAdmin) {next();} // identifier
        else{ next({ name : "Connexion" });}
      }
      else{
        next(); // identifier
      }
    }
    else{ // n'a pas le droit
      next({
        name : "Connexion"
      });
    }
  }
  else{ // ne nécessaire par un authendification
    next();
  }
});


export default router
