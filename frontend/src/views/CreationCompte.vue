<template>
  <div id="contenant">
    <b-form @submit="create">
    <b-list-group>
      <span v-if="showMsg" id="NonRemplis"> Veuillez remplir tous les champs </span>
      <b-list-group-item id="Profil">Création de compte <b-avatar class="mr-3" id="ProfilePic"></b-avatar></b-list-group-item>
      <b-list-group-item>Nom : <input v-model="form.nomEtudiant"> </b-list-group-item>
      <b-list-group-item>Prenom : <input v-model="form.prenomEtudiant"> </b-list-group-item>
      <b-list-group-item>Numéro Etudiant : <input v-model="form.numEtudiant"> </b-list-group-item>
      <b-list-group-item>Mail : <input type="email" v-model="form.emailEtudiant"> </b-list-group-item>
      <b-list-group-item>Mot de passe : <input v-model="form.mdpEtudiant"> </b-list-group-item>
      <b-list-group-item>Promo : 
      <b-form-select id="Promo" v-model="form.annePromo" required :options="promos">
      <template #first>
      <b-form-select-option :value="null" disabled>Sélectionner une promo</b-form-select-option>
      </template>
      </b-form-select>
      </b-list-group-item>  
      <b-button id="BoutonCreate" type="submit" >Créer compte</b-button>
    </b-list-group>
    </b-form>
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
              axios.post('http://localhost:3000/api/Etudiant/', this.form)
              .then((response) => {
                  console.log(response);
                  this.PageAccueil();
              }, (error) => {
                  console.log(error.response);
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