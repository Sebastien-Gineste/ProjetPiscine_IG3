<template>
    <div id="EventManagement">

        <h1 id="title"> Gestion des évenements </h1>
        <div v-if="wait">
            <b-icon icon="three-dots" animation="cylon" font-scale="4"></b-icon>
        </div>
        <b-alert v-if="!wait && events.length === 0" variant="warning" show> Il n'y a pas encore d'événements ! </b-alert>

            <b-list-group-item id="listG" v-for="(event, id) in events" :key="id">
                <b>Evenement n°{{id+1}}:</b> {{ event.nomEvenement }} , {{ "IG"+((((new Date().getMonth() + 1) >= 9)? 6 : 5 )-(event.anneePromo - new Date().getFullYear())) }}  <b-button id="b1" variant="primary" type="button" @click="redirectPlanning(event.numEvenement)"> Planning </b-button> <b-button class="b" variant="primary" type="button" @click="redirect(event.numEvenement)"> Modifier </b-button> <b-button variant="primary" class="b" type="button" @click="deleteEvenement(id)"> Supprimer </b-button>
            </b-list-group-item>
        

        <b-button id="crea" type="button" variant="primary" @click="redirectCrea"> Créer un nouvel évenement </b-button>

    </div>
</template>
    
<script>
import axio from "axios";
const axios = axio.create({ withCredentials: true })
    export default {
        data(){
            return{
                events : [],
                wait : false,
            }
        },
        methods:{
            deleteEvenement(id){
                console.log(id)
                axios.delete('http://localhost:3000/api/Evenement/'+this.events[id].numEvenement).then((response) => {
                    console.log(response)
                    this.events.splice(id,1)
                })
                .catch((error)=>{
                    console.log(error)
                })
            },
            redirect(idE){
                this.$router.push("/Evenement/"+idE);
            },
            redirectPlanning(idE){
                this.$router.push("/Evenement/"+idE+"/Planning");
            },
            redirectCrea(){
                this.$router.push("/Evenement/Création")
            }

        },
        beforeMount(){ 
            this.wait = true 
            axios.get('http://localhost:3000/api/Evenement/').then((response) => {
                console.log(response)
                this.events = response.data;
                this.wait = false
            })
            .catch((error)=>{
                console.log(error.response)
                this.wait = false
            })
        }
        
    }
</script>
    
<style >
    #title{
        margin-top: 5%;
        margin-bottom: 3%;
    }

    #crea{
        margin:2%;
    }
    
    #Evenement_panel{
        margin-top: 5%;
    }

    #listG{
        width: 70%;
        margin-left: 15%;
        padding: 20px;
        background: lightcyan;
    }

    #b1 {
        margin: 5px 5px 5px 15px;

    }

    .b {
        margin:5px;
    }
</style>