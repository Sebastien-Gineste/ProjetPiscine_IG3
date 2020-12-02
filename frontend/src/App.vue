<template>
  <div id="app">
    <nav-bar /> <!-- Menu  -->

    <router-view/> <!-- Affiche la page du router sélectionner -->

  </div>
</template>


<script>
import NavBar from "@/components/NavBar.vue";
import axios from "axios";
import store from './store/'



if(localStorage.getItem("token")){
    var id = localStorage.getItem("id");
    var token = localStorage.getItem("token");
    axios.post(`http://localhost:3000/api/Etudiant/`+id).then((response) => {
            var user = {admin : response.data.admin, userId : id, token : token};
            console.log(user);
            store.dispatch('connexion',user);
            store.push("/")
        })
        .catch((error) => { 
          console.log(error);
        });
}


export default {
  components: { NavBar },
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