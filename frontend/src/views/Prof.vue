<template>
  <div class="Prof" id="ajoutprof">
    <h1 id="Titreprof"> Gestion des tuteurs </h1>
  <b-form @submit="saveProf">
    <b-row >
      <b-col sm="5">
        <b-form-group id="input-nom-prof" label="Nom :" label-for="nomProf">
            <b-form-input  id="nomProf" v-model="form.nomProf"  type="text"  required  placeholder="Nom du tuteur"
            ></b-form-input>
        </b-form-group>
      </b-col>
      <b-col sm="5">
        <b-form-group id="input-prenom-prof" label="Prenom:" label-for="prenomProf">
            <b-form-input  id="prenomProf" v-model="form.prenomProf"  type="text"  required  placeholder="Prénom du tuteur"
            ></b-form-input>
        </b-form-group>
      </b-col>
      <b-col sm="2">
        <b-form-group id="input-nom-prof" label="Ajouter" label-for="button">
            <b-button type="submit" variant="primary">Ajouter un tuteur</b-button>
        </b-form-group>
      </b-col>
    </b-row>
  </b-form>
   <b-row v-if="bdProfs.length > 0">
    <b-col sm="4" md="5" class="my-1">
      <b-form-group label="Par page"  label-for="per-page-select" label-cols-sm="6"  label-cols-md="4"  label-cols-lg="3"  label-align-sm="right" label-size="sm" class="mb-0" >
        <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions"  size="sm"></b-form-select>
      </b-form-group>
    </b-col>
    <b-col  sm="6" class="my-1">
      <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="fill" size="sm"  class="my-0"></b-pagination>
    </b-col>
  </b-row>
  <b-table v-if="bdProfs.length > 0" striped hover :items="bdProfs" :fields="fields" :current-page="currentPage" :per-page="perPage" >
    <template #cell(delete)="data">
      <b-button variant="danger" type="button" @click="deleteProf(data.item.idProf)"> Supprimer </b-button>
    </template>
    <template #cell(update)="data"> 
      <b-button variant="warning" type="button" @click="show=true;update.idProf=data.item.idProf;update.nomProf=data.item.nomProf;update.prenomProf=data.item.prenomProf"> Modifier </b-button>
    </template>
  </b-table>
  <div>
    <transition name="slide-fade">
        <div @click="removePanel()" id="fond" v-if="show"></div>
    </transition>
    <transition name="slide-fade">
      <div id="panelModifProf" v-if="show">
          <h3>Modification Prof {{update.idProf}}</h3>
          <b-row>
            <b-col sm="6">
              <b-form-group id="input-nom-prof-update" label="Nom :" label-for="nomProf">
                <b-form-input  id="nomProfupdate" v-model="update.nomProf"  type="text"  required  placeholder="Nom du tuteur"></b-form-input>
              </b-form-group>
            </b-col>
              <b-col sm="6">
              <b-form-group id="input-prenom-prof-update" label="Prenom:" label-for="prenomProf">
                  <b-form-input  id="prenomProfupdate" v-model="update.prenomProf"  type="text"  required  placeholder="Prénom du tuteur" ></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-button id="enregister" @click="updateProf()" type="button" variant="primary">Modifier</b-button>
        </div>
    </transition>
  </div>
  </div>

</template>
<script>
import axio from "axios";
const axios = axio.create({
  withCredentials: true
})

export default { 
  data(){
    return {
      show:false,
      currentPage : 1,
      totalRows : 1,
      perPage : 5,
      pageOptions : [5, 10, 15, { value: 100, text: "Beaucoup" }],
      update:{
        idProf:null,
        nomProf:null,
        prenomProf:null
      },
      form:{
        nomProf:null,
        prenomProf:null
      },
      bdProfs:[],
      fields : [{ key: 'idProf',sortable: true},{ key: 'nomProf',sortable: true},{ key: 'prenomProf',sortable: true},{key: 'update' , label:"Modifier"},{key : 'delete' ,label : "Supprimer" }]
    }
  },
  methods:{
    removePanel(){
                this.show = false // enlève le panel
                this.update.idProf=null
                this.update.nomProf=null
                this.update.prenomProf=null
        },
    saveProf(e){
      e.preventDefault();
      console.log(this.form)
      axios.post(`https://projetpiscine.herokuapp.com/api/Prof/`,this.form).then((response) => {
            var profs = response.data;
            console.log(response.data)
            this.bdProfs.push({idProf : profs.idProf , nomProf : this.form.nomProf , prenomProf : this.form.prenomProf})
            this.totalRows++
            this.form.nomProf = null
            this.form.prenomProf = null
        })
        .catch((error)=> { // pas trouvé 
            console.log(error.response)
            if(error.response.status == '403'){ // pas autorisé 
                this.errorMessage = error.response.data
            }
        })
    },
    deleteProf(idProf){
    axios.delete("https://projetpiscine.herokuapp.com/api/Prof/"+idProf).then((response)=> { 
        console.log(response.data)
        var i=0
        var id=-1
        while(i<this.bdProfs.length){
          if(this.bdProfs[i].idProf==idProf){
            id=i
          }
          i++
        }
        if(id < this.bdProfs.length){
          this.bdProfs.splice(id,1)
          this.totalRows--
        }
        else{
          alert("il y a eu un prolbème")
        }
    })
    .catch((error)=>{
        console.log(error)
    })
},
    updateProf(){

      console.log(this.update)
      axios.put(`https://projetpiscine.herokuapp.com/api/Prof/`+this.update.idProf,this.update).then((response) => {
        console.log(response.data)
        var i=0
        var id=-1
        while(i<this.bdProfs.length){
          if(this.bdProfs[i].idProf==this.update.idProf){
            id=i
          }
          i++
        }
        console.log(id)
        this.bdProfs[id].prenomProf=this.update.prenomProf
        this.bdProfs[id].nomProf=this.update.nomProf
        this.show = false
        this.update.idProf = null
        this.update.nomProf = null
        this.update.prenomProf = null
    })
    .catch((error)=>{
        console.log(error)
    });
    }
  },
  beforeMount(){
        axios.get(`https://projetpiscine.herokuapp.com/api/Prof/`).then((response) => {
            this.bdProfs = response.data
            this.totalRows = this.bdProfs.length
        })
        .catch((error)=> { // pas trouvé
            console.log(error) 
            console.log(error.response)
            if(error.response.status == '403'){ // pas autorisé 
                this.errorMessage = error.response.data
            }
        })}}
</script>
<style lang="scss">
#ajoutprof{
    margin-top: 5%;
    background: lightcyan;
    margin-left: 10%;
    margin-right: 10%;
    margin-bottom: 3%;
    padding: 15px;
    border-radius: 23px;

    table{
      background-color: white !important;
    }

    .row{
      margin-bottom : 2%;
    }
}
#Titreprof{
    width: 80%;
    margin-left: 10%;
    padding: 20px;
}
#fond{
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: lightgrey;
    z-index :98;
    opacity: 0.7;
    left: 0px;
    top: 0px;
}
    #panelModifProf{
    top:20%;
    position: fixed;
    width: 60%;
    margin-left: 10%;
    text-align: center;
    background: lightcyan;
    z-index: 99;
    padding: 15px;
    border: solid 2px lightgrey;}
/* Les animations d'entrée (« enter ») et de sortie (« leave »)  */
/* peuvent utiliser différentes fonctions de durée et de temps.  */
.slide-fade-enter-active {
    transition: all .3s ease;
}
.slide-fade-leave-active {
    transition: all .6s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
}
</style>