<template>
    <div id="Evenement_panel">  
        <h1 v-if="isCreate()" >Création d'un nouvel événement !</h1>
        <h1 v-else>Modification de l'événement n°{{$route.params.id}} !</h1>

        <b-alert v-if="error.length > 0" variant="danger" show>{{this.error}}</b-alert>

        <b-form id="formEvent" @submit="onSubmit" v-if="show">            

             <!-- Nom Event + Promo  --> 
            <b-row class="my-1">
                <b-col sm="6">  
                   <b-form-group
                        id="input-group-1"
                        label="Nom de l'évenement:"
                        label-for="NomEvent">
                        <b-form-input
                            id="NomEvent"
                            v-model="form.nomE"
                            type="text"
                            required
                            placeholder="Nom de l'événement"
                        ></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col sm="6">  
                    <b-form-group
                        id="select2"
                        label="Promo de l'évenement:"
                        label-for="Promo">
                        <b-form-select id="Promo" v-model="form.Promo" required :options="promos">
                            <template #first>
                                <b-form-select-option :value="null" disabled>Sélectionner une promo</b-form-select-option>
                            </template>
                        </b-form-select>
                    </b-form-group>
                </b-col>
            </b-row> 

            <!-- Date Event --> 
            <b-row class="my-1">
                <b-col sm="6">  
                    <b-form-group
                        id="date1"
                        label="Date début Evenement:"
                        label-for="DateDebEvent">
                        <b-form-datepicker id="DateDebEvent" :hide-header="true" :state="form.DateDeb.length !== 0" :date-disabled-fn="dateDisabled" :min="minDate" required v-model="form.DateDeb" class="mb-2"></b-form-datepicker>
                    </b-form-group>
                </b-col>
                    <b-col sm="6">  
                    <b-form-group
                        id="date2"
                        label="Date limite Evenement:"
                        label-for="DateLimEvent">
                        <b-form-datepicker id="DateLimEvent" :hide-header="true" :state="form.DateLim.length !== 0 && +new Date(form.DateLim) > +new Date(form.DateDeb) && +new Date(form.DateDeb).setDate(new Date(form.DateDeb).getDate()+parseInt(form.DureeE)) > +new Date(form.DateLim)" :date-disabled-fn="dateDisabled" :min="form.DateDeb" required v-model="form.DateLim" class="mb-2"></b-form-datepicker>
                    </b-form-group>
                </b-col>
            </b-row> 

            <!-- Durée Event --> 
            <b-row class="my-1">
                <b-col sm="6">  
                    <b-form-group
                        id="number1"
                        label="Duree Evenement : (1 = 1 jour)"
                        label-for="DureEvenement">
                        <b-form-input
                            id="DureEvenement"
                            v-model="form.DureeE"
                            type="number"
                            required
                            min="1"
                        ></b-form-input>
                    </b-form-group>
                </b-col>
                    <b-col sm="6">  
                    <b-form-group
                        id="select"
                        label="Durée des soutenances:"
                        label-for="DureeSoutenance">
                        <b-form-select id="DureeSoutenance" required v-model="form.DureeS" :options="options">      
                            <template #first>
                                <b-form-select-option :value="null" disabled>Sélectionner une durée</b-form-select-option>
                            </template>
                        </b-form-select>
                    </b-form-group>
                </b-col>
            </b-row> 


            <b-button type="submit" variant="primary">Créer</b-button>
            <div v-if="messageError.length > 0">{{messageError}}</div>
        </b-form>
        
    </div>
</template>


<script>
import tok from "../service/token"
import axios from "axios"

export default {
    data(){
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        // 15th two months prior
        const minDate = new Date(today)
        return {
            data : null,
            error : "",
            messageError : "",
            form: {
                nomE: '',
                DateDeb : this.formatDate(minDate),
                DateLim: '',
                DureeE : '',
                DureeS: null,
                Promo : null,
            },
            options: [
                { value: '1_heure', text: '1 heure' },
                { value: '1_heure_30', text: '1 heure et demie' },
            ],
            promos : [
                {value: '2023', text: 'IG3'},
                {value: '2022', text: 'IG4'},
            ],
            minDate : minDate,
            show: true,
        }
    },
    methods:{
        isCreate(){
            return this.$route.params.id === undefined
        },
        verifForm(){
            if(this.form.nomE.length === 0){
                this.messageError = "Le nom ne peut pas être vide"
                return false
            }
            else if(this.form.DateLim.length < 1 ){
                this.messageError = "Le date limite d'événement ne peut pas être vide"
                return false
            }
            var dateDeb = new Date(this.form.DateDeb);
            var dateLim = new Date(this.form.DateLim);
            if(dateLim < dateDeb){
                this.messageError = "La date limite ne peut pas être inférieur à la date de début de l'évenement"
                return false
            }
            else if(this.form.DureeE < 1){
                this.messageError = "L'évenement doit durée au moins 1 jour"
                return false  
            }

            else if(+dateDeb.setDate(dateDeb.getDate()+parseInt(this.form.DureeE)) <= +dateLim){
                this.messageError = "La date limite ne peut pas être supérieur ou égale à la durée total de l'événement"
                return false
            }
            else{
                this.messageError = "";
                return true
            }
        },
        formatDate(d){
            const date = new Date(d)
            var dd = date.getDate(); 
            var mm = date.getMonth()+1;
            var yyyy = date.getFullYear(); 
            if(dd<10){dd='0'+dd} 
            if(mm<10){mm='0'+mm}
            return yyyy+'-'+mm+'-'+dd
        },
        dateDisabled(ymd, date) { // enlève les weekend du datePicker
            const weekday = date.getDay()
            return weekday === 0 || weekday === 6
        },
        onSubmit(evt) {
            evt.preventDefault()
            if(this.verifForm()){
                console.log(this.form);
                // appel axios
                var user = tok.decode(sessionStorage.getItem("token"));
                axios.post(`http://localhost:3000/api/Evenement/`,this.form,{ headers:{authorization: "bearer "+user.token}}).then((response) => {
                    console.log(response.data);
                    //this.$router.push("/")
                })
                .catch((error) => { 
                    var msg = error.response;
                    console.log(msg)
                    if(msg.status == '403'){ // pas autorisé 
                        this.messageError = msg.data
                    }
                });
            }
        }
    },
    beforeMount(){ // récupère les infos d'un événement si on est sur la page création Evenement 
    if(!this.isCreate()){
       if(sessionStorage.getItem("token")){  // Vérifie si un token est déjà existant
          var user = tok.decode(sessionStorage.getItem("token"));
          axios.get(`http://localhost:3000/api/Evenement/`+this.$route.params.id, { headers:{authorization: "bearer "+user.token}}).then((response) => {
                  console.log(response)
                  this.data = response.data
              })
              .catch((error) => { 
                console.log(error);
                this.show = false;
                this.error = "Erreur : L'événement n'est pas bien définie (Pas trouver dans la BD)";
                //this.$router.push("/");
              });
      }
      else{
         this.$router.push("/")
      }
    }
  }
}
</script>

<style lang="scss">
 #Evenement_panel{
     margin-top: 5%;
 }
 #formEvent{
     width: 70%;
     margin-left: 15%;
     padding: 20px;
     background: lightcyan;
 }
</style>