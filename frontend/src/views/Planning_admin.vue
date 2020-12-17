<template>
    <div id="planning">
        <h1 id="title_planning" >Planning de l'événement n°{{$route.params.id}} !</h1>
        <b-alert  v-if="errorMessage.length > 0" variant="danger" show>{{this.errorMessage}}</b-alert>
        <b-container id="contain" class="bv-example-row">
            <b-row id="firstCol">
                <b-col cols="1"></b-col>
                <b-col> <b-icon @click="prevWeek" icon="arrow-left-circle-fill"></b-icon></b-col>
                <b-col></b-col>
                <b-col></b-col>
                <b-col></b-col> 
                <b-col> <b-icon @click="nextWeek" icon="arrow-right-circle-fill"></b-icon></b-col> 
            </b-row>
            <b-row>
                <b-col cols="1">Heure</b-col>
                <b-col :class="[date.indexOf(dateActu.tab[0]) != -1 ? 'datePlanning' : 'notDatePlanning']" >Lundi : {{formatDate(dateActu.tab[0],"tableau")}}</b-col>
                <b-col :class="[date.indexOf(dateActu.tab[1]) != -1 ? 'datePlanning' : 'notDatePlanning']" >Mardi : {{formatDate(dateActu.tab[1],"tableau")}}</b-col>
                <b-col :class="[date.indexOf(dateActu.tab[2]) != -1 ? 'datePlanning' : 'notDatePlanning']" >Mercredi :{{formatDate(dateActu.tab[2],"tableau")}}</b-col>
                <b-col :class="[date.indexOf(dateActu.tab[3]) != -1 ? 'datePlanning' : 'notDatePlanning']" >Jeudi : {{formatDate(dateActu.tab[3],"tableau")}}</b-col> 
                <b-col :class="[date.indexOf(dateActu.tab[4]) != -1 ? 'datePlanning' : 'notDatePlanning']" >Vendredi : {{formatDate(dateActu.tab[4],"tableau")}}</b-col> 
            </b-row>
            <b-row id="heure8">
                <b-col cols="1">8h</b-col>
                <b-col class="colonne j_1"></b-col>
                <b-col class="colonne j_2"></b-col>
                <b-col class="colonne j_3"></b-col>
                <b-col class="colonne j_4"></b-col>
                <b-col class="colonne j_5"></b-col>
            </b-row>
            <b-row id="heure9">
                <b-col cols="1">9h</b-col>
                <b-col class="colonne j_1"></b-col>
                <b-col class="colonne j_2"></b-col>
                <b-col class="colonne j_3"></b-col>
                <b-col class="colonne j_4"></b-col>
                <b-col class="colonne j_5"></b-col>
            </b-row>
            <b-row id="heure10">
                <b-col cols="1">10h</b-col>
                 <b-col class="colonne j_1"></b-col>
                <b-col class="colonne j_2"></b-col>
                <b-col class="colonne j_3"></b-col>
                <b-col class="colonne j_4"></b-col>
                <b-col class="colonne j_5"></b-col>
            </b-row>
            <b-row id="heure11">
                <b-col cols="1">11h</b-col>
                <b-col class="colonne j_1"></b-col>
                <b-col class="colonne j_2"></b-col>
                <b-col class="colonne j_3"></b-col>
                <b-col class="colonne j_4"></b-col>
                <b-col class="colonne j_5"></b-col>
            </b-row>
            <b-row id="heure12">
                <b-col cols="1">12h</b-col>
                <b-col class="colonne j_1"></b-col>
                <b-col class="colonne j_2"></b-col>
                <b-col class="colonne j_3"></b-col>
                <b-col class="colonne j_4"></b-col>
                <b-col class="colonne j_5"></b-col>
            </b-row>
            <b-row id="heure13">
                <b-col cols="1">13h</b-col>
                <b-col class="colonne j_1"></b-col>
                <b-col class="colonne j_2"></b-col>
                <b-col class="colonne j_3"></b-col>
                <b-col class="colonne j_4"></b-col>
                <b-col class="colonne j_5"></b-col>
            </b-row>
            <b-row id="heure14">
                <b-col cols="1">14h</b-col>
                <b-col class="colonne j_1"></b-col>
                <b-col class="colonne j_2"></b-col>
                <b-col class="colonne j_3"></b-col>
                <b-col class="colonne j_4"></b-col>
                <b-col class="colonne j_5"></b-col>
            </b-row>
            <b-row id="heure15">
                <b-col cols="1">15h</b-col>
                <b-col class="colonne j_1"></b-col>
                <b-col class="colonne j_2"></b-col>
                <b-col class="colonne j_3"></b-col>
                <b-col class="colonne j_4"></b-col>
                <b-col class="colonne j_5"></b-col>
            </b-row>
            <b-row id="heure16">
                <b-col cols="1">16h</b-col>
                <b-col class="colonne j_1"></b-col>
                <b-col class="colonne j_2"></b-col>
                <b-col class="colonne j_3"></b-col>
                <b-col class="colonne j_4"></b-col>
                <b-col class="colonne j_5"></b-col>
            </b-row>
            <b-row id="heure17">
                <b-col cols="1">17h</b-col>
                <b-col class="colonne j_1"></b-col>
                <b-col class="colonne j_2"></b-col>
                <b-col class="colonne j_3"></b-col>
                <b-col class="colonne j_4"></b-col>
                <b-col class="colonne j_5"></b-col>
            </b-row>
            <b-row id="heure18">
                <b-col cols="1">18h</b-col>
                <b-col class="colonne j_1"></b-col>
                <b-col class="colonne j_2"></b-col>
                <b-col class="colonne j_3"></b-col>
                <b-col class="colonne j_4"></b-col>
                <b-col class="colonne j_5"></b-col>
            </b-row>
            <b-row id="heure19">
                <b-col cols="1">19h</b-col>
                <b-col class="colonne j_1"></b-col>
                <b-col class="colonne j_2"></b-col>
                <b-col class="colonne j_3"></b-col>
                <b-col class="colonne j_4"></b-col>
                <b-col class="colonne j_5"></b-col>
            </b-row>
            <b-row id="lastcol">
                <b-col cols="1"></b-col>
                <b-col> <b-icon @click="prevWeek" icon="arrow-left-circle-fill"></b-icon></b-col>
                <b-col></b-col>
                <b-col></b-col>
                <b-col></b-col> 
                <b-col> <b-icon @click="nextWeek" icon="arrow-right-circle-fill"></b-icon></b-col> 
            </b-row>
        </b-container>

    </div>
