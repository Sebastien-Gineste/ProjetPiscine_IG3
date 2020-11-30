import Vue from 'vue'
import Vuex from 'vuex'
/*import router from '../router'*/

// on va mettre ici les infos de la personne qui est connecté
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    id : null, 
    admin : false,
    token :null
  },
  mutations: {
    UPDATE_USER : (state, id, admin, token) =>{
      state.id = id,
      state.admin = admin,
      state.token = token
    }
  },
  getters: {
    isAdmin : state => {
      return state.id; 
    },
    isUser : state => {
      return state.id != null;
    }
  },
  actions: {
    connexion({ commit },id,admin,token){
      commit('UPDATE_USER',id,admin, token)
    },
    deconnexion({ commit }){
      commit('UPDATE_USER',null,false,null)
    }
  },
  modules: {
  }
})
