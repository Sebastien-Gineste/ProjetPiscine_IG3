<template>
    <div id= "nav">
      <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand href="#">
          <b-link class="navbar-brand" to="/">Accueil</b-link>
        </b-navbar-brand>
       <!-- <b-navbar-brand href="#"><b-img :src="require('./assets/polytech.png')" fluid alt="Responsive image"></b-img></b-navbar-brand> -->
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <li v-if="isUser() && !isAdmin()" class="nav-item"><b-link class="nav-link" to="/about">S'inscrire à une soutance</b-link></li>
            <li v-if="isUser() && !isAdmin()" class="nav-item"><b-link class="nav-link" to="/Groupe">Gestion du groupe</b-link></li>
            <li v-if="isAdmin()" class="nav-item"><b-link class="nav-link" to="/Evenement">Gestion des événements</b-link></li>
            <li v-if="isAdmin()" class="nav-item"><b-link class="nav-link" to="/Planning">Gestion des plannings</b-link></li>
            <li v-if="isAdmin()" class="nav-item"><b-link class="nav-link" to="/Tuteur">Gesion des tuteus</b-link></li>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->
              <template #button-content>
                <em> <b-icon icon="person-fill"></b-icon></em>
              </template>
              <li v-if="!isUser()" role="presentation"><b-link role="menuitem" class="dropdown-item" to="/Connexion">Connexion</b-link></li> <!-- Lien vers une page sous l'icône du profile -->
              <li v-if="!isUser() || isAdmin()" role="presentation"><b-link role="menuitem" class="dropdown-item" to="/Etudiant/Création_compte">Créer un compte</b-link></li> <!-- Lien vers une page sous l'icône du profile -->
              <li v-if="isUser()" role="presentation"><b-link role="menuitem" class="dropdown-item" to="/Etudiant/Compte">Mon compte</b-link></li> <!-- Lien vers une page sous l'icône du profile -->
              <b-dropdown-item v-if="isUser()" @click="Deconnexion" href="#">Deconnexion</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>  
</template>

<script>
import { mapGetters } from 'vuex'

export default {
   methods:{
       ...mapGetters(['isUser','isAdmin']),
       Deconnexion(){
           sessionStorage.removeItem('token');
           this.$store.dispatch('deconnexion');
       }
   }
}
</script>


<style lang="scss">
    .dropdown-menu{
    background-color: #17a2b8 !important;
    }

    .dropdown-item:hover, .dropdown-item:focus {
    background-color: transparent !important;
    }
    #nav {
    a {
        font-weight: bold;
        color: white;

        &.router-link-exact-active {   // couleur du lien activé (qui pointe sur la page actuel)
        color:black;
        }
    }
    }
</style>