<template>
  <div id="contenant">
    
    <h1 id="Profil"> Profil <b-avatar class="mr-3" id="ProfilePic"></b-avatar></h1>

    <b-list-group id="listCont">

      <b-list-group-item class="listItem">
      Nom : <b-link  v-if="show" href=""> {{ form.nom }} </b-link> <input v-if="!show" v-model="form.nom">
      </b-list-group-item>

      <b-list-group-item class="listItem">
      Prénom : <b-link v-if="show" href=""> {{ form.prenom }} </b-link> <input v-if="!show" v-model="form.prenom">
      </b-list-group-item>

      <b-list-group-item class="listItem">
      Numéro étudiant : <b-link v-if="show" href=""> {{ form.numEtudiant }} </b-link> <input v-if="!show" v-model="form.numEtudiant"> 
      </b-list-group-item>

      <b-list-group-item class="listItem">
      Mail : <b-link v-if="show" href=""> {{ form.mail }} </b-link> <input v-if="!show" v-model="form.mail"> 
      </b-list-group-item>
      <!--
      <b-list-group-item class="listItem">
      Mot de passe : <b-link v-if="show" href=""> {{ form.mdpasse }} </b-link> <input v-if="!show" v-model="form.mdpasse"> 
      </b-list-group-item>
      -->
      <b-list-group-item class="listItem">
      Année de promo : <b-link v-if="show" href=""> {{ form.promo }} </b-link> <input v-if="!show" v-model="form.promo">
      </b-list-group-item>

      <b-button id="BoutonModif" type="button" variant="primary" v-if="show" v-on:click="show = false;showMsg = false">Modifier</b-button>
      <b-button id="BoutonModif" type="button" variant="primary" v-if="!show" v-on:click="show = true;showMsg = true;pop();updateProfil()">Valider</b-button>
    </b-list-group>
    
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import util from "../service/fonctionUtil"
import axio from "axios";
const axios = axio.create({
  withCredentials: true
})
  export default {
      data() {
        return {
          form: {
            numEtudiant: 'Test1212',
            nom: 'Test',
            prenom : 'Test',
            mail: 'Test@Test.com',
            // mdpasse: 'Test',
            promo : 'Test2020',
          }, 
          show: true,
          showMsg: false,
        }
      },
      methods: {
        ...mapGetters(['getId','isAdmin']),
        modifProfil() {
          axios.put(`.../api/etudiant/`+this.getId()).then((response) => {
          var etudiantCo = response.data;
          this.form.nom = etudiantCo.nomEtudiant
          this.form.prenom = etudiantCo.prenomEtudiant
          this.form.numEtudiant = etudiantCo.numEtudiant // ou getID vu que c'est censé etre le meme
          this.form.mail = etudiantCo.emailEtudiant
          // this.form.mdpasse = etudiantCo.mdpEtudiant
          this.form.promo = etudiantCo.annePromo
          })
        },
        pop(){
          util.makeToast(this,"success","Modification","Profil modifié avec succès !")
        },
        updateProfil(){
          axios.put(`http://localhost:3000/api/Etudiant/`+this.form.numEtudiant,this.form).then((response) => {
          console.log(response.data)
          })
          .catch((error)=>{
              console.log(error.response)
          });
        }
      },
      beforeMount() {
        axios.get("http://localhost:3000/api/etudiant/"+this.getId()).then((response) => {
          var etudiantCo = response.data;
          this.form.nom = etudiantCo.nomEtudiant
          this.form.prenom = etudiantCo.prenomEtudiant
          this.form.numEtudiant = etudiantCo.numEtudiant // ou getId vu que c'est censé etre le meme
          this.form.mail = etudiantCo.emailEtudiant
          // this.form.mdpasse = etudiantCo.mdpEtudiant
          this.form.promo = etudiantCo.annePromo
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
    margin-bottom: 3%;
  }
  #BoutonModif {
    margin-top: 4%;
    width: 30%;    
    margin-left: 35%;
  }
  #valid {
    color:green;
  }
  #listCont {
    padding: 20px;
    margin-bottom : 2%
  }
  .listItem {
    background: lightcyan;
  }
</style>