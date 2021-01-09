<template>
  <div class="home">
    
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
      data: null
    }
  },
  //appelee avant d'arriver au vue
  beforeMount(){
    axios.get(`http://localhost:3000/api/Evenement/`).then((response) => {
                console.log(response)
                this.data = response.data
            })
            .catch((error) => { 
                console.log(error);
                this.$router.push("/404"); // redirection 404
            });

  }

}
</script>
