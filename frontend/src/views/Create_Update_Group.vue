<!--
<template>
    <div id="group">
        <h1 id="title" v-if="hasGroup">Modification du groupe n°{{getGroup}}</h1>
        <h1 id="title" v-else>Création du groupe</h1>

        <h1 id="title_event" v-if="isCreate" >Création d'un nouvel événement !</h1>
        <h1 id="title_event" v-else>Modification de l'événement n°{{$route.params.id}} !</h1>
        
            
            -- hasGroup & getGroup dans le store --
            
            Si l'étudiant n'a pas de groupe (hasGroup == false), afficher un bouton "Créer un nouveau groupe" qui amène sur la page /Create_Update_Group
                /Create_Update_Group fera office de page de modification ET de création de groupe (cf. Create_Update_Evenement.vue)

            Si l'étudiant a déjà un groupe (hasGroup == true), afficher le groupe et ses infos (getGroup) et un bouton "Modifier le groupe" qui amène sur la page /Create_Update_Group
                /Create_Update_Group fera office de page de modification ET de création de groupe (cf. Create_Update_Evenement.vue)


    </div>
</template>
-->




<template>
    <div id="Group_panel">  
        <!-- iscreate ou hasGroup -->
        <h1 id="title_group" v-if="isCreate" >Création d'un nouveau groupe</h1>
        <h1 id="title_group" v-else>Modification de votre groupe</h1>

        <b-alert v-if="error.length > 0" variant="danger" show>{{this.error}}</b-alert>

        <b-form id="formGroup" @submit="onSubmit" v-if="show">            
            
            <!-- Tuteur: Nom + Prénom + Entreprise --> 
            <b-row class="my-1">
                <b-col sm="6">  
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
                <b-col sm="6">  
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
                <b-col sm="6">  
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

            <!-- Ajouter les élèves au groupe -->

            <b-button id="submit" v-if="isCreate" type="submit" variant="primary">Créer</b-button>
            <b-button id="submit" v-else type="submit" variant="primary">Modifier</b-button>
            <b-button id="Annuler" @click="refrech()" v-if="showModif" type="submit" variant="primary">Supprimer le groupe</b-button>
            <!-- Faire une fonction supprimer à la place de refrech() -->
            <div v-if="messageError.length > 0">{{messageError}}</div>
        </b-form>
        
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
                data : null,
                error : "",
                messageError : "",
                form: {
                    idGroup: null,
                    nomTuteur: '',
                    prenomTuteur: '',
                    entrepriseTuteur: '',
                    idProf: null,
                    listMembers: null,
                    toutRegenerer : true,
                },
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
            ...mapGetters(['hasGroup','getGroup',]),
        },

        beforeMount(){ // récupère les infos d'un groupe si on est sur la page création groupe 
            if(this.isCreate){
                axios.get(`http://localhost:3000/api/Groupe/`+this.$route.params.id).then((response) => {
                    console.log(response)

                    this.idGroup = response.idGroupe
                    this.nomTuteur = response.nomTuteurEntreprise
                    this.prenomTuteur = response.prenomTuteurEntreprise
                    this.entrepriseTuteur = response.nomEntreprise
                    this.idProf = response.idProf
                    this.listMembers = response.members // JE NE SAIS PAS
                })
                .catch((error) => { 
                    console.log(error);
                    this.$router.push("/404"); // redirection 404
                });
            }
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
