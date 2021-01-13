<template>
  <div id="contenant">
    <h1 id="Profil">Création de compte <b-avatar class="mr-3" id="ProfilePic"></b-avatar></h1>

    <b-list-group id="listCont">
      <b-list-group-item class="listItem">Nom : <input v-model="nom"> </b-list-group-item>
      <b-list-group-item class="listItem">Prénom : <input v-model="prenom"> </b-list-group-item>
      <b-list-group-item class="listItem">Numéro étudiant : <input v-model="numEtudiant"> </b-list-group-item>
      <b-list-group-item class="listItem">Mail : <input v-model="mail"> </b-list-group-item>
      <b-list-group-item class="listItem">Mot de passe : <input v-model="mdpasse"> </b-list-group-item>
      <b-list-group-item class="listItem">Année de promo : <input v-model="promo"> </b-list-group-item>

      <b-button variant="primary" type="button" id="BoutonCreate" @click="PageAccueil">Créer compte</b-button>
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
    margin-bottom: 3%;
  }
  #BoutonCreate {
    margin-top: 4%;
    width:30%;
    margin-left: 35%
  }
  #listCont {
    padding: 20px;
    margin-bottom : 2%
  }
  .listItem {
    background: lightcyan;
  }
</style>