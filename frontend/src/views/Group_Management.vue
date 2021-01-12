<template>
    <div id="Group_panel">  
        <h1 id="title_group" v-if="hasGroup" >Création d'un nouveau groupe</h1>
        <h1 id="title_group" v-else>Modification de votre groupe</h1>

        <b-alert v-if="error.length > 0" variant="danger" show>{{this.error}}</b-alert>


        <b-form v-if="hasGroup" id="formGroup" @submit="onSubmit">            
            
            <!-- Tuteur: Nom + Prénom + Entreprise --> 
            <b-row class="my-1">
                <b-col sm="4">  
                    <b-form-group
                        id="input-group-1"
                        label="Nom du tuteur:"
                        label-for="nomTuteur">
                        <b-form-input
                            :readonly="readonly"
                            id="nomTuteur"
                            v-model="form.nomTuteur"
                            type="text"
                            required
                            placeholder="Nom du tuteur">
                        </b-form-input>
                    </b-form-group>
                </b-col>
                <b-col sm="4">  
                    <b-form-group
                        id="input-group-1"
                        label="Prénom du tuteur:"
                        label-for="prenomTuteur">
                        <b-form-input
                            :readonly="readonly"
                            id="prenomTuteur"
                            v-model="form.prenomTuteur"
                            type="text"
                            required
                            placeholder="Prénom du tuteur"
                        ></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col sm="4">  
                    <b-form-group
                        id="input-group-1"
                        label="Entreprise du tuteur:"
                        label-for="entrepriseTuteur">
                        <b-form-input
                            :readonly="readonly"
                            id="entrepriseTuteur"
                            v-model="form.entrepriseTuteur"
                            type="text"
                            required
                            placeholder="Entreprise du tuteur"
                        ></b-form-input>
                    </b-form-group>
                </b-col>
            </b-row> 
                <b-col>

                </b-col>  
            <b-row class="my-1">

            </b-row>
            <!-- idProf à faire -->

            <b-button id="submit" type="button" @click="createGroup()" variant="primary">Créer</b-button>
            <!-- La fonction createGroup() amène sur la page /Modification afin que l'élève puisse ajouter des membres -->
            <div v-if="messageError.length > 0">{{messageError}}</div>
        </b-form>
























        <b-form v-else id="formGroup" @submit="onSubmit">            
            
            <!-- Tuteur: Nom + Prénom + Entreprise --> 
            <b-row class="my-1">
                <b-col sm="4">  
                    <b-form-group
                        id="input-group-1"
                        label="Nom du tuteur:"
                        label-for="nomTuteur">
                        {{ nomTuteur }}
                    </b-form-group>
                </b-col>
                <b-col sm="4">  
                    <b-form-group
                        id="input-group-1"
                        label="Prénom du tuteur:"
                        label-for="prenomTuteur">
                        {{ prenomTuteur }}
                    </b-form-group>
                </b-col>
                <b-col sm="4">  
                    <b-form-group
                        id="input-group-1"
                        label="Entreprise du tuteur:"
                        label-for="entrepriseTuteur">
                        {{ entrepriseTuteur }}
                    </b-form-group>
                </b-col>
            </b-row> 














            <!-- Ajout d'étudiant --> 






            <!-- Liste d'élèves -->
            <ul>
                <li v-for="student in listMembers" v-bind:key="student">
                    {{ student.nomEtudiant }} {{ student.prenomEtudiant }} <b-button id="Supprimer" @click="deleteEleve(student.numEtudiant)"> Supprimer </b-button>
                </li>
            </ul>






            <!-- Fonction updateGroup à créer -->
            <b-button id="submit" @click="updateGroup()" type="button" variant="primary">Modifier le groupe</b-button>
            <b-button id="Supprimer" @click="deleteGroup()" v-if="showModif" type="button" variant="primary">Supprimer le groupe</b-button>
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
form: {
    nomTuteur: '',
    prenomTuteur: '',
    entrepriseTuteur: '',
    idProf: null,
    },
listMembers: [],
show: true,
showModif : false,
showPanel : false,
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
},
deleteGroup(){
    axios.delete(".../api/Groupe/"+this.getGroup) // pas besoin de récupérer des résultats 
},
deleteEleve(id){ // pour supprimer un élève
	axios.delete(".../api/Groupe/"+this.getGroupe+"/removeEtudiant",
    {idEtudiant : id} )// donnée dans req.body (pour le back)
},
createGroup(){
    axios.post(`http://localhost:3000/api/Groupe`,this.form).then((response) => {
        this.$store.dispatch('ajoutGroup',response.data);
    }),
    this.$router.push("/Modification")

},
...mapGetters(['hasGroup','getGroup','getId']),
},

        beforeMount(){ // récupère les infos d'un groupe si on est sur la page création groupe 
            if(!this.hasGroup){
                axios.get(`http://localhost:3000/api/Groupe/`+this.getGroup.then((response) => {
                    console.log(response)

                    this.idGroup = response.data.idGroupe
                    this.nomTuteur = response.data.nomTuteurEntreprise
                    this.prenomTuteur = response.data.prenomTuteurEntreprise
                    this.entrepriseTuteur = response.data.nomEntreprise
                    this.idProf = response.data.idProf
                    this.listMembers = response.data.members // JE NE SAIS PAS
                })
                .catch((error) => { 
                    console.log(error);
                    this.$router.push("/404"); // redirection 404
                }));
            }
            axios.get(`http://localhost:3000/api/Etudiant/Promo`,this.getId)
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

</style>
