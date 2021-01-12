<template>
    <div id= "nav">
      <b-navbar toggleable="lg" type="dark" variant="info">
        <div class="container">
          
          <b-navbar-brand href="#">
            <b-link to="/" class="navbar-brand router-link-active" target="_self"><img src="https://www.polytech.umontpellier.fr/images/logo_entete.png" alt="Kitten"></b-link>
          </b-navbar-brand>
        <!-- <b-navbar-brand href="#"><b-img :src="require('./assets/polytech.png')" fluid alt="Responsive image"></b-img></b-navbar-brand> -->
          <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

          <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
              <li v-if="isUser() && !isAdmin()" class="nav-item"><b-link class="nav-link" :to="'/Evenement/'+getIdEvent()+'/Planning'"><b-icon icon="calendar-event"></b-icon>S'inscrire à une soutance</b-link></li>
              <li v-if="isUser() && !isAdmin()" class="nav-item"><b-link class="nav-link" to="/Groupe"><b-icon icon="people-fill"></b-icon>Gestion de groupe</b-link></li>
              <li v-if="isAdmin()" class="nav-item"><b-link class="nav-link" to="/Evenement"><b-icon icon="calendar-event"></b-icon>Gestion des événements</b-link></li>
              <li v-if="isAdmin()" class="nav-item"><b-link class="nav-link" to="/Tuteur"><b-icon icon="people-fill"></b-icon>Gestion des tuteurs</b-link></li>
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
        </div>
      </b-navbar>
    </div>  
</template>

<script>
import { mapGetters } from 'vuex'
import axio from "axios";
const axios = axio.create({
  withCredentials: true
})

export default {
   methods:{
       ...mapGetters(['isUser','isAdmin','getIdEvent']),
       Deconnexion(){
          axios.post("http://localhost:3000/api/Etudiant/Deconnexion")
          /*sessionStorage.removeItem('token');*/
          this.$store.dispatch('deconnexion');
          if(this.$router.history.current.name !== "Home"){
              this.$router.push("/")
          }
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

    .dropdown-menu{
      border-radius: 29px;
      border: solid 0.5px #00BCD4;
    }

    img{
      background: aliceblue;
      padding: 1px;
      border-radius: 22px;
    }
    .b-icon.bi{
      margin-right: 6px;
    }

    a {
        font-weight: bold;
        color: white;
        font-size: 18px;
        transition: 0.35s ease;

        &.router-link-exact-active:not(.navbar-brand):not(.dropdown-item) {   // couleur du lien activé (qui pointe sur la page actuel)
          border-bottom: solid 2px white;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
        }

        &.router-link-exact-active.dropdown-item{
          text-decoration: underline;
        }

        &:hover{
          color : black;
        }
    }
  }
</style>