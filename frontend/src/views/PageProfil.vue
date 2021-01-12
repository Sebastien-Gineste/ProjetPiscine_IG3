<template>
  <div id="contenant">
    <span v-if="showMsg" id="valid"> Profil modifié avec succès </span>
    <b-list-group>
      <b-list-group-item id="Profil"> 
      Profil <b-avatar class="mr-3" id="ProfilePic"></b-avatar>
      </b-list-group-item>

      <b-list-group-item>
      Nom : <b-link  v-if="show" href=""> {{ nom }} </b-link> <input v-if="!show" v-model="nom">
      </b-list-group-item>

      <b-list-group-item>
      Prenom : <b-link v-if="show" href=""> {{ prenom }} </b-link> <input v-if="!show" v-model="prenom">
      </b-list-group-item>

      <b-list-group-item>
      NumEtudiant : <b-link v-if="show" href=""> {{ numEtudiant }} </b-link> <input v-if="!show" v-model="numEtudiant"> 
      </b-list-group-item>

      <b-list-group-item>
      Mail : <b-link v-if="show" href=""> {{ mail }} </b-link> <input v-if="!show" v-model="mail"> 
      </b-list-group-item>

      <b-list-group-item>
      Mot de passe : <b-link v-if="show" href=""> {{ mdpasse }} </b-link> <input v-if="!show" v-model="mdpasse"> 
      </b-list-group-item>

      <b-list-group-item>
      Promo : <b-link v-if="show" href=""> {{ promo }} </b-link> <input v-if="!show" v-model="promo">
      </b-list-group-item>

      <b-button id="BoutonModif" v-if="show" v-on:click="show = false;showMsg = false">Modifier</b-button>
      <b-button id="BoutonModif" v-if="!show" v-on:click="show = true;showMsg = true">Valider</b-button>
    </b-list-group>
    
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axio from "axios";
const axios = axio.create({
  withCredentials: true
})
  export default {
      data() {
        return {
            numEtudiant: 'Test1212',
            nom: 'Test',
            prenom : 'Test',
            mail: 'Test@Test.com',
            mdpasse: 'Test',
            promo : 'Test2020',
            show: true,
            showMsg: false,
        }
      },
      methods: {
        ...mapGetters(['getId','isAdmin']),
        modifProfil() {
          axios.put(`.../api/etudiant/`+this.getId()).then((response) => {
          var etudiantCo = response.data;
          this.nom = etudiantCo.nomEtudiant
          this.prenom = etudiantCo.prenomEtudiant
          this.numEtudiant = etudiantCo.numEtudiant // ou getID vu que c'est censé etre le meme
          this.mail = etudiantCo.emailEtudiant
          this.mdpasse = etudiantCo.mdpEtudiant
          this.promo = etudiantCo.annePromo
          })
        }
      },
      beforeMount() {
        axios.get("http://localhost:3000/api/etudiant/"+this.getId()).then((response) => {
          var etudiantCo = response.data;
          this.nom = etudiantCo.nomEtudiant
          this.prenom = etudiantCo.prenomEtudiant
          this.numEtudiant = etudiantCo.numEtudiant // ou getId vu que c'est censé etre le meme
          this.mail = etudiantCo.emailEtudiant
          this.mdpasse = etudiantCo.mdpEtudiant
          this.promo = etudiantCo.annePromo
          })
          .catch((error) => {
            var msg = error.response;
            console.log(msg)
          })
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
  #BoutonModif {
    margin-top: 2%;
    margin-bottom: 2%;
    margin-left:82%;
  }
  #valid {
    color:green;
  }
</style>