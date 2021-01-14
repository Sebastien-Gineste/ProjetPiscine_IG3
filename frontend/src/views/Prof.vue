<template>
  <div class="Prof" id="ajoutprof">
    <h1 id="Titreprof"> Gestion des tuteurs </h1>
  <b-row >
    <b-col sm="6">
      <b-form-group id="input-prenom-prof" label="Prenom:" label-for="prenomProf">
                        <b-form-input  id="prenomProf" v-model="form.prenomProf"  type="text"  required  placeholder="Prénom du tuteur"
                        ></b-form-input>
      </b-form-group>
    </b-col>
    <b-col sm="6">
      <b-form-group id="input-nom-prof" label="Nom :" label-for="nomProf">
                        <b-form-input  id="nomProf" v-model="form.nomProf"  type="text"  required  placeholder="Nom du tuteur"
                        ></b-form-input>
      </b-form-group>
    </b-col>
  </b-row>
  <div>
      <b-button @click="saveProf()">Ajouter un tuteur</b-button>
  </div>
  <div>
  <b-table v-if="bdProfs.length > 0" striped hover :items="bdProfs" :fields="fields" >
          <template #cell(delete)="data">
          <b-button type="button" @click="deleteProf(data.item.idProf)"> Supprimer </b-button>
        </template>
          <template #cell(update)="data">
            
          <b-button type="button" @click="show=true;update.idProf=data.item.idProf;update.nomProf=data.item.nomProf;update.prenomProf=data.item.prenomProf"> Modifier </b-button>
        </template>
  </b-table>
  </div>
  <div>
  <transition name="slide-fade">
            <div @click="removePanel()" id="fond" v-if="show"></div>
         </transition>
        <transition name="slide-fade">
            <div id="panelModifProf" v-if="show">
                  <h3>Modification Prof {{update.idProf}}</h3>
      <b-col sm="6">
                          <b-form-group id="input-prenom-prof-update" label="Prenom:" label-for="prenomProf">
                        <b-form-input  id="prenomProfupdate" v-model="update.prenomProf"  type="text"  required  placeholder="Prénom du tuteur"
                        ></b-form-input>
      </b-form-group>
    </b-col>
    <b-col sm="6">
      <b-form-group id="input-nom-prof-update" label="Nom :" label-for="nomProf">
                        <b-form-input  id="nomProfupdate" v-model="update.nomProf"  type="text"  required  placeholder="Nom du tuteur"
                        ></b-form-input>
      </b-form-group>
      </b-col>
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
    saveProf(){
      axios.post(`http://localhost:3000/api/Prof/`,this.form).then((response) => {
            var profs = response.data;
            console.log(response.data)
            this.bdProfs.push({idProf : profs.idProf , nomProf : this.form.nomProf , prenomProf : this.form.prenomProf})
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
    axios.delete("http://localhost:3000/api/Prof/"+idProf).then((response)=> { 
        console.log(response.data)
        var i=0
        var id=-1
        while(i<this.bdProfs.length){
          if(this.bdProfs[i].idProf==idProf){
            id=i
          }
          i++
        }
        this.bdProfs.splice(id,1)
    })
    .catch((error)=>{
        console.log(error)
    })
},
    updateProf(){

      console.log(this.update)
      axios.put(`http://localhost:3000/api/Prof/`+this.update.idProf,this.update).then((response) => {
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
        axios.get(`http://localhost:3000/api/Prof/`).then((response) => {
            var profs = response.data;
            this.bdProfs = response.data
            for(let i=0;i<profs.length;i++){
                this.profs.push({value : profs[i].idProf , text : profs[i].nomProf+" "+profs[i].prenomProf})
            }
        })
        .catch((error)=> { // pas trouvé 
            console.log(error.response.data)
            if(error.response.status == '403'){ // pas autorisé 
                this.errorMessage = error.response.data
            }
        })}}
</script>
<style lang="scss">
#ajoutprof{
    margin-top: 5%;
    background: lightcyan
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
        width: 70%;
        margin-left: 15%;
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