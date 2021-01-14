<template>
    <div id="Evenement_panel">  
        <h1 id="title_event" v-if="isCreate" >Création d'un nouvel événement !</h1>
        <h1 id="title_event" v-else>Modification de l'événement n°{{$route.params.id}} !</h1>

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
                            :readonly="readonly"
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
                        id="date2"
                        label="Date limite de réservation des créneaux:"
                        label-for="DateLimEvent">
                        <b-form-datepicker id="DateLimEvent" :readonly="readonly" :hide-header="true" :state="form.DateLim.length !== 0 && +new Date(form.DateLim).getDate() > +new Date().getDate()" :date-disabled-fn="dateDisabled" :min="minDate" :max="form.DateDeb" required v-model="form.DateLim" class="mb-2"></b-form-datepicker>
                    </b-form-group>
                </b-col>
                <b-col sm="6">  
                    <b-form-group
                        id="date1"
                        label="Date début Evenement:"
                        label-for="DateDebEvent">
                        <b-form-datepicker id="DateDebEvent" :readonly="readonly" :hide-header="true" :state="form.DateDeb.length !== 0 && +new Date(form.DateLim).getDate() <= +new Date(form.DateDeb).getDate()" :date-disabled-fn="dateDisabled" :min="minDate" required v-model="form.DateDeb" class="mb-2"></b-form-datepicker>
                    </b-form-group>
                </b-col>
            </b-row> 

            <!-- Durée Event --> 
            <b-row class="my-1">
                <b-col sm="4">  
                    <b-form-group
                        id="number1"
                        label="Duree Evenement : (1 = 1 jour)"
                        label-for="DureEvenement">
                        <b-form-input
                            :readonly="readonly"
                            id="DureEvenement"
                            v-model="form.DureeE"
                            type="number"
                            required
                            min="1"
                        ></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col sm="4">  
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
                <b-col sm="4">  
                    <b-form-group
                        id="number3"
                        label="Nombre des membres du jury:"
                        label-for="NbMembre">
                        <b-form-input
                            :readonly="readonly"
                            id="NbMembre"
                            v-model="form.nbJury"
                            type="number"
                            required
                            min="1"
                        ></b-form-input>
                    </b-form-group>
                </b-col>
            </b-row> 


            <b-button id="submit"  v-if="isCreate" type="submit" variant="primary">Créer</b-button>
            <b-button id="submit" v-else type="submit" variant="primary">Modifier</b-button>
            <b-button id="Annuler" @click="refrech()" v-if="showModif" type="submit" variant="warning">Annuler</b-button>
            <b-button id="panel" v-if="isCreate" @click="affichePanel()" type="button" variant="success">Option création</b-button>
            <b-button id="panel" v-else @click="affichePanel()" type="button" variant="success">Option modification</b-button>
            <b-alert v-if="messageError.length > 0" variant="warning" show>{{messageError}} </b-alert>
            <div v-if="showPanel" id="optionCreation">
                 <!-- Durée Event --> 
                <b-row class="my-1">
                    <b-col>  
                        <b-form-group
                            id="heureMin"
                            label="Heure min des créneaux"
                            label-for="MinHeure">
                            <b-form-input
                                :readonly="readonly"
                                id="MinHeure"
                                v-model="form.minHeure"
                                type="number"
                                step="0.25"
                                required
                                min="1"
                            ></b-form-input>
                            <small>8.25 = 8h15</small>
                        </b-form-group>
                    </b-col>
                    <b-col >  
                        <b-form-group
                            id="heureMax"
                            label="Heure max des créneaux"
                            label-for="MaxHeure">
                            <b-form-input
                                :readonly="readonly"
                                id="MaxHeure"
                                v-model="form.maxHeure"
                                step="0.25"
                                type="number"
                                required
                                min="1"
                            ></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col  v-if="!isCreate">  
                        <b-form-group
                            id="generationForm"
                            label="Supprimer tous les anciens créneaux ?"
                            label-for="ifGener">
                            <b-form-checkbox id="ifGener" v-model="form.toutRegenerer" name="check-button" switch>
                            </b-form-checkbox>
                        </b-form-group>
                    </b-col>
                </b-row> 
            </div>
        </b-form>
        
    </div>
</template>


