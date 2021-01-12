<template>
    <div id="EventManagement">

        <h1 id="title"> Gestion des évenements </h1>
        
        <b-button id="crea" type="button" @click="redirectCrea"> Créer un évenement </b-button>

       <b-list-group>
            <b-list-group-item v-for="(event, id) in events" :key="id">
                Evenement n'{{id+1}} :  {{ event.nomEvenement }} , {{ "IG"+((((new Date().getMonth() + 1) >= 9)? 6 : 5 )-(event.anneePromo - new Date().getFullYear())) }}  <b-button type="button" @click="redirectPlanning(event.numEvenement)"> Planning </b-button> <b-button type="button" @click="redirect(event.numEvenement)"> Modifier </b-button> <b-button type="button" @click="deleteEvenement(id)"> Supprimer </b-button>
            </b-list-group-item>
        </b-list-group>
    </div>
</template>
    
<script>
import axio from "axios";
const axios = axio.create({ withCredentials: true })
    export default {
        data(){
            return{
                events : []
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
            axios.get('http://localhost:3000/api/Evenement/').then((response) => {
                console.log(response)
                this.events = response.data;
            })
            .catch((error)=>{
                console.log(error)
            })
        }
        
    }
</script>
    
<style >
    #title_event{
        margin-bottom: 3%;
    }

    #crea{
        margin:2%;
    }
    
    #Evenement_panel{
        margin-top: 5%;
    }
</style>