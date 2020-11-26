import Vue from 'vue'
import Vuex from 'vuex'
// on va mettre ici les infos de la personne qui est connecté
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user : "jean",
    admin : false,
    token : "token"
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
