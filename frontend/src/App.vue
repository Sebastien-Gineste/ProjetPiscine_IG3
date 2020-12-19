<template>
  <div id="app">
    <nav-bar /> <!-- Menu  -->

    <div id="contain">
      <router-view/> <!-- Affiche la page du router sélectionner -->
    </div>
  </div>
</template>


<script>
import NavBar from "@/components/NavBar.vue";
import axio from "axios";
import store from './store/';

const axios = axio.create({
  withCredentials: true
})


export default {
  components: { NavBar },
  beforeMount(){
    if(store.getters.isUpdate){
      axios.post(`http://localhost:3000/api/Etudiant/VerifCo`).then((response) => {
        var user = {admin : response.data.admin, userId : response.data.userId};
        store.dispatch('connexion',user);
      })
      .catch((error) => { 
        if(error.response.status == 401){
          this.$store.dispatch('deconnexion');
        }
      });
    }
  }
}

</script>

<style lang="scss">
#contain{
  min-height : 100vh;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>