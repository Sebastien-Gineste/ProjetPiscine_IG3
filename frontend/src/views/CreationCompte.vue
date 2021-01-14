<template>
  <div id="contenant">
    <b-form @submit="create">
      <div>
        <h1>Création de compte <b-avatar class="mr-3" id="ProfilePic"></b-avatar></h1>
        <span v-if="showMsg" id="NonRemplis"> Veuillez remplir tous les champs </span>
        <b-row class="my-1">
              <b-col sm="6">  
                  <b-form-group id="input-group-1" label="Nom :" label-for="nomEtud">
                      <b-form-input id="nomEtud"  v-model="form.nomEtudiant" type="text" required placeholder="Votre nom..."
                      ></b-form-input>
                  </b-form-group>
              </b-col>
              <b-col sm="6">  
                <b-form-group id="input-group-2" label="Prénom :" label-for="prenomEtud">
                    <b-form-input id="prenomEtud"  v-model="form.prenomEtudiant" type="text" required placeholder="Votre prénom..."
                    ></b-form-input>
                </b-form-group>
            </b-col>
        </b-row> 
         <b-row class="my-1">
              <b-col sm="6">  
                  <b-form-group id="input-group-3" label="Numéro Etudiant :" label-for="numeroEtud">
                      <b-form-input id="numeroEtud"  v-model="form.numEtudiant" type="number" required
                      ></b-form-input>
                  </b-form-group>
              </b-col>
              <b-col sm="6">  
                <b-form-group id="input-group-4" label="Promo :" label-for="Promo">
                     <b-form-select id="Promo" v-model="form.annePromo" required :options="promos">
                        <template #first>
                          <b-form-select-option :value="null" disabled>Sélectionner une promo</b-form-select-option>
                        </template>
                      </b-form-select>
                </b-form-group>
            </b-col>
        </b-row> 
        <b-row class="my-1">
            <b-col sm="6">  
                  <b-form-group id="input-group-5" label="Mail :" label-for="mailEtud">
                      <b-form-input id="mailEtud"  v-model="form.emailEtudiant" type="email" required placeholder="nom.prenom@etu.umontpellier.fr"
                      ></b-form-input>
                  </b-form-group>
            </b-col>
            <b-col sm="6">  
                <b-form-group id="input-group-6" label="Mot de passe :" label-for="mdrEtud">
                    <b-form-input id="mdrEtud"  v-model="form.mdpEtudiant" type="password" required
                    ></b-form-input>
                </b-form-group>
            </b-col>
        </b-row> 
        <b-button id="BoutonCreate" variant="primary" type="submit">Créer compte</b-button>
      </div>
    </b-form>
  </div>
</template>

<script>
import axio from "axios";
const axios = axio.create({
  withCredentials: true
}) 
  export default {
      // Variables
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
            emailContain: "@etu.umontpellier.fr",
        }
      },
      methods: {
        create(e) {
            e.preventDefault()
            this.showMsg = false
            if (this.form.emailEtudiant.includes(this.emailContain)) {
              if ((this.form.numEtudiant.length > 0) && (this.form.nomEtudiant.length > 0) && (this.form.prenomEtudiant.length > 0) && (this.form.emailEtudiant.length > 0) && (this.form.mdpEtudiant.length > 0) && (this.form.annePromo != null)){
                axios.post('http://localhost:3000/api/Etudiant/', this.form)
                .then((response) => {
                    console.log(response);
                    alert("Compte créé avec succès !");
                    this.PageAccueil();
                }, (error) => {
                    alert("Erreur, compte non créé.")
                    console.log(error.response);
                });
              }
              else {
                this.showMsg = true
              }
            }
            else {
              alert("Veuillez entrer une adresse email valide (prenom.nom@etu.umontpellier.fr)")
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
    margin-left: 10%;
    margin-right:10%;
    margin-top:5%;

    h1{
      margin-bottom : 3%;
    }
  }
  #ProfilePic {
    margin-left:3%;
  }
  #Profil {
    margin-bottom: 3%;
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