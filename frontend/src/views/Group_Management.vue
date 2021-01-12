<template>
    <div id="Group_panel">  
        <b-alert v-if="!hasGroup()" variant="warning" show>Vous n'avez pas encore de groupe ! </b-alert>
        <h1 id="title_group" v-if="hasGroup()" >Modification de votre groupe</h1>
        <h1 id="title_group" v-else>Création d'un nouveau groupe</h1>

        <b-form id="formGroup" @submit="onSubmit">            
            
            <!-- Tuteur: Nom + Prénom + Entreprise --> 
            <b-row class="my-1">
                <b-col sm="6">  
                    <b-form-group id="input-group-1"  label="Nom du tuteur entreprise:"  label-for="nomTuteur">
                        <b-form-input :readonly="hasGroup() && !showModif"   id="nomTuteur" v-model="form.nomTuteur" type="text" required  placeholder="Nom du tuteur">
                        </b-form-input>
                    </b-form-group>
                </b-col>
                <b-col sm="6">  
                    <b-form-group id="input-group-2" label="Prénom du tuteur entreprise:" label-for="prenomTuteur">
                        <b-form-input :readonly="hasGroup() && !showModif"  id="prenomTuteur" v-model="form.prenomTuteur"  type="text"  required  placeholder="Prénom du tuteur"
                        ></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col sm="6">  
                    <b-form-group   id="input-group-3"  label="Entreprise du tuteur:"   label-for="entrepriseTuteur">
                        <b-form-input  :readonly="hasGroup() && !showModif"   id="entrepriseTuteur"  v-model="form.entrepriseTuteur" type="text" required  placeholder="Entreprise du tuteur"
                        ></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col sm="6">  
                   <b-form-group id="input-prof-group2" label="Tuteur du projet" label-for="input-profs-group">
                            <b-form-select id="input-profs-group" v-model="form.idProf" required :options="profs">
                                <template #first>
                                    <b-form-select-option :value="null" disabled>Sélectionner un prof</b-form-select-option>
                                </template>
                            </b-form-select>
                    </b-form-group> 
                </b-col>
            </b-row> 
  
             <!-- Liste d'élèves -->
             <div v-if="hasGroup()" id="liste">
                 <h3>Liste étudiants du groupe </h3>
                <b-row class="my-1">
                     <b-col sm="2"></b-col>
                    <b-col sm="6">
                        <b-form-select id="input-etud-group" v-model="currentEtud" required :options="etudiants">
                            <template #first>
                                <b-form-select-option :value="null" disabled>Sélectionner un étudiant</b-form-select-option>
                            </template>
                        </b-form-select>
                    </b-col>
                    <b-col sm="3">
                        <b-button id="ajouter" type="button" @click="ajouterEleve()"> Ajouter </b-button>
                    </b-col>
                </b-row> 
                <b-list-group>
                   <b-list-group-item v-for="(membre, id) in listMembers" :key="id">
                       Etudiant n'{{id+1}} :  {{ membre.text }} <b-button v-if="membre.value != getId()"  type="button" @click="deleteEleve(id)"> Supprimer </b-button>
                    </b-list-group-item>
                </b-list-group>
            </div>
            

            <b-button v-if="!hasGroup()" id="submit" type="submit" @submit="createGroup()" variant="primary">Créer</b-button>
            <b-button v-if="hasGroup() && !showModif" id="modif" @click="showModif = !showModif" type="button" variant="primary">Modifier le groupe</b-button>
            <b-button v-if="hasGroup() && showModif" id="annuler" @click="showModif = !showModif" type="button" variant="primary">Annuler</b-button>
            <b-button v-if="showModif && hasGroup()" id="modif" @click="updateGroup()" type="button" variant="primary">Valider</b-button>
            <b-button v-if="hasGroup()" id="Supprimer" @click="deleteGroup()" type="button" variant="primary">Supprimer le groupe</b-button>
            <!-- La fonction createGroup() amène sur la page /Modification afin que l'élève puisse ajouter des membres -->
            <div v-if="messageError.length > 0">{{messageError}}</div>

        </b-form>
    </div>
</template>


<script>
import { mapGetters } from 'vuex'
import axio from "axios";
const axios = axio.create({ withCredentials: true })

export default {
data() {
return {
data : null,
error : "",
messageError : "",
currentGroupe : null,
currentEtud : null,
form: {
    nomTuteur: '',
    prenomTuteur: '',
    entrepriseTuteur: '',
    idProf: null,
    },
listMembers: [],
etudiants: [],
profs : [],
showModif : false,
}
},

computed: {
readonly() {
    return (this.isCreate ? false : !this.showModif )
},
isCreate(){
    return this.$route.params.id === undefined
},
},

methods:{
onSubmit(event) {
    event.preventDefault()
    alert("onSubmit")
    console.log(this.form)
    axios.post(`http://localhost:3000/api/Groupe`,this.form).then((response) => {
        this.$store.dispatch('ajoutGroup',response.data);
        this.currentGroupe = this.form
        this.listMembers = [{value : this.getId(), text : "vous" }]
    })
    .catch((error)=>{
        console.log(error.response)
    });
},
updateGroup(){
    console.log(this.form)
    axios.put(`http://localhost:3000/api/Groupe/`+this.getGroup(),this.form).then((response) => {
        console.log(response.data)
        this.showModif = false
    })
    .catch((error)=>{
        console.log(error.response)
    });
},
deleteGroup(){
    axios.delete("http://localhost:3000/api/Groupe/"+this.getGroup()).then((response)=> { 
        console.log(response.data)
        this.$store.dispatch('ajoutGroup',-1);
        this.form =   {
            nomTuteur: '',
            prenomTuteur: '',
            entrepriseTuteur: '',
            idProf: null,
        }
        this.listMembers = []
        this.currentGroupe = null
    })
    .catch((error)=>{
        console.log(error)
    })
},
ajouterEleve(){
    var present = false
    for(let i =0;i<this.listMembers.length;i++){
        if(this.listMembers[i].value == this.currentEtud){present = true}
    }
    if(!present){
        axios.post("http://localhost:3000/api/Groupe/"+this.getGroup()+"/addEtudiant",{idEtudiant : this.currentEtud}).then((response)=> {
        console.log(response.data)
        var i = 0
        while(i<this.etudiants.length && this.etudiants[i].value != this.currentEtud){
            i++
        }
        this.listMembers.push(this.etudiants[i])
        this.currentEtud = null
        })
        .catch((error)=>{
            console.log(error)
            alert("étudiant déjà présent !")
        })
    }
    else{
        alert("étudiant déjà présent !")
    }
},
deleteEleve(id){ // pour supprimer un élève
    console.log(id)
    console.log( this.listMembers[id])
    axios.delete("http://localhost:3000/api/Groupe/"+this.getGroup()+"/removeEtudiant/",{ data: { idEtudiant : this.listMembers[id].value}}).then((response)=> {
        console.log(response.data)
        this.listMembers.splice(id,1)
    })
    .catch((error)=>{
        console.log(error)
    })
},
...mapGetters(['hasGroup','getGroup','getId']),
},

    beforeMount(){ // récupère les infos d'un groupe si on est sur la page création groupe 
        if(this.hasGroup()){
            axios.get(`http://localhost:3000/api/Groupe/`+this.getGroup()).then((response) => {
                console.log(response)

                this.form.idGroupe = response.data.idGroupe
                this.form.nomTuteur = response.data.nomTuteurEntreprise
                this.form.prenomTuteur = response.data.prenomTuteurEntreprise
                this.form.entrepriseTuteur = response.data.nomEntreprise
                this.form.idProf = response.data.idProf

                this.currentGroupe = this.form
                if(response.data.listMembers){
                    for(let i=0;i<response.data.listMembers.length;i++){
                        this.listMembers.push({value : response.data.listMembers[i].numEtudiant , text : response.data.listMembers[i].nomEtudiant+" "+response.data.listMembers[i].prenomEtudiant})
                    }
                }
                
            })
            .catch((error) => { 
                console.log(error);
                this.$router.push("/404"); // redirection 404
            });
        }
        // récupère la promo 
        axios.get('http://localhost:3000/api/Etudiant/Promo/'+this.getId()).then((data) => {
            console.log(data.data)
            if(data.data){
                for(let i=0;i<data.data.length;i++){
                    this.etudiants.push({value : data.data[i].numEtudiant , text : data.data[i].nomEtudiant+" "+data.data[i].prenomEtudiant})
                }
            }
        })
        .catch((error)=>{
            console.log(error.response)
        });

       // récupère les profs
        axios.get(`http://localhost:3000/api/Prof/`).then((response) => {
            var profs = response.data;
            for(let i=0;i<profs.length;i++){
                this.profs.push({value : profs[i].idProf , text : profs[i].nomProf+" "+profs[i].prenomProf})
            }
        })
        .catch((error)=> { // pas trouvé 
            if(error.response.status == '403'){ // pas autorisé 
                console.log(error.response.data)
            }
        });
    
    }
}

</script>



<style lang="scss">
 #Group_panel{
     margin-top: 5%;
 }
 #formGroup{
     width: 70%;
     margin-left: 15%;
     padding: 20px;
     background: lightcyan;
 }
 #Annuler{
     margin-left: 5%;
 }
 #title_group{
     margin-bottom: 3%;
 }
 #liste{
     background: lightblue;
    padding: 5px;
    margin-bottom : 2%
 }
 .list-group{
     width : 50%;
     margin-left : 25%;
     margin-top:2%;
     margin-bottom:2%;
 }
 #modif,#annuler{
     margin-right:2%; 
 }


</style>