</template>


<script>
import Creneau from "@/components/Creneau.vue";
import Vue from 'vue'
//import tok from "../service/token"
import axios from "axios"
const ComponentClass = Vue.extend(Creneau)
 
export default {
    //components: { Creneau },
    data(){
        return{
            creneaux : [],
            colonne : ["8h","9h","10h","11h","12h","13h","14h","15h","16h","17h","18h","19h"],
            date : [],
            event : null,
            dateActu : { tab : []},
            errorMessage : ""
           
            
        }
    },
    methods : {
        generateDateEvent(DateDebut,DureeE){
            var tabDate = []
            var i = 0
            var dateActu = new Date(DateDebut)
            while(i < DureeE){
                var jourActu = dateActu.getDay() 
                if(jourActu == 0 ||jourActu == 6 ){ // samedi ou dimanche 
                    i--
                }
                else{
                    tabDate.push(this.formatDate(dateActu))
                }
                dateActu.setDate(dateActu.getDate()+1) // on passe au jour suivant
                i++
            }
            return tabDate
        },
        formatDate(d, type="normal"){
            const date = new Date(d)
            var dd = date.getDate(); 
            var mm = date.getMonth()+1;
            var yyyy = date.getFullYear(); 
            if(dd<10){dd='0'+dd} 
            if(mm<10){mm='0'+mm}
            return type=="normal" ? yyyy+'-'+mm+'-'+dd : dd+'/'+mm+'/'+yyyy
        },
        getDateWeek(dateDebut){
            var tabDate = []
            var date = dateDebut
            console.log(date)
            console.log(dateDebut)
            var day = date.getDate();
            var numJ = date.getDay();
            if(numJ == 0){numJ = 7}
            for (var i=1; i<8; i++) {
                date.setDate(day + i - numJ); //incrementation
                tabDate.push(this.formatDate(new Date(date)));
            }
            return tabDate
        },
        nextWeek(){
            var lastDay = new Date(this.dateActu.tab[6]);
            lastDay.setDate(lastDay.getDate() + 1)
            this.dateActu.tab = this.getDateWeek(lastDay)
        },
        prevWeek(){
            var prevDay = new Date(this.dateActu.tab[0]);
            prevDay.setDate(prevDay.getDate() - 1)
            this.dateActu.tab = this.getDateWeek(prevDay)
        }
    },
    beforeMount(){
        this.dateActu.tab = this.getDateWeek(new Date())

        axios.get(`http://localhost:3000/api/Evenement/`+this.$route.params.id).then((response) => {
            console.log(response)
            var infoEvent = response.data;
            this.date = this.generateDateEvent(infoEvent.dateDebut, infoEvent.duree);
            this.event = infoEvent
        })
        .catch(()=> { // pas trouvé 
            this.$router.push("/404"); // redirection 404
        });
        
        axios.get(`http://localhost:3000/api/Evenement/`+this.$route.params.id+'/Creneau').then((response) => {
                var infoCreneau = response.data.creneaux;
                console.log(infoCreneau)
                let i = 0;
                let memoireId = 0;
                this.creneaux = [];
                while(i < infoCreneau.length){
                    if(memoireId == infoCreneau[i].numCreneau){ // on l'a déjà traté mais il y a une info en plus (autres profs)
                        console.log(infoCreneau[i].numCreneau)
                        this.creneaux[this.creneaux.length-1].jury.push({idProf : infoCreneau[i].idProf, nomProf : infoCreneau[i].nomProf, prenomProf : infoCreneau[i].prenomProf}) // ajout un nouveau prof
                    }
                    else{
                        memoireId = infoCreneau[i].numCreneau
                        this.creneaux.push({
                            id : infoCreneau[i].numCreneau,
                            salle : infoCreneau[i].salle,
                            jury : infoCreneau[i].idProf == null ? null : [{idProf : infoCreneau[i].idProf, nomProf : infoCreneau[i].nomProf, prenomProf : infoCreneau[i].prenomProf}],
                            groupe : infoCreneau[i].idGroupe,
                            duree1h : this.event.dureeCreneau == "1_heure",
                            heureDebut: (infoCreneau[i].heureDebut % 1).toFixed(2).substring(2),
                            date : this.formatDate(infoCreneau[i].date),
                        })

                        var instance = new ComponentClass({
                            propsData: {
                                creneau: this.creneaux[this.creneaux.length-1],
                                //show : this.dateActu.indexOf(this.creneaux[this.creneaux.length-1].date) != -1 ? true : false,
                                Dates : this.dateActu
                            }
                        })
                        instance.$mount() // pass nothing
                        this.$el.lastChild.childNodes[Math.floor(infoCreneau[i].heureDebut)-6].childNodes[new Date(infoCreneau[i].date).getDay()].appendChild(instance.$el)
                    }
                    i++;
                }
                    
        })
        .catch((error) => { 
            console.log(error)
            var msg = error.response.data;
            console.log(msg)
            if(msg == "Pas de créneau encore"){
                this.errorMessage = msg
            }
            else{
                this.$router.push("/404"); // redirection 404
            }
        });
    }
    
}
</script>


<style lang="scss">
    #title_planning{
        margin: 3%;
    }
    .bv-example-row .row>.col:not(.header), .bv-example-row .row>[class^=col-]{
        padding-top: .75rem;
        padding-bottom: .75rem;
        background-color: rgba(86,61,124,.15);
        border: 1px solid rgba(86,61,124,.2);
    }
    #planning{
        margin-top: 2%;
        margin-bottom: 5%;
    }
    #contain{
        max-width: 95vw !important;
        margin: auto;
       .colonne{
            border-top : 0px solid !important;
            //border-bottom : 0px solid !important;
            background-color : transparent !important;
    }
    #lastcol div, #firstCol div{
        border : 0px solid !important;
        svg {
            cursor : pointer;
        }
    }
    .notDatePlanning{
        background: repeating-linear-gradient( 45deg, blue 0px, blue 40px, black 40px, black 80px );
        color: white;
    }
    }
</style>

<!--    <b-row v-for="heure in colonne" :key="heure" >
                <b-col cols="1">{{heure}}</b-col>
                <b-col class="colonne"><Creneau :creneau="creneaux[0]"></Creneau></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
            </b-row>
colonne : ["8h","9h","10h","11h","12h","13h","14h","15h","16h","17h","18h","19h"] -->