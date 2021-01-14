<template>
  <div id="contenant">
    
    <h1 id="Profil"> Profil <b-avatar class="mr-3" id="ProfilePic"></b-avatar></h1>

    <b-list-group id="listCont">

      <b-list-group-item class="listItem">
      Nom : <b-link  v-if="show" href=""> {{ form.nom }} </b-link> 
            <b-form-input  v-else id="nomEtud"  v-model="form.nom" type="text" required placeholder="Votre nom..." ></b-form-input>
      </b-list-group-item>

      <b-list-group-item class="listItem">
      Prénom : <b-link v-if="show" href=""> {{ form.prenom }} </b-link> 
      <b-form-input  v-else id="prenomEtud"  v-model="form.prenom" type="text" required placeholder="Votre prenom..." ></b-form-input>
      </b-list-group-item>

      <b-list-group-item class="listItem">
      Numéro étudiant : <b-link v-if="show" href=""> {{ form.numEtudiant }} </b-link> 
      <b-form-input  v-else id="numEtud"  v-model="form.numEtudiant" type="number" required ></b-form-input>    
      </b-list-group-item>

      <b-list-group-item class="listItem">
      Mail : <b-link v-if="show" href=""> {{ form.mail }} </b-link> 
      <b-form-input  v-else id="numEtud"  v-model="form.mail" type="email" required placeholder="nom.prenom@etu.umontpellier.fr" ></b-form-input>    
      </b-list-group-item>
  
      <b-list-group-item class="listItem">
      Année de promo : <b-link v-if="show" href=""> {{ form.promo }} </b-link>
        <b-form-select v-else id="Promo" v-model="form.promo" required :options="promos">
              <template #first>
                <b-form-select-option :value="null" disabled>Sélectionner une promo</b-form-select-option>
              </template>
        </b-form-select>
      </b-list-group-item>    
     <b-row class="my-1">
          <b-col v-if="show"  sm="4">  
              <b-button  type="button" variant="primary" v-on:click="supprCompte()">Supprimer le compte</b-button>
          </b-col>
            <b-col v-else sm="6">  
              <b-button type="button" variant="primary" v-on:click="show = true;showMsg = true;">Annuler</b-button>
          </b-col>
          <b-col v-if="show" sm="4">  
              <b-button type="button" variant="primary" v-on:click="show = false;showMsg = false">Modifier</b-button>
          </b-col>
           <b-col v-else sm="6">  
              <b-button type="button" variant="primary" v-on:click="show = true;showMsg = true;updateProfil()">Valider</b-button>
          </b-col>
          <b-col v-if="show" sm="4">  
              <b-button type="button" variant="primary" v-if="show" @click="toMdp">Modifier le mot de passe</b-button>
          </b-col>
        
      </b-row>
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
          form: {
            numEtudiant: 'Test1212',
            nom: 'Test',
            prenom : 'Test',
            mail: 'Test@Test.com',
            promo : 'Test2020',
          }, 
          promos : [],
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
          alert("Profil modifié avec succès !")
        },
        popDelete(){
          alert("Profil supprimé avec succès !")
        },
        updateProfil(){
          axios.put(`http://localhost:3000/api/Etudiant/`+this.form.numEtudiant,this.form).then((response) => {
          console.log(response.data)
          this.pop();
          })
          .catch((error)=>{
              console.log(error.response)
          });
        },
        supprCompte(){
          axios.delete(`http://localhost:3000/api/Etudiant/`+this.form.numEtudiant).then((response) => {
          console.log(response.data)
          axios.post("http://localhost:3000/api/Etudiant/Deconnexion")
          this.$store.dispatch("deconnexion")
          this.popDelete();
          this.PageAccueil();
          })
          .catch((error) => {
            console.log(error.response)
          });
        },
        PageAccueil() {
          this.$router.push("/");
        },
        toMdp(){
          this.$router.push('/RecupPassword')
        },
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
          });

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
  }
  #ProfilePic {
    margin-left:3%;
  }
  #Profil {
    margin-bottom: 3%;
  }
  #BoutonModif {
    display:inline-block;
    margin-top: 4%;
    margin-left: 15%;
  }
  #BoutonModifMDP {
    display:inline-block;
    margin-top: 4%; 
    margin-left: 15%;
  }
  #BoutonSuppr {
    display:inline-block;
    margin-top: 4%;   
    margin-right: 15%;
  }
  #AlignButtons {
    text-align:center;
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