import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store'
import axios from "axios"
import tok from "../service/token"

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
    path: '/Planning',
    name: 'Planning',
    component: () => import(/* webpackChunkName: "about" */ '../views/Planning.vue')
  },
  {
    path: '/Evenement/Création',
    name: 'EvenementsCreation',
    component: () => import(/* webpackChunkName: "about" */ '../views/Planning.vue'),
    meta : {requireAuth : true}
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
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from,next) => {
  if(to.meta.requireAuth){
    if(store.getters.isUpdate){ // on vient de recharger la page
      if(sessionStorage.getItem("token")){  // Vérifie si un token est déjà existant
        var user = tok.decode(sessionStorage.getItem("token"));
        axios.post(`http://localhost:3000/api/Etudiant/`+user.id, { headers:{authorization: "bearer "+user.token}}).then(() => {
                next(); // identifier
            })
            .catch((error) => { 
              console.log(error);
              next({ // existe pas
                name : "Connexion"
              });
            
          });
      }
      else{
        next({ // pas de token : pas le droit
          name : "Connexion"
        });
      }
    }
    else if(store.getters.isUser){ // il a accès
      next();
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
