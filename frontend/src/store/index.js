import Vue from 'vue'
import Vuex from 'vuex'
/*import router from '../router'*/

// on va mettre ici les infos de la personne qui est connecté
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    id : null, 
    admin : false,
  },
  mutations: {
    UPDATE_USER : (state, user) =>{
      state.id = user.userId
      state.admin = user.admin
    }
  },
  getters: {
    isAdmin : state => {
      return state.admin; 
    },
    isUser : state => { // permet de voir qui est connecté 
      return state.id !== "-1" && state.id !== null},
    isUpdate : state =>{ // permet de savoir si le state n'a pas été mise a jour au chargement de vue pour la première fois
      return state.id === null
    }
  },
  actions: {
    connexion({ commit },user){
      commit('UPDATE_USER',user)
    },
    deconnexion({ commit }){
      commit('UPDATE_USER',{userId : "-1",admin : false})
    }
  },
  modules: {
  }
})