<script>
import axio from "axios";
import util from "../service/fonctionUtil"

const axios = axio.create({
  withCredentials: true
})

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
                DateLim: this.formatDate(minDate),
                DureeE : '',
                DureeS: null,
                Promo : null,
                nbJury : null,
                minHeure : 8,
                maxHeure : 19,
                toutRegenerer : true,
            },
            options: [
                { value: '1_heure', text: '1 heure' , disabled: this.readonly },
                { value: '1_heure_30', text: '1 heure et demie', disabled: this.readonly },
            ],
            promos : [
                {value: '2023', text: 'IG3'},
                {value: '2022', text: 'IG4'},
            ],
            minDate : minDate,
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
        verifForm(){
            if(this.form.nomE.length === 0){
                this.messageError = "Le nom ne peut pas être vide"
                return false
            }
            else if(this.form.DateLim.length < 1 ){
                this.messageError = "Le date limite d'événement ne peut pas être vide"
                return false
            }
            else if(this.form.nbJury < 1 ){
                this.messageError = "Il doit y avoir au moins 1 membre pour le jury"
                return false
            }
            for(let i = 0;i<this.promos.length;i++){
                if(this.promos[i].value == this.form.Promo && this.promos[i].numEvent !== null){
                    this.messageError = "Un évenement est déjà programmé pour cette promo :("
                    return false
                }
            }

            var dateDeb = new Date(this.form.DateDeb);
            var dateLim = new Date(this.form.DateLim);
            if(dateLim.getDate() > dateDeb.getDate()){
                this.messageError = "La date limite de réservation ne peut pas être supérieure à la date de début de l'évenement"
                return false
            }
            else if(dateLim.getDate() <= new Date().getDate()){
                this.messageError = "La date limite de réservation ne peut pas être inférieure ou égale à la date du jour"
                return false
            }
            else if(this.form.DureeE < 1){
                this.messageError = "L'évenement doit durer au moins 1 jour"
                return false  
            }
            else{
                this.messageError = "";
                return true
            }
        },
        formatDate(d){
           return util.formatDate(d);
        },
        dateDisabled(ymd, date) { // enlève les weekend du datePicker
            const weekday = date.getDay()
            return weekday === 0 || weekday === 6
        },
        affichePanel(){
            this.showPanel = !this.showPanel
        },
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
                    if(msg){ // Erreur de la BD
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
    beforeMount(){ // récupère les infos d'un événement si on est sur la page création Evenement 
        if(!this.isCreate){
            axios.get(`http://localhost:3000/api/Evenement/`+this.$route.params.id).then((response) => {
                console.log(response)
                this.data = response.data
                //this.minDate = response.data.dateDebut
                this.form = {
                        nomE: response.data.nomEvenement,
                        DateDeb : this.formatDate(response.data.dateDebut),
                        DateLim: this.formatDate(response.data.dateLimiteResa),
                        DureeE : response.data.duree,
                        DureeS: response.data.dureeCreneau,
                        Promo : response.data.anneePromo,
                        nbJury : response.data.nombreMembreJury,
                        minHeure : 8,
                        maxHeure : 19,
                        toutRegenerer : true,          
                    }
            })
            .catch((error) => { 
                console.log(error);
                this.$router.push("/404"); // redirection 404
            });
        }
        // récupère promo
        axios.get(`http://localhost:3000/api/Promo/VerifEvent`).then((response) => {
            this.promos = [];
            var actuYear = new Date().getFullYear()
            var month = new Date().getMonth() + 1
            var text = "IG"
            var idClass = ((month >= 9)? 6 : 5 ) // permet de déduire les classes avec les années de promo 
            for (let i = 0; i < response.data.length; i++) {
                this.promos.push({value: response.data[i].annePromo, text : text+(idClass-(response.data[i].annePromo - actuYear)), disabled : this.readonly, numEvent : response.data[i].numEvenement})
            }
        })
        .catch((error) => { 
            console.log(error);
            this.show = false;
            this.error = "Erreur : Impossible de récuperer les promos";
            //this.$router.push("/");
        });
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
 #Annuler,#panel{
     margin-left: 5%;
 }
 #title_event{
     margin-bottom: 3%;
 }
 #optionCreation{
     margin-top: 3%;
 }

</style>