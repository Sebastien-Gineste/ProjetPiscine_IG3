<template>
    <div id="planning">
        <h1 id="title_planning" >Planning de l'événement n°{{$route.params.id}} !</h1>
        <b-container id="contain" class="bv-example-row">
            <b-row>
                <b-col cols="1">Heure</b-col>
                <b-col>Lundi : 18/02/2020</b-col>
                <b-col>Mardi : 18/02/2020</b-col>
                <b-col>Mercredi : 18/02/2020</b-col>
                <b-col>Jeudi : 18/02/2020</b-col> 
                <b-col>Vendredi : 18/02/2020</b-col> 
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
                <b-col> <b-icon icon="arrow-left-circle-fill"></b-icon></b-col>
                <b-col></b-col>
                <b-col></b-col>
                <b-col></b-col> 
                <b-col> <b-icon icon="arrow-right-circle-fill"></b-icon></b-col> 
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
            creneaux : [{id:52,salle : "TD15", jury : ["jean","pedro"], groupe : "les monstres", duree1h:true, heureDebut:"25"}],
            colonne : ["8h","9h","10h","11h","12h","13h","14h","15h","16h","17h","18h","19h"],
            date : null,
            event : null,
           
            
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
        formatDate(d){
            const date = new Date(d)
            var dd = date.getDate(); 
            var mm = date.getMonth()+1;
            var yyyy = date.getFullYear(); 
            if(dd<10){dd='0'+dd} 
            if(mm<10){mm='0'+mm}
            return yyyy+'-'+mm+'-'+dd
        }
    },
    beforeMount(){
        axios.get(`http://localhost:3000/api/Evenement/`+this.$route.params.id+'/Creneau').then((response) => {
                var infoCreneau = response.data.creneaux;
                console.log(infoCreneau)
                var infoEvent = response.data.event;
                this.date = this.generateDateEvent(infoEvent.dateDebut, infoEvent.duree);
                /*let d = 0;
               /* while(d < this.date.length){
                    if(this.date.)
                    d++
                }*/
                this.event = infoEvent
                console.log(infoEvent);
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
                            duree1h : infoEvent.dureeCreneau == "1_heure",
                            heureDebut: (infoCreneau[i].heureDebut % 1).toFixed(2).substring(2),
                            show : true,
                        })

                        var instance = new ComponentClass({
                            propsData: {
                                creneau: this.creneaux[this.creneaux.length-1],
                            }
                        })
                        instance.$mount() // pass nothing
                        this.$el.lastChild.childNodes[Math.floor(infoCreneau[i].heureDebut)-7].childNodes[new Date(infoCreneau[i].date).getDay()].appendChild(instance.$el)
                    }
                    i++;
                }
                    
        })
        .catch((error) => { 
            console.log(error);
            console.log(error)
            this.$router.push("/404"); // redirection 404
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
            border-bottom : 0px solid !important;
            background-color : transparent !important;
    }
    #lastcol div{
        border : 0px solid !important;
        svg {
            cursor : pointer;
        }
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