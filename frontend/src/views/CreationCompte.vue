<template>
  <div id="contenant">
<<<<<<< HEAD
    <b-list-group>
      <span v-if="showMsg" id="NonRemplis"> Veuillez remplir tout les champs </span>
      <b-list-group-item id="Profil">Création de compte <b-avatar class="mr-3" id="ProfilePic"></b-avatar></b-list-group-item>
      <b-list-group-item>Nom : <input v-model="form.nomEtudiant"> </b-list-group-item>
      <b-list-group-item>Prenom : <input v-model="form.prenomEtudiant"> </b-list-group-item>
      <b-list-group-item>Numéro Etudiant : <input v-model="form.numEtudiant"> </b-list-group-item>
      <b-list-group-item>Mail : <input v-model="form.emailEtudiant"> </b-list-group-item>
      <b-list-group-item>Mot de passe : <input v-model="form.mdpEtudiant"> </b-list-group-item>
      <b-list-group-item>Promo : 
      <b-form-select id="Promo" v-model="form.annePromo" required :options="promos">
      <template #first>
      <b-form-select-option :value="null" disabled>Sélectionner une promo</b-form-select-option>
      </template>
      </b-form-select>
      </b-list-group-item>
      <b-button id="BoutonCreate" v-on:click="create">Créer compte</b-button>
=======
    <h1 id="Profil">Création de compte <b-avatar class="mr-3" id="ProfilePic"></b-avatar></h1>

    <b-list-group id="listCont">
      <b-list-group-item class="listItem">Nom : <input v-model="nom"> </b-list-group-item>
      <b-list-group-item class="listItem">Prénom : <input v-model="prenom"> </b-list-group-item>
      <b-list-group-item class="listItem">Numéro étudiant : <input v-model="numEtudiant"> </b-list-group-item>
      <b-list-group-item class="listItem">Mail : <input v-model="mail"> </b-list-group-item>
      <b-list-group-item class="listItem">Mot de passe : <input v-model="mdpasse"> </b-list-group-item>
      <b-list-group-item class="listItem">Année de promo : <input v-model="promo"> </b-list-group-item>

      <b-button variant="primary" type="button" id="BoutonCreate" @click="PageAccueil">Créer compte</b-button>
>>>>>>> 504bf91d39edbc477ace2c1a7209967f73d2c128
    </b-list-group>
    
  </div>
</template>

<script>
import axio from "axios";
const axios = axio.create({
  withCredentials: true
}) 
<<<<<<< HEAD
  export default {
      data() {
        return {
            form: {
              nomEtudiant: '',
              prenomEtudiant : '',
              numEtudiant: '',
              emailEtudiant: '',
              mdpEtudiant: '',
              annePromo : null,
            },
            promos : [],
            show: true,
            showMsg: false,
            error: false,
            messageError : "",
            
        }
      },
      methods: {
        create() {
            this.showMsg = false
            if ((this.form.numEtudiant.length > 0) && (this.form.nomEtudiant.length > 0) && (this.form.prenomEtudiant.length > 0) && (this.form.emailEtudiant.length > 0) && (this.form.mdpEtudiant.length > 0) && (this.form.annePromo != null)){
              axios.post('http://localhost:3000/api/etudiant/', this.form)
              .then((response) => {
                  console.log(response);
                  this.PageAccueil();
              }, (error) => {
                  console.log(error);
              });
            }
            else {
              this.showMsg = true
            }
        },
        PageAccueil() {
          this.$router.push("/");
        },
      },
      beforeMount() {
        // récupère promo
        axios.get(`http://localhost:3000/api/Promo/`).then((response) => {
            this.promos = [];
            var actuYear = new Date().getFullYear()
            var month = new Date().getMonth() + 1
            var text = "IG"
            var idClass = ((month >= 9)? 6 : 5 ) // permet de déduire les classes avec les années de promo 
            for (let i = 0; i < response.data.length; i++) {
                this.promos.push({value: response.data[i].annePromo, text : text+(idClass-(response.data[i].annePromo - actuYear)), disabled : this.readonly})
            }
        })
        .catch((error) => { 
            console.log(error);
            this.show = false;
            this.error = "Erreur : Impossible de récuperer les promos";
            //this.$router.push("/");
        });
      }
=======
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
>>>>>>> 504bf91d39edbc477ace2c1a7209967f73d2c128
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
  #NonRemplis {
    color:red;
  }
</style>