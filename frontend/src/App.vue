<template>
  <div id="app">
    <nav-bar /> <!-- Menu  -->

    <router-view/> <!-- Affiche la page du router sélectionner -->

  </div>
</template>


<script>
import NavBar from "@/components/NavBar.vue";

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