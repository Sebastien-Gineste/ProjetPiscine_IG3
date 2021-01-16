<template>
  <div class="home">
    <h1>Liste des évenements</h1>
    <div v-if="wait">
      <b-icon icon="three-dots" animation="cylon" font-scale="4"></b-icon>
    </div>
    <div v-if="!wait && data.length === 0" id="indication">
      <b-alert variant="warning" show> Il n'y a pas encore d'événements ! </b-alert>
    </div>
    <b-row id="evenements">
      <b-col sm="6" v-for="(event, ide) in data" :key="ide">
        <router-link :to="'/Evenement/'+event.numEvenement+'/Planning'">
        <b-card :title="event.nomEvenement">
          <b-list-group>
            <b-list-group-item><span> Evénement de la promo </span>: {{event.anneePromo}} ({{formatPromo(event.anneePromo)}})</b-list-group-item>
            <b-list-group-item><span>Date de début dé l'événement </span> : {{formatDate(event.dateDebut)}}</b-list-group-item>
            <b-list-group-item><span>Date de limite de réservation des créneaux </span>: {{formatDate(event.dateLimiteResa)}}</b-list-group-item>
            <b-list-group-item><span>Durée de l'événement </span>: {{event.duree}} jour(s) </b-list-group-item>
            <b-list-group-item><span>Créneaux réservés </span>: {{event.nbCreneauReserver}}/{{event.nbCreneau}}</b-list-group-item>
          </b-list-group>
        </b-card>
        </router-link>
      </b-col>
    </b-row>

  </div>
</template>

<script>
import util from "../service/fonctionUtil"
import axio from "axios";
const axios = axio.create({
  withCredentials: true
})

export default {
  data(){
    return{ 
      data: [],
      wait : false
    }
  },
  methods:{
      formatDate(date){
        return util.formatDate(date, "jolie")
      },
      formatPromo(promo){
          var debut = "IG"
          var fin = ((((new Date().getMonth() + 1) >= 9)? 6 : 5 )-(promo - new Date().getFullYear()))
          if(fin > 5){
              return "Ancienne Promo"
          }
          else if(fin < 3){
              return "Nouvelle Promo"
          }
          else{
              return debut+fin
          }

      },
  },
  //appelee avant d'arriver au vue
  beforeMount(){
    this.wait = true 
    axios.get(`https://projetpiscine.herokuapp.com/api/Evenement/`).then((response) => {
                console.log(response)
                this.data = response.data
                this.wait = false
            })
            .catch((error) => { 
                console.log(error.response);
                this.wait = false
            });
  }

}
</script>

<style lang="scss">
  .col-sm-6,h1{
    margin-bottom : 2%;
  }
  a:hover {
    text-decoration: auto !important;

    .card{
      transform: translateY(-10px);
    }
    
  }
  a{
    transition: all 500ms;
    .card{
      border-radius: 22px;
      transition:  all 500ms ease;
    }
  }

  .card-body{
    background: lightblue;
    border-radius: 20px;
  }

  #evenements{
    margin-right: 2%;
    margin-left: 2%;
  }

  .list-group{
    border-radius: 19px; 
    span{
     color: black;
    }
  }
</style>