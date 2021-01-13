<template>
  <div class="home">
    <div v-if="wait">
      <b-icon icon="three-dots" animation="cylon" font-scale="4"></b-icon>
    </div>
    <div v-if="!wait && data.length === 0" id="indication">
      <b-alert variant="warning" show> Il n'y a pas encore d'événements ! </b-alert>
    </div>
    <div v-for="(event, ide) in data" :key="ide">
      <b-link class="navbar-brand" :to="'/Evenement/'+event.numEvenement+'/Planning'">
      <h3> {{event.nomEvenement}}</h3>
      </b-link>
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
</style>