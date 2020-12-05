<template>
  <div id="app">
    <nav-bar /> <!-- Menu  -->

    <router-view/> <!-- Affiche la page du router sélectionner -->

  </div>
</template>


<script>
import NavBar from "@/components/NavBar.vue";
import axios from "axios";
import tok from "./service/token"
import store from './store/';


export default {
  components: { NavBar },
  beforeMount(){
    if(store.getters.isUpdate){
       if(sessionStorage.getItem("token")){  // Vérifie si un token est déjà existant
          var user = tok.decode(sessionStorage.getItem("token"));
          axios.post(`http://localhost:3000/api/Etudiant/`+user.id, { headers:{authorization: "bearer "+user.token}}).then((response) => {
                  user = {admin : response.data.admin, userId : user.id, token : user.token};
                  store.dispatch('connexion',user);
              })
              .catch((error) => { 
                console.log(error);
              });
      }
      else{
         store.dispatch('deconnexion',user);
      }
    }
  }
}

</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>