<template>
    <div id="planning">
        <h1 id="title_planning" >Planning de l'événement n°{{$route.params.id}} !</h1>
        <b-alert  v-if="errorMessage.length > 0" variant="danger" show>{{this.errorMessage}}</b-alert>
        <Panel :State="panel" />
        <transition name="slide-fade">
            <div @click="removePanel()" id="fond" v-if="show"></div>
         </transition>
        <transition name="slide-fade">
            <div id="panelModifCreneau" v-if="show">
                    <h3>Modification du Creneau {{panelCreneau.id}}</h3>

                    <b-form-group id="input-prof" label="Jury" label-for="input-jury">
                        <b-row class="my-1">
                            <b-col v-for="numJ in event.nombreMembreJury" :key="numJ">  
                                <b-form-select :id="'input-jury-'+numJ" v-model="panelCreneau.jury[numJ-1]" required :options="profs">
                                    <template #first>
                                        <b-form-select-option :value="null" disabled>Sélectionner un prof</b-form-select-option>
                                    </template>
                                </b-form-select>
                            </b-col>
                        </b-row>
                    </b-form-group> 

                    <b-row class="my-1">
                        <b-col>  
                            <b-form-group id="input-salle" label="Nom de la salle" label-for="salle">
                                <b-form-input id="salle" list="listeSalle" placeholder="Pas de salle encore" v-model="panelCreneau.salle"></b-form-input>
                                 <datalist id="listeSalle">
                                    <option v-for="salle in salles" :key="salle">{{ salle }}</option>
                                </datalist>
                            </b-form-group>
                        </b-col>
                         <b-col>  
                            <b-form-group id="input-group" label="Groupe" label-for="NomGr">
                                <b-form-input  id="NomGr" v-model="panelCreneau.groupe" type="text" readonly required placeholder="Pas encore réserver.."></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>

                     <!-- Durée Event --> 
                    <b-row class="my-1">
                        <b-col>  
                            <b-form-group  id="heureMin" label="Heure début" label-for="MinHeure">
                                <b-form-input  id="MinHeure" v-model="panelCreneau.heureDebut" type="number"  step="0.25"  required  min="8" max="17.25"></b-form-input>
                                <small>8.25 = 8h15</small>
                            </b-form-group>
                        </b-col>
                        <b-col>  
                            <b-form-group id="dateCreneau" label="date du créneau" label-for="dateCren">
                                <b-form-datepicker id="dateCren" :hide-header="true" :state="date.indexOf(formatDate(panelCreneau.dateCreneau)) !== -1" :date-disabled-fn="dateDisabled" :min="date[0]" :max="date[date.length-1]" required v-model="panelCreneau.dateCreneau" class="mb-2"></b-form-datepicker>
                            </b-form-group>
                        </b-col>
                    </b-row> 

                    <b-button id="enregister" @click="enregistrerCreneau()" type="button" variant="primary">Enregistrer</b-button>
                    <b-button id="supprimer" @click="supprimerCreneau()" type="button" variant="primary">Supprimer</b-button>
            </div>
        </transition>
        <b-container id="contain" class="bv-example-row">
            <b-row id="firstCol">
                <b-col><b-icon @click="prevWeek" icon="arrow-left"></b-icon></b-col>
                <b-col><b-icon @click="prevWeekEvent" icon="arrow-left-circle-fill"></b-icon></b-col>
                <b-col></b-col>
                <b-col> <b-icon @click="nextWeekEvent" icon="arrow-right-circle-fill"></b-icon></b-col> 
                <b-col><b-icon @click="nextWeek" icon="arrow-right"></b-icon></b-col>
            </b-row>
            <b-row>
                <b-col cols="1">Heure</b-col>
                <b-col v-if="dateAffiche[0]" @dblclick="restartAffiche" @click="desaffiche(0)" :class="[date.indexOf(dateActu.tab[0]) != -1 ? 'datePlanning' : 'notDatePlanning',dateActu.tab[0] == new Date() ? 'dateActu' : '']" >Lundi : {{formatDate(dateActu.tab[0],"tableau")}}</b-col>
                <b-col v-if="dateAffiche[1]" @dblclick="restartAffiche" @click="desaffiche(1)" :class="[date.indexOf(dateActu.tab[1]) != -1 ? 'datePlanning' : 'notDatePlanning',dateActu.tab[1] == new Date() ? 'dateActu' : '']" >Mardi : {{formatDate(dateActu.tab[1],"tableau")}}</b-col>
                <b-col v-if="dateAffiche[2]" @dblclick="restartAffiche" @click="desaffiche(2)" :class="[date.indexOf(dateActu.tab[2]) != -1 ? 'datePlanning' : 'notDatePlanning',dateActu.tab[2] == new Date() ? 'dateActu' : '']" >Mercredi : {{formatDate(dateActu.tab[2],"tableau")}}</b-col>
                <b-col v-if="dateAffiche[3]" @dblclick="restartAffiche" @click="desaffiche(3)" :class="[date.indexOf(dateActu.tab[3]) != -1 ? 'datePlanning' : 'notDatePlanning',dateActu.tab[3] == new Date() ? 'dateActu' : '']" >Jeudi : {{formatDate(dateActu.tab[3],"tableau")}}</b-col> 
                <b-col v-if="dateAffiche[4]" @dblclick="restartAffiche" @click="desaffiche(4)" :class="[date.indexOf(dateActu.tab[4]) != -1 ? 'datePlanning' : 'notDatePlanning',dateActu.tab[4] == new Date() ? 'dateActu' : '']" >Vendredi : {{formatDate(dateActu.tab[4],"tableau")}}</b-col> 
            </b-row>
            <b-row id="heure8">
                <b-col cols="1">8h</b-col>
                <b-col v-if="dateAffiche[0]" @dblclick="createCreneau" class="colonne j_1"></b-col>
                <b-col v-if="dateAffiche[1]" @dblclick="createCreneau" class="colonne j_2"></b-col>
                <b-col v-if="dateAffiche[2]" @dblclick="createCreneau" class="colonne j_3"></b-col>
                <b-col v-if="dateAffiche[3]" @dblclick="createCreneau" class="colonne j_4"></b-col>
                <b-col v-if="dateAffiche[4]" @dblclick="createCreneau" class="colonne j_5"></b-col>
            </b-row>
            <b-row id="heure9">
                <b-col cols="1">9h</b-col>
                <b-col v-if="dateAffiche[0]" @dblclick="createCreneau" class="colonne j_1"></b-col>
                <b-col v-if="dateAffiche[1]" @dblclick="createCreneau" class="colonne j_2"></b-col>
                <b-col v-if="dateAffiche[2]" @dblclick="createCreneau" class="colonne j_3"></b-col>
                <b-col v-if="dateAffiche[3]" @dblclick="createCreneau" class="colonne j_4"></b-col>
                <b-col v-if="dateAffiche[4]" @dblclick="createCreneau" class="colonne j_5"></b-col>
            </b-row>
            <b-row id="heure10">
                <b-col cols="1">10h</b-col>
                <b-col v-if="dateAffiche[0]" @dblclick="createCreneau" class="colonne j_1"></b-col>
                <b-col v-if="dateAffiche[1]" @dblclick="createCreneau" class="colonne j_2"></b-col>
                <b-col v-if="dateAffiche[2]" @dblclick="createCreneau" class="colonne j_3"></b-col>
                <b-col v-if="dateAffiche[3]" @dblclick="createCreneau" class="colonne j_4"></b-col>
                <b-col v-if="dateAffiche[4]" @dblclick="createCreneau" class="colonne j_5"></b-col>
            </b-row>
            <b-row id="heure11">
                <b-col cols="1">11h</b-col>
                <b-col v-if="dateAffiche[0]" @dblclick="createCreneau" class="colonne j_1"></b-col>
                <b-col v-if="dateAffiche[1]" @dblclick="createCreneau" class="colonne j_2"></b-col>
                <b-col v-if="dateAffiche[2]" @dblclick="createCreneau" class="colonne j_3"></b-col>
                <b-col v-if="dateAffiche[3]" @dblclick="createCreneau" class="colonne j_4"></b-col>
                <b-col v-if="dateAffiche[4]" @dblclick="createCreneau" class="colonne j_5"></b-col>
            </b-row>
            <b-row id="heure12">
                <b-col cols="1">12h</b-col>
                <b-col v-if="dateAffiche[0]" @dblclick="createCreneau" class="colonne j_1"></b-col>
                <b-col v-if="dateAffiche[1]" @dblclick="createCreneau" class="colonne j_2"></b-col>
                <b-col v-if="dateAffiche[2]" @dblclick="createCreneau" class="colonne j_3"></b-col>
                <b-col v-if="dateAffiche[3]" @dblclick="createCreneau" class="colonne j_4"></b-col>
                <b-col v-if="dateAffiche[4]" @dblclick="createCreneau" class="colonne j_5"></b-col>
            </b-row>
            <b-row id="heure13">
                <b-col cols="1">13h</b-col>
                <b-col v-if="dateAffiche[0]" @dblclick="createCreneau" class="colonne j_1"></b-col>
                <b-col v-if="dateAffiche[1]" @dblclick="createCreneau" class="colonne j_2"></b-col>
                <b-col v-if="dateAffiche[2]" @dblclick="createCreneau" class="colonne j_3"></b-col>
                <b-col v-if="dateAffiche[3]" @dblclick="createCreneau" class="colonne j_4"></b-col>
                <b-col v-if="dateAffiche[4]" @dblclick="createCreneau" class="colonne j_5"></b-col>
            </b-row>
            <b-row id="heure14">
                <b-col cols="1">14h</b-col>
                <b-col v-if="dateAffiche[0]" @dblclick="createCreneau" class="colonne j_1"></b-col>
                <b-col v-if="dateAffiche[1]" @dblclick="createCreneau" class="colonne j_2"></b-col>
                <b-col v-if="dateAffiche[2]" @dblclick="createCreneau" class="colonne j_3"></b-col>
                <b-col v-if="dateAffiche[3]" @dblclick="createCreneau" class="colonne j_4"></b-col>
                <b-col v-if="dateAffiche[4]" @dblclick="createCreneau" class="colonne j_5"></b-col>
            </b-row>
            <b-row id="heure15">
                <b-col cols="1">15h</b-col>
                <b-col v-if="dateAffiche[0]" @dblclick="createCreneau" class="colonne j_1"></b-col>
                <b-col v-if="dateAffiche[1]" @dblclick="createCreneau" class="colonne j_2"></b-col>
                <b-col v-if="dateAffiche[2]" @dblclick="createCreneau" class="colonne j_3"></b-col>
                <b-col v-if="dateAffiche[3]" @dblclick="createCreneau" class="colonne j_4"></b-col>
                <b-col v-if="dateAffiche[4]" @dblclick="createCreneau" class="colonne j_5"></b-col>
            </b-row>
            <b-row id="heure16">
                <b-col cols="1">16h</b-col>
                <b-col v-if="dateAffiche[0]" @dblclick="createCreneau" class="colonne j_1"></b-col>
                <b-col v-if="dateAffiche[1]" @dblclick="createCreneau" class="colonne j_2"></b-col>
                <b-col v-if="dateAffiche[2]" @dblclick="createCreneau" class="colonne j_3"></b-col>
                <b-col v-if="dateAffiche[3]" @dblclick="createCreneau" class="colonne j_4"></b-col>
                <b-col v-if="dateAffiche[4]" @dblclick="createCreneau" class="colonne j_5"></b-col>
            </b-row>
            <b-row id="heure17">
                <b-col cols="1">17h</b-col>
                <b-col v-if="dateAffiche[0]" @dblclick="createCreneau" class="colonne j_1"></b-col>
                <b-col v-if="dateAffiche[1]" @dblclick="createCreneau" class="colonne j_2"></b-col>
                <b-col v-if="dateAffiche[2]" @dblclick="createCreneau" class="colonne j_3"></b-col>
                <b-col v-if="dateAffiche[3]" @dblclick="createCreneau" class="colonne j_4"></b-col>
                <b-col v-if="dateAffiche[4]" @dblclick="createCreneau" class="colonne j_5"></b-col>
            </b-row>
            <b-row id="heure18">
                <b-col cols="1">18h</b-col>
                <b-col v-if="dateAffiche[0]" @dblclick="createCreneau" class="colonne j_1"></b-col>
                <b-col v-if="dateAffiche[1]" @dblclick="createCreneau" class="colonne j_2"></b-col>
                <b-col v-if="dateAffiche[2]" @dblclick="createCreneau" class="colonne j_3"></b-col>
                <b-col v-if="dateAffiche[3]" @dblclick="createCreneau" class="colonne j_4"></b-col>
                <b-col v-if="dateAffiche[4]" @dblclick="createCreneau" class="colonne j_5"></b-col>
            </b-row>
            <b-row id="heure19">
                <b-col cols="1">19h</b-col>
                <b-col v-if="dateAffiche[0]" @dblclick="createCreneau" class="colonne j_1"></b-col>
                <b-col v-if="dateAffiche[1]" @dblclick="createCreneau" class="colonne j_2"></b-col>
                <b-col v-if="dateAffiche[2]" @dblclick="createCreneau" class="colonne j_3"></b-col>
                <b-col v-if="dateAffiche[3]" @dblclick="createCreneau" class="colonne j_4"></b-col>
                <b-col v-if="dateAffiche[4]" @dblclick="createCreneau" class="colonne j_5"></b-col>
            </b-row>
            <b-row>
                <b-col cols="1"></b-col>
                <b-col class="selectDate" :class="dateAffiche[0]? 'bg-info' : 'bg-dark text-white'" @dblclick="restartAffiche" @click="desaffiche(0)">Lundi</b-col>
                <b-col class="selectDate" :class="dateAffiche[1]? 'bg-info' : 'bg-dark text-white'" @dblclick="restartAffiche" @click="desaffiche(1)">Mardi </b-col>
                <b-col class="selectDate" :class="dateAffiche[2]? 'bg-info' : 'bg-dark text-white'" @dblclick="restartAffiche" @click="desaffiche(2)">Mercredi</b-col>
                <b-col class="selectDate" :class="dateAffiche[3]? 'bg-info' : 'bg-dark text-white'" @dblclick="restartAffiche" @click="desaffiche(3)">Jeudi</b-col> 
                <b-col class="selectDate" :class="dateAffiche[4]? 'bg-info' : 'bg-dark text-white'" @dblclick="restartAffiche" @click="desaffiche(4)">Vendredi</b-col> 
            </b-row>
            <b-row id="lastcol">
                <b-col cols="1"></b-col>
                <b-col><b-icon @click="prevWeek" icon="arrow-left"></b-icon></b-col>
                <b-col><b-icon @click="prevWeekEvent" icon="arrow-left-circle-fill"></b-icon></b-col>
                <b-col></b-col>
                <b-col><b-icon @click="nextWeekEvent" icon="arrow-right-circle-fill"></b-icon></b-col> 
                <b-col><b-icon @click="nextWeek" icon="arrow-right"></b-icon></b-col>
            </b-row>
        </b-container>

    </div>
