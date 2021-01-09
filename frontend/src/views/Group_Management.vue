<template>
    <div id="Group_panel">  
        <h1 id="title_group">Gestion du groupe</h1>

        <b-alert v-if="error.length > 0" variant="danger" show>{{this.error}}</b-alert>




<!-- PARTIE 1: S'IL A DEJA UN GROUPE -->



<!-- if hasGroup then showBlock() -->
<!-- 
showBlock  {
                if hasGroup then
                    return True
                else 
                    return False
} 
-->

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

<!-- FIN DE LA PARTIE 1 -->


<!-- PARTIE 2: S'IL N'A PAS ENCORE DE GROUPE -->

<!-- Même concept avec showBlock -->

        <div id="b2">

            <h6>VOUS N'AVEZ PAS ENCORE DE GROUPE</h6>

            <b-button id="submit" v-if="isCreate" type="submit" variant="primary">Créer un groupe</b-button>



        </div>
        
    </div>
</template>
























<!-- Après data, script coming from create_update_evenement -->

<script>
    import { mapGetters } from 'vuex'
    import axio from "axios";
    import util from "../service/fonctionUtil"

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
            ...mapGetters(['hasGroup','getGroup',]),
            refrech(){
            document.getElementById("submit").innerHTML = "Modifier";
            this.showModif = false;
            for (let i =0;i<this.options.length;i++){
                this.options[i].disabled = true
            }
            for (let i =0;i<this.promos.length;i++){
                this.promos[i].disabled = true
            } 
        },
        onSubmit(evt) {
            evt.preventDefault()
            if(!this.isCreate && !this.showModif){ // page de modification
                document.getElementById("submit").innerHTML = "Valider";
                this.showModif = true;
                for (let i =0;i<this.options.length;i++){
                    this.options[i].disabled = false
                }
                for (let i =0;i<this.promos.length;i++){
                    this.promos[i].disabled = false
                }
            }
            else if(this.verifForm() && this.isCreate){ // on créée l'évenement 
                console.log(this.form);
                // appel axios
                this.form.minHeure = parseFloat(this.form.minHeure)
                this.form.maxHeure = parseFloat(this.form.maxHeure)
                axios.post(`http://localhost:3000/api/Evenement/`,this.form).then((response) => {
                    console.log(response.data);
                    alert(response.data.message);
                    //util.makeToast(this,'success',"Enregistrer :)","")
                    this.$router.push("/")
                })
                .catch((error) => { 
                    var msg = error.response;
                    console.log(msg)
                    if(msg.status == '403'){ // pas autorisé 
                        this.messageError = msg.data
                    }
                });
            }
            else if(this.verifForm() && !this.isCreate && this.showModif){ // On modifie l'événement 
                console.log(this.form);
                this.form.minHeure = parseFloat(this.form.minHeure)
                this.form.maxHeure = parseFloat(this.form.maxHeure)
                console.log(this.form);
                // appel axios
                axios.put(`http://localhost:3000/api/Evenement/`+this.$route.params.id,this.form).then((response) => {
                    console.log(response.data);
                    util.makeToast(this,'success',"Enregistrer :)",response.data.message)
                    this.refrech();
                })
                .catch((error) => { 
                    var msg = error.response;
                    console.log(msg)
                    if(msg.status == '403'){ // pas autorisé 
                        this.messageError = msg.data
                    }
                    util.makeToast(this,'warning',"Erreur :(",error.response.data.message)
                    this.refrech();
                });
            }
        }
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
