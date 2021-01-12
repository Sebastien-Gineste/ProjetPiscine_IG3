import Vue from 'vue'
import Vuex from 'vuex'
/*import router from '../router'*/

// on va mettre ici les infos de la personne qui est connecté
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    id : null, 
    admin : false,
    group : -1,
    idEvent : -1,
  },
  mutations: {
    UPDATE_USER : (state, user) =>{
      state.id = user.userId
      state.admin = user.admin
      state.group = user.group
      state.idEvent = user.numEvent
    },
    UPDATE_GROUP : (state, group) =>{
      state.group=group
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
    },
    hasGroup : state => {
      return state.group != "-1" 
    },
    getGroup : state => {
      return state.group;
    },
    getIdEvent : state =>{ // id de l'évenement de l'étudiant 
      return state.idEvent;
    },
    getId : state => {
      return state.id
    },

    
  },
  actions: {
    connexion({ commit },user){
      commit('UPDATE_USER',user)
    },
    deconnexion({ commit }){
      commit('UPDATE_USER',{userId : "-1",admin : false, group : -1, numEvent : -1})
    },
    ajoutGroup({commit},group){
      commit('UPDATE_GROUP',group)
    },
  },
  modules: {
  }
})
