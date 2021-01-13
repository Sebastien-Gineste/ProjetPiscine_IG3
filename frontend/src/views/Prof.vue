<template>
  <div class="Prof">
      <p> {{bdProfs}}</p>
  </div>
</template>
<script>
import axio from "axios";
const axios = axio.create({
  withCredentials: true
})

export default { 
  data(){
    return {
      profs:null,
      bdProfs:null
    }
  },
  beforeMount(){
        axios.get(`http://localhost:3000/api/Prof/`).then((response) => {
            var profs = response.data;
            this.bdProfs = response.data
            for(let i=0;i<profs.length;i++){
                this.profs.push({value : profs[i].idProf , text : profs[i].nomProf+" "+profs[i].prenomProf})
            }
        })
        .catch((error)=> { // pas trouvé 
            console.log(error.response.data)
            if(error.response.status == '403'){ // pas autorisé 
                this.errorMessage = error.response.data
            }
        })}}
</script>