</template>


<script>
import Creneau from "@/components/Creneau.vue";
import Panel from "@/components/panelCreneau.vue";
import Vue from 'vue'
import util from "../service/fonctionUtil"
import axio from "axios";
const ComponentClass = Vue.extend(Creneau)
const axios = axio.create({
  withCredentials: true
})
 
export default {
    components: { Panel },
    data(){
        return{
            creneaux : [],
            colonne : ["8h","9h","10h","11h","12h","13h","14h","15h","16h","17h","18h","19h"],
            date : [],
            event : null,
            dateActu : { tab : []},
            dateAffiche : [true,true,true,true,true],
            errorMessage : "",
            show : false,
            currentCreneau : null,
            salles : ['TD15','SC102'],
            profs : [],
            bdProfs : null,
            panel : {mode : null},
            panelCreneau : {
                idEvent : null,
                id : null,
                heureDebut : 8,
                dateCreneau : null,
                jury : [],
                salle : null,
                groupe : null,
            }
        }
    },
    methods : {
        createCreneau(e){
            var jour = this.dateActu.tab[parseInt(e.target.classList[1].substr(2))-1] 
            var heure = e.target.parentElement.id.substr(5)
            console.log("j = "+jour+" heure = "+heure);
            if(this.date.indexOf(jour) !== -1){
                console.log("good")
            }
            else{
                console.log("on peut pas")
            }
        },
        duppliqueCreneau(creneau){
            console.log(creneau)
            var newCreneau = {
                date: creneau.date,
                duree1h: creneau.duree1h ,
                groupe: creneau.groupe ,
                heureDebut: creneau.heureDebut,
                heureTotal: creneau.heureTotal,
                id: -1,
                idTabCreneau: creneau.idTabCreneau + 1,
                jury: [],
                salle: null,
                supprimer: false,
                tabFrereCren: [],
            }
            console.log(newCreneau.idTabCreneau);
            this.creneaux.splice(newCreneau.idTabCreneau, 0, newCreneau); // on le rajoute juste après le créneau duppliquer 
            for(let i=creneau.idTabCreneau+1;i<this.creneaux.length;i++){ // on réajuste les autres indexs
                this.creneaux[i].idTabCreneau ++ 
            }
            if(creneau.tabFrereCren != null){
                let id = creneau.tabFrereCren.indexOf(creneau)
                creneau.tabFrereCren.splice(id+1,0,this.creneaux[creneau.idTabCreneau+1]) // on l'ajoute dans le tableau après 
                this.creneaux[creneau.idTabCreneau+1].tabFrereCren = creneau.tabFrereCren // on l'ajout dans ses frères
            }
            else{
                let tabFrere = [this.creneaux[creneau.idTabCreneau],this.creneaux[creneau.idTabCreneau+1]] // créer le tableau des frères
                this.creneaux[creneau.idTabCreneau].tabFrereCren = tabFrere
                this.creneaux[creneau.idTabCreneau+1].tabFrereCren = this.creneaux[creneau.idTabCreneau].tabFrereCren    
            }
          

            for(let i = 0;i<creneau.jury.length;i++){  
                 this.creneaux[creneau.idTabCreneau+1].jury.push(null) 
            }
            setTimeout(this.genererCreneau,50)

        },
        affichePanelCreneau(creneau){
            console.log(creneau)
            this.currentCreneau = creneau
            this.panelCreneau = {
                idEvent : this.event.numEvenement,
                id : creneau.id,
                salle : creneau.salle,
                dateCreneau : creneau.date,
                heureDebut : creneau.heureTotal,
                groupe : creneau.groupe
            }
            
            this.panelCreneau.jury = []
            for(let i = 0;i<creneau.jury.length;i++){  // met l'id des profs dans le tableau de jury du panelCreneau
                creneau.jury[i] !== null ?  this.panelCreneau.jury.push(creneau.jury[i].idProf) : this.panelCreneau.jury.push(null)
            }

            this.show = true
        },
        removePanel(){
            this.show = false // enlève le panel
            this.currentCreneau = null
            for(let i = 0;i<this.event.nombreMembreJury;i++){ // on remet à null
                this.panelCreneau.jury[i] = null
            }
            this.panelCreneau = {id : null,heureMin : 8, dateCreneau : null,salle : null,groupe : null} // rénitialise le formulaire du créneau
        },
        enregistrerCreneau(){

            if(this.currentCreneau.date === this.panelCreneau.dateCreneau && Math.floor(this.currentCreneau.heureTotal) === Math.floor(this.panelCreneau.heureDebut)){ // si on a pas modif la date ni l'heure
                this.currentCreneau.id =  this.panelCreneau.id  
                this.currentCreneau.salle = this.panelCreneau.salle
                this.currentCreneau.groupe = this.panelCreneau.groupe
                this.currentCreneau.heureDebut = (this.panelCreneau.heureDebut % 1).toFixed(2).substring(2)

                var AncienneHeure = this.currentCreneau.heureTotal
                if(this.currentCreneau.heureTotal != this.panelCreneau.heureDebut){ // On a changer son commencement 0,0.25,0.50 ou 0.75 => il faut regarder s'il chevauche un autre créneau
                    this.currentCreneau.heureTotal = this.panelCreneau.heureDebut // on lui met la nouvelle heure
                    if(this.currentCreneau.tabFrereCren != null){ // il a des frères => On verifie s'ils le sont toujours  
                        console.log("frere")
                        var tabFr = this.currentCreneau.tabFrereCren 
                        this.calculFrere(tabFr) // Vérifie si on est toujours liés aux créneau frères
                    }
                    var idTab = this.currentCreneau.idTabCreneau
                    if(this.currentCreneau.heureTotal < AncienneHeure){ // on fini plus tôt => Peut-être qu'on touche un autre creneau
                        console.log("On vérifie avant")
                        if(idTab>0 && this.creneaux[idTab].date === this.creneaux[idTab-1].date){ // il y a un créneau avant
                            let heureFinal = this.event.dureeCreneau == "1_heure"? parseFloat(this.creneaux[idTab-1].heureTotal) + 1.25 : parseFloat(this.creneaux[idTab-1].heureTotal) + 1.75;
                            console.log("heureF = "+heureFinal)
                            if(heureFinal > this.creneaux[idTab].heureTotal){ // on doit ajouter aux frères
                                if(this.creneaux[idTab-1].tabFrereCren == null){ // n'avait pas de frère
                                    let tabFrere = [this.creneaux[idTab-1],this.creneaux[idTab]] // créer le tableau des frères
                                    this.creneaux[idTab-1].tabFrereCren = tabFrere
                                    this.creneaux[idTab].tabFrereCren = this.creneaux[idTab-1].tabFrereCren    
                                }
                                else{ // à déjà des frères
                                    if(this.creneaux[idTab-1].tabFrereCren.indexOf(this.creneaux[idTab]) == -1 ){
                                        this.creneaux[idTab-1].tabFrereCren.push(this.creneaux[idTab]) // on l'ajoute dans le tableau
                                        this.creneaux[idTab].tabFrereCren = this.creneaux[idTab-1].tabFrereCren // on l'ajout dans ses frères
                                    }
                                }
                            }
                        }
                    }
                    else{ // on fini plus tard => Peut-être qu'on touche un autre creneau
                        console.log("On vérifie après")
                            if(idTab < this.creneaux.length-1 && this.creneaux[idTab].date === this.creneaux[idTab+1].date){ // il y a un créneau avant
                                let heureFinal = this.event.dureeCreneau == "1_heure"? parseFloat(this.creneaux[idTab].heureTotal) + 1.25 : parseFloat(this.creneaux[idTab].heureTotal) + 1.75;
                                console.log("heureF = "+heureFinal)
                                if(heureFinal > this.creneaux[idTab+1].heureTotal){ // on doit ajouter aux frères
                                    if(this.creneaux[idTab+1].tabFrereCren == null){ // n'avait pas de frère
                                        if(this.creneaux[idTab].tabFrereCren != null){ // l'élement qu'on déplace avait déjà des frères
                                            this.creneaux[idTab].tabFrereCren.push(this.creneaux[idTab+1]) // on l'ajoute dans le tableau
                                            this.creneaux[idTab+1].tabFrereCren = this.creneaux[idTab].tabFrereCren // on l'ajout dans ses frères
                                        }
                                        else{
                                            let tabFrere = [this.creneaux[idTab],this.creneaux[idTab+1]] // créer le tableau des frères
                                            this.creneaux[idTab].tabFrereCren = tabFrere
                                            this.creneaux[idTab+1].tabFrereCren = this.creneaux[idTab].tabFrereCren
                                        }
                                    }
                                    else{ // à déjà des frères
                                        if(this.creneaux[idTab+1].tabFrereCren.indexOf(this.creneaux[idTab]) == -1 ){
                                            this.creneaux[idTab+1].tabFrereCren.unshift(this.creneaux[idTab]) // on l'ajoute dans le tableau
                                            this.creneaux[idTab].tabFrereCren = this.creneaux[idTab+1].tabFrereCren // on l'ajout dans ses frères
                                        }
                                    }
                                }
                            }
                    }
                }
                this.currentCreneau.heureTotal = this.panelCreneau.heureDebut
                this.currentCreneau.date = util.formatDate(this.panelCreneau.dateCreneau)
                var newJury = []
                for(let i = 0;i<this.event.nombreMembreJury;i++){ // on remet à null
                    if(this.panelCreneau.jury[i]){
                        newJury.push(this.bdProfs[this.panelCreneau.jury[i]-1]) // on cherche le profs dans la sélection de tous les profs
                    }
                    else{
                        newJury.push(null)
                    }
                }
                this.currentCreneau.jury = newJury
            }
            else{ // On recharge tout 
                alert("go supprimer et refaire")
                // appel axios pour enregister
                // appel axios qui recharge tous les créneaux
            }
    
            util.makeToast(this,"success","Enregister","Votre modification a été enregistré ! :)")
            setTimeout(this.removePanel,50)
        },
        calculFrere(tabFr){
            var id = tabFr[0].idTabCreneau // id du tableau
            this.creneaux[id].tabFrereCren = null
            var idDebut = id
            while( id < idDebut + tabFr.length - 1){ // reParcours les frères pour vérifier
                    this.creneaux[id+1].tabFrereCren = null
                    var heureFinal = this.event.dureeCreneau == "1_heure"? parseFloat(this.creneaux[id].heureTotal) + 1.25 : parseFloat(this.creneaux[id].heureTotal) + 1.75;
                    if(heureFinal > this.creneaux[id+1].heureTotal){ // si le créneau fini après le début du nouveau créneau
                        if(this.creneaux[id].tabFrereCren == null){ // n'avait pas de frère
                            var tabFrere = [this.creneaux[id],this.creneaux[id+1]] // créer le tableau des frères
                            this.creneaux[id].tabFrereCren = tabFrere
                            this.creneaux[id+1].tabFrereCren = this.creneaux[id].tabFrereCren
                        }
                        else{ // à déjà des frères
                            this.creneaux[id].tabFrereCren.push(this.creneaux[id+1]) // on l'ajoute dans le tableau
                            this.creneaux[id+1].tabFrereCren = this.creneaux[id].tabFrereCren // on l'ajout dans ses frères
                        }
                        
                    }
                    id++
                }
        },
        SupprimeDirectCreneau(creneau){ // cliqué sur la croix en haut des créneaux
            console.log("creneau")
            this.affichePanelCreneau(creneau)
            this.show = false
            this.supprimerCreneau()
        },
        supprimerCreneau(){
            util.makeToast(this,"success","Supprimer","Le créneau a été supprimé ! :)")
            this.currentCreneau.supprimer = true;
            // enlève du tableau this.creneaux
            // appel Axio pour supprimer
            this.removePanel();

        },
        formatDate(d, type="normal"){
            return util.formatDate(d,type)
        },
        dateDisabled(ymd, date) { // enlève les weekend du datePicker
            const weekday = date.getDay()
            return weekday === 0 || weekday === 6
        },
        desaffiche(id){
            this.dateAffiche[id] = true
            for(let i = 0;i<this.dateAffiche.length;i++){
                if(id != i){ this.dateAffiche[i] = false}  
            }
            this.dateActu.tab = this.getDateWeek(new Date(this.dateActu.tab[0]))
            setTimeout(this.genererCreneau,50)
        },
        restartAffiche(){
            for(let i = 0;i<this.dateAffiche.length;i++){
                this.dateAffiche[i] = true
            }
            this.dateActu.tab = this.getDateWeek(new Date(this.dateActu.tab[0]))
            setTimeout(this.genererCreneau,50)
        },
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
                    tabDate.push(util.formatDate(dateActu))
                }
                dateActu.setDate(dateActu.getDate()+1) // on passe au jour suivant
                i++
            }
            return tabDate
        },
        getDateWeek(dateActu = new Date()){
            var tabDate = []
            var date= new Date(dateActu);
            var numJ = date.getDay();
            if(numJ == 0){numJ = 7}
            var dayWeek = new Date(dateActu);
            dayWeek.setDate(dayWeek.getDate() + 1 - numJ);
            for (var i=1; i<8; i++) {
                tabDate.push(util.formatDate(dayWeek));
                dayWeek.setDate(dayWeek.getDate()+1); //incrementation
            }
            return tabDate
        },
        nextWeekEvent(){
            var lastDay = new Date(this.dateActu.tab[6]);
            if(lastDay >= new Date(this.date[this.date.length-1])){ // on a dépassé les dates de l'évenement
                util.makeToast(this,"warning","Attention !","L'événement n'est pas de ce sens ! :)")
            }
            else if(lastDay < new Date(this.date[this.date.length-1]) && lastDay > new Date(this.date[0])){ // on passe à la semaine suivante
                lastDay.setDate(lastDay.getDate() + 1)
                this.dateActu.tab = this.getDateWeek(lastDay)
            }
            else{
                lastDay = new Date(this.date[0]); // on charge la première date de l'événement
                this.dateActu.tab = this.getDateWeek(lastDay)
            }
        },
        prevWeekEvent(){
            var prevDay = new Date(this.dateActu.tab[0]);
            if(prevDay <= new Date(this.date[0])){ // on a dépassé les dates de l'évenement
                util.makeToast(this,"warning","Attention !","L'événement n'est pas de ce sens ! :)")
            }
            else if(prevDay > new Date(this.date[0]) && prevDay < new Date(this.date[this.date.length-1])){ // on passe à la semaine précédente
                prevDay.setDate(prevDay.getDate() - 1)
                this.dateActu.tab = this.getDateWeek(prevDay)
            }
            else{
                prevDay = new Date(this.date[this.date.length-1]); // on charge la dernière date de l'événement
                this.dateActu.tab = this.getDateWeek(prevDay)
            }
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
        },
        suppAllCreneau(){
            while(this.$el.getElementsByClassName("creneau").length > 0){
                this.$el.getElementsByClassName("creneau")[0].remove()
            }
        },
        genererCreneau(){
            this.suppAllCreneau()
            for(let i =0;i< this.creneaux.length; i++){
                var elementParent =  this.$el.lastChild.childNodes[Math.floor(this.creneaux[i].heureTotal)-6].getElementsByClassName("j_"+new Date(this.creneaux[i].date).getDay())[0]

                if(this.dateAffiche[new Date(this.creneaux[i].date).getDay()-1]){ // on doit l'afficher
                    if(elementParent){
                        var instance = new ComponentClass({
                            propsData: {
                                creneau: this.creneaux[i],
                                Dates : this.dateActu,
                                appelPanel : this.affichePanelCreneau,
                                SupprimeCreneau : this.SupprimeDirectCreneau,
                                DuppliquerCreneau : this.duppliqueCreneau,
                                Mode : this.panel
                            }
                            })
                        instance.$mount() // pass nothing
                        elementParent.appendChild(instance.$el)
                    }
                }
                else{
                    if(elementParent){
                        if(elementParent.firstChild){
                            elementParent.removeChild(elementParent.firstChild)
                        }
                    }
                }
            }
        }
    },
    beforeMount(){
        this.dateActu.tab = this.getDateWeek(new Date())

        // récupère l'évenement
        axios.get(`http://localhost:3000/api/Evenement/`+this.$route.params.id).then((response) => {
            console.log(response)
            var infoEvent = response.data;
            this.date = this.generateDateEvent(infoEvent.dateDebut, infoEvent.duree);
            this.event = infoEvent
            for(let i = 0;i<this.event.nombreMembreJury;i++){
                this.panelCreneau.jury.push(null)
            }
            
        })
        .catch(()=> { // pas trouvé 
            this.$router.push("/404"); // redirection 404
        });

        // récupère les profs
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
        });

        // récupère les créneaux
        axios.get(`http://localhost:3000/api/Evenement/`+this.$route.params.id+'/Creneau').then((response) => {
                var infoCreneau = response.data.creneaux;
                console.log(infoCreneau)
                let i = 0;
                let memoireId = 0;
                this.creneaux = [];
                while(i < infoCreneau.length){
                    if(memoireId == infoCreneau[i].numCreneau){ // on l'a déjà traité mais il y a une info en plus (autres profs)
                        console.log(infoCreneau[i].numCreneau)
                        var j = 0;
                        while(this.creneaux[this.creneaux.length-1].jury[j] != null){ // tant que les cases du tableau ne sont pas vide, on continue
                            j++
                        } // on a trouvé la case qui est null
                        this.creneaux[this.creneaux.length-1].jury[j] = {idProf : infoCreneau[i].idProf, nomProf : infoCreneau[i].nomProf, prenomProf : infoCreneau[i].prenomProf} // ajout un nouveau prof
                    }
                    else{
                        memoireId = infoCreneau[i].numCreneau

                        let tabVideProf = []
                        for(let i = 0;i<this.event.nombreMembreJury;i++){
                            tabVideProf.push(null)
                        }
    
                        this.creneaux.push({
                            id : infoCreneau[i].numCreneau,
                            idTabCreneau : this.creneaux.length,
                            salle : infoCreneau[i].salle,
                            jury :  tabVideProf, // définit un tableau de jury de taille event.nombreMembreJury avec valeur = null
                            groupe : infoCreneau[i].idGroupe,
                            duree1h : this.event.dureeCreneau == "1_heure",
                            heureDebut: (infoCreneau[i].heureDebut % 1).toFixed(2).substring(2),
                            heureTotal : infoCreneau[i].heureDebut,
                            date : util.formatDate(infoCreneau[i].date),
                            supprimer : false,
                            tabFrereCren : null,
                        })

                        if(this.creneaux.length-2 >= 0 && this.creneaux[this.creneaux.length-2].date ===  this.creneaux[this.creneaux.length-1].date){ // si un créneau à déja été enregister
                            var heureFinal = this.event.dureeCreneau == "1_heure"? parseFloat(this.creneaux[this.creneaux.length-2].heureTotal) + 1.25 : parseFloat(this.creneaux[this.creneaux.length-2].heureTotal) + 1.75;
                            if(heureFinal > this.creneaux[this.creneaux.length-1].heureTotal){ // si le créneau fini après le début du nouveau créneau
                                if(this.creneaux[this.creneaux.length-2].tabFrereCren == null){ // n'avait pas de frère
                                    var tabFrere = [this.creneaux[this.creneaux.length-2],this.creneaux[this.creneaux.length-1]] // créer le tableau des frères
                                    this.creneaux[this.creneaux.length-2].tabFrereCren = tabFrere
                                    this.creneaux[this.creneaux.length-1].tabFrereCren = this.creneaux[this.creneaux.length-2].tabFrereCren
                                }
                                else{ // à déjà des frères
                                    this.creneaux[this.creneaux.length-2].tabFrereCren.push(this.creneaux[this.creneaux.length-1]) // on l'ajoute dans le tableau
                                    this.creneaux[this.creneaux.length-1].tabFrereCren = this.creneaux[this.creneaux.length-2].tabFrereCren // on l'ajout dans ses frères
                                }
                               
                            }
                        }

                        if(infoCreneau[i].idProf !== null){ // s'il y a un prof, on l'ajoute
                            this.creneaux[this.creneaux.length-1].jury[0] = {idProf : infoCreneau[i].idProf, nomProf : infoCreneau[i].nomProf, prenomProf : infoCreneau[i].prenomProf}
                        }

                        var instance = new ComponentClass({
                            propsData: {
                                creneau: this.creneaux[this.creneaux.length-1],
                                Dates : this.dateActu,
                                appelPanel : this.affichePanelCreneau,
                                SupprimeCreneau : this.SupprimeDirectCreneau,
                                DuppliquerCreneau : this.duppliqueCreneau,
                                Mode : this.panel
                            }
                        })
                        instance.$mount() // pass nothing
                        //this.$el.lastChild.childNodes[Math.floor(infoCreneau[i].heureDebut)-6].childNodes[new Date(infoCreneau[i].date).getDay()].appendChild(instance.$el)
                        this.$el.lastChild.childNodes[Math.floor(infoCreneau[i].heureDebut)-6].getElementsByClassName("j_"+new Date(infoCreneau[i].date).getDay())[0].appendChild(instance.$el)
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
    #panelModifCreneau{
        top:20%;
        position: fixed;
        width: 70%;
        margin-left: 15%;
        text-align: center;
        background: lightcyan;
        z-index: 99;
        padding: 15px;
        border: solid 2px lightgrey;

        #supprimer{
            margin-left :20px;
        }
    }
    #fond{
        position: fixed;
        width: 100vw;
        height: 100vh;
        background: lightgrey;
        z-index :98;
        opacity: 0.7;
        left: 0px;
        top: 0px;
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
        .dateActu{
            font-weight: bold;
            text-decoration: underline !important;
            border: 2px solid !important
        }
        
        .datePlanning,.selectDate{
            text-decoration: none;
            transition: all 0.5s ease;
            cursor: pointer;
            &:hover{
                background-color: white;
                text-decoration: underline;
            }
        }
        .notDatePlanning{
            background: repeating-linear-gradient( 45deg, blue 0px, blue 40px, black 40px, black 80px );
            color: white;
        }
    }

    #input-prof{
        padding: 10px;
        background: lightblue;
        margin: 10px;
    }



    /* Les animations d'entrée (« enter ») et de sortie (« leave »)  */
    /* peuvent utiliser différentes fonctions de durée et de temps.  */
    .slide-fade-enter-active {
        transition: all .3s ease;
    }
    .slide-fade-leave-active {
        transition: all .6s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */ {
        transform: translateX(10px);
        opacity: 0;

    }
</style>