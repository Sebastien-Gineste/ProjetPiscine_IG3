<template>
  <div id="contenant">
    <b-list-group>
      <b-list-group-item id="Profil">Création de compte <b-avatar class="mr-3" id="ProfilePic"></b-avatar></b-list-group-item>
      <b-list-group-item>Nom : <input v-model="nom"> {{ nom }} </b-list-group-item>
      <b-list-group-item>Prenom : <input v-model="prenom"> {{ prenom }}</b-list-group-item>
      <b-list-group-item>NumEtudiant : <input v-model="numEtudiant"> {{ numEtudiant }}</b-list-group-item>
      <b-list-group-item>Mail : <input v-model="mail"> {{ mail }}</b-list-group-item>
      <b-list-group-item>Mot de passe : <input v-model="mdpasse"> {{ mdpasse }}</b-list-group-item>
      <b-list-group-item>Promo : <input v-model="promo"> {{ promo }}</b-list-group-item>
      <b-button id="BoutonCreate" v-on:click="PageAccueil">Créer compte</b-button>
    </b-list-group>
    
  </div>
</template>

<script>
import axio from "axios";
const axios = axio.create({
  withCredentials: true
}) 
  export default {
      data() {
        return {
            nom: '',
            prenom : '',
            numEtudiant: '',
            mail: '',
            mdpasse: '',
            promo : '',
            show: true,
            error: false,
            messageError : "",
        }
      },
      Methods: {
        create() {
            axios.post('.../api/etudiant/', {
                numEtudiant: this.numEtudiant,
                nomEtudiant: this.nom,
                prenomEtudiant: this.prenom,
                emailEtudiant: this.mail,
                mdpEtudiant: this.mdpasse,
                annePromo: this.promo,
                estAdmin: false,
            })
            .then((response) => {
                console.log(response);
                this.$router.push("/");
            }, (error) => {
                console.log(error);
            });
        },
        PageAccueil() {
          this.$router.push("/");
        },
      }
  }
</script>
<style lang="scss">
  #contenant {
    margin-left: 33%;
    margin-right:33%;
    margin-top:5%;
  }
  #ProfilePic {
    margin-left:3%;
  }
  #Profil {
    font-weight:bold;
  }
  #BoutonCreate {
    margin-top: 2%;
    margin-bottom: 2%;
    margin-left:70%;
  }
</style>