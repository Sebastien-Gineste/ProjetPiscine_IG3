<template>
  <div class="home">
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
            <b-list-group-item><span> Evénement de la promo </span>: {{event.anneePromo}}</b-list-group-item>
            <b-list-group-item><span>Date de début dé l'événement </span> : {{event.dateDebut}}</b-list-group-item>
            <b-list-group-item><span>Date de limite de réservation des créneaux </span>: {{event.dateLimiteResa}}</b-list-group-item>
          </b-list-group>
        </b-card>
        </router-link>
      </b-col>
    </b-row>

  </div>
</template>

<script>
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
  //appelee avant d'arriver au vue
  beforeMount(){
    this.wait = true 
    axios.get(`http://localhost:3000/api/Evenement/`).then((response) => {
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
  a {
    &:hover .card-text{
      text-decoration:auto !important; 
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