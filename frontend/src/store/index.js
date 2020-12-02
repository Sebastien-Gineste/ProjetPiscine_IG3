import Vue from 'vue'
import Vuex from 'vuex'
/*import router from '../router'*/

// on va mettre ici les infos de la personne qui est connecté
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    id : null, 
    admin : false,
    token : null
  },
  mutations: {
    UPDATE_USER : (state, user) =>{
      state.id = user.userId
      state.admin = user.admin,
      state.token = user.token
    }
  },
  getters: {
    isAdmin : state => {
      return state.admin; 
    },
    isUser : state => {
      return state.id != null;
    }
  },
  actions: {
    connexion({ commit },user){
      commit('UPDATE_USER',user)
    },
    deconnexion({ commit }){
      commit('UPDATE_USER',{userId : null,admin : false, token : null})
    }
  },
  modules: {
  }
})
