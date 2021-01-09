<template>
  <div class="home">
    
    <div v-for="events in data" :key="events">
      <b-link class="navbar-brand" :to="'/Evenement/'+events.numEvenement+'/Planning'">
      <h3> {{events.nomEvenement}}</h3>
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
