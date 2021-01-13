<template>
    <div id="planning">
        <h1 id="title_planning" >Planning de l'événement :  {{eventName}}<b-icon v-if="eventName===''" icon="arrow-counterclockwise" animation="spin-reverse" font-scale="1"></b-icon></h1>
        <b-alert  v-if="errorMessage.length > 0" variant="danger" show>{{this.errorMessage}}</b-alert>
        <Panel v-if="isAdmin() && event!==null" :Couleur="couleur" :State="panel" :Salle="salles" :Jury="jury" :EventPlanning="event" :Profs="profs" :AjoutS="PanelAjoutSalle" :AjoutJ="PanelAjoutJury" :RemoveS="PanelRemoveSalle" :RemoveJ="PanelRemoveJury"/>
        <div class="visuCreneau" v-if="currentVisu">
            <p :style="currentVisu.couleur"> 
                <b>{{currentVisu.id+" - "}}<b-badge v-if="currentVisu.testGroupe" variant="success">{{currentVisu.groupe}}</b-badge><span v-else class="groupCren">{{currentVisu.groupe}}</span></b>
                <br >{{currentVisu.profs}}
                <br><b-badge v-if="!currentVisu.salle" variant="warning">{{currentVisu.affichageSalle}}</b-badge> <span v-else>{{currentVisu.affichageSalle}}</span>
            </p>   
        </div>
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
                <b-col v-if="dateAffiche[0]"  @click="desaffiche(0)" :class="[date.indexOf(dateActu.tab[0]) != -1 ? 'datePlanning' : 'notDatePlanning',dateActu.tab[0] == new Date() ? 'dateActu' : '']" >Lundi : {{formatDate(dateActu.tab[0],"tableau")}}</b-col>
                <b-col v-if="dateAffiche[1]"  @click="desaffiche(1)" :class="[date.indexOf(dateActu.tab[1]) != -1 ? 'datePlanning' : 'notDatePlanning',dateActu.tab[1] == new Date() ? 'dateActu' : '']" >Mardi : {{formatDate(dateActu.tab[1],"tableau")}}</b-col>
                <b-col v-if="dateAffiche[2]"  @click="desaffiche(2)" :class="[date.indexOf(dateActu.tab[2]) != -1 ? 'datePlanning' : 'notDatePlanning',dateActu.tab[2] == new Date() ? 'dateActu' : '']" >Mercredi : {{formatDate(dateActu.tab[2],"tableau")}}</b-col>
                <b-col v-if="dateAffiche[3]"  @click="desaffiche(3)" :class="[date.indexOf(dateActu.tab[3]) != -1 ? 'datePlanning' : 'notDatePlanning',dateActu.tab[3] == new Date() ? 'dateActu' : '']" >Jeudi : {{formatDate(dateActu.tab[3],"tableau")}}</b-col> 
                <b-col v-if="dateAffiche[4]"  @click="desaffiche(4)" :class="[date.indexOf(dateActu.tab[4]) != -1 ? 'datePlanning' : 'notDatePlanning',dateActu.tab[4] == new Date() ? 'dateActu' : '']" >Vendredi : {{formatDate(dateActu.tab[4],"tableau")}}</b-col> 
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
            <b-row id="heure13" >
                <b-col cols="1" >13h</b-col>
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
                <b-col class="selectDate" :class="dateAffiche[0]? 'bg-info' : 'bg-dark text-white'"  @click="desaffiche(0)">Lundi</b-col>
                <b-col class="selectDate" :class="dateAffiche[1]? 'bg-info' : 'bg-dark text-white'"  @click="desaffiche(1)">Mardi </b-col>
                <b-col class="selectDate" :class="dateAffiche[2]? 'bg-info' : 'bg-dark text-white'"  @click="desaffiche(2)">Mercredi</b-col>
                <b-col class="selectDate" :class="dateAffiche[3]? 'bg-info' : 'bg-dark text-white'"  @click="desaffiche(3)">Jeudi</b-col> 
                <b-col class="selectDate" :class="dateAffiche[4]? 'bg-info' : 'bg-dark text-white'"  @click="desaffiche(4)">Vendredi</b-col> 
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
import { mapGetters } from 'vuex'
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
            date : [],
            event : null,
            dateActu : { tab : []},
            dateAffiche : [true,true,true,true,true],
            errorMessage : "",
            show : false,
            currentCreneau : null,
            currentVisu : null,
            salles : [],
            couleur : ['#007bff','#dc3545','#28a745','#fd7e14','#ffc107','#6f42c1','#e83e8c','#20c997','#17a2b8'],
            profs : [],
            jury : [],
            bdProfs : null,
            panel : {mode : null, salleSelected : null, jurySelected : null},
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
    computed:{
        eventName(){
            return this.event? this.event.nomEvenement : ""
        }
    },
    methods : {
        ...mapGetters(['isUser','isAdmin','getIdEvent','hasGroup','getGroup']),
        afficheVisuCreneau(visu){
            this.currentVisu = visu
        },
        quitVisuCreneau(){
            this.currentVisu = null
        },
        createCreneau(e){
            /* e : Object = évenement de l'élément qui à lancé la fonction avec @dbclick sur un emplacement du planning vide
             * => Génère un créneau avec les valeurs de base et l'enregistre dans la BD
            */
            if(this.isAdmin() && e.target.classList[1]){
                var jour = this.dateActu.tab[parseInt(e.target.classList[1].substr(2))-1] 
                var heure = e.target.parentElement.id.substr(5)
                console.log("j = "+jour+" heure = "+heure);
                if(this.date.indexOf(jour) !== -1){
                    console.log("good")
                    var newCreneau = {
                        date: jour,
                        duree1h: this.event.dureeCreneau == "1_heure",
                        groupe: null,
                        heureDebut: "00",
                        heureTotal: heure,
                        id: -1,
                        jury: [],
                        salle: null,
                        supprimer: false,
                        tabFrereCren: null,
                    }
                    for(let i = 0;i<this.event.nombreMembreJury;i++){  
                        newCreneau.jury.push(null) 
                    }
                    this.creneaux.push(newCreneau); // on l'ajoute
                    var newCre = this.creneaux[this.creneaux.length-1]
                    this.calculConcordanceCreneau(new Date(newCreneau.date))
                    this.genererCreneau()

                    // appel AXIOS
                    this.axiosCreate(newCreneau,this.creneaux.indexOf(newCre));
                }
                else{
                    console.log("on peut pas") // il a cliqué sur un jour qui ne fait pas partie de la durée de l'évenement
                }
            }
        },
        /* fonction lancé par le component panelCreneau.vue
        *  salle : String
        * => Ajoute la salle dans l'attribut this.salles si elle n'est pas déjà présente.
        */
        PanelAjoutSalle(salle){
                console.log(salle)
                if(salle != "" && this.salles.indexOf(salle) === -1){
                    this.salles.push(salle)
                    return true
                }
                else{
                    return false
                }
        },
        /* fonction annexe lancé par la fonction PanelAjoutJury.
        *  a : Int
        *  b : Int
        * Elle permet de mettre les tuteurs dans l'ordre de leur id.
        */
        compareJury( a, b ) {
            if(a <b){
                return -1;
            }
            else if(a > b){
                return 1;
            }
            return 0;
        },
        /* fonction lancé par le component panelCreneau.vue
        *  Jury : [Int]
        *  beforeMount : Bool
        *  Vérifie si on peut ajouter le jury donnée en parmètre. La fonction vérifie notamment si le jury n'est pas déjà présent où s'il contient 2 même tuteurs.
        *  Elle renvoie true si elle l'a jouter et False sinon.
        */
        PanelAjoutJury(jury, beforeMount=false){
                console.log(jury)
                var ajout = true
                var exact = true;
                for(let i=0;i<jury.length;i++){ // vérifie non null 
                    if(jury[i] === null){
                        ajout = false
                    }
                }
                for(let i=0;i<jury.length;i++){ // vérifie  différent
                    for(let j=0;j<jury.length;j++){ 
                        if(jury[i] === jury[j] && i != j){
                            ajout = false
                        }
                    }
                }
                if(ajout){ // vérifie pas déjà présent
                    jury.sort(this.compareJury) // met les profs dans l'odre
                    for(let i=0;i<this.jury.length;i++){ // pour chaque jury on regarde si c'est le même
                        let same = 0
                        for(let j=0;j<jury.length;j++){ 
                            if(this.jury[i][j] === jury[j]){
                                same++
                            }
                        }
                        if(same === jury.length){ // pareil
                            exact = false
                        }
                    }
                    if(exact){
                        this.jury.push(jury)
                        if(this.couleur.length < this.jury.length){ // faut rajouter une couleur
                            this.couleur.push("#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);}))
                        }
                        return true
                    }
                    else{
                        if(!beforeMount){util.makeToast(this,"warning","Attention !","Le jury est déjà présent ! :)")}
                        return false
                    }
                }
                else{
                    if(!beforeMount){util.makeToast(this,"warning","Attention !","Le jury ne peut pas être composé de plusieurs occurences d'un professeur !")}
                    return null
                }
        },
        /* fonction lancé par le component panelCreneau.vue
        *  salle : String
        *  Supprime la salle de l'attribut this.salles si elle existe.
        */
        PanelRemoveSalle(salle){
            if(this.isAdmin()){
                console.log(salle)
                var id = this.salles.indexOf(salle)
                if(id !== -1){
                    this.salles.splice(id,1)
                }
            }
        },
        /* fonction lancé par le component panelCreneau.vue
        *  idJury : Int
        *  Supprime le jury de l'attribut this.jury s'il existe.
        */
        PanelRemoveJury(idJury){
            if(this.isAdmin()){
                console.log(idJury)
                this.jury.splice(idJury,1)
            }
        },
        /* fonction lancé par le component creneau.vue lorsque l'utilisateur clique dessus et que this.mode = "jury" OU quand l'utilisateur le modifie directement sur le formulaire du créneau
        *  creneau : Object // créneau sur lequel on a appuyé
        *  jury : [Int] // tableau des ID des tuteurs
        *  affichage : Bool  // Permet de savoir si on affiche un toast ou pas
        *  Ajoute le Jury au créneau et l'enregistre dans la BD
        */  
        ajoutJury(creneau, jury, affichage = true){
            console.log(jury)
            if(this.isAdmin() && jury !== null){
                console.log("jury ajout"+creneau)
                var newJury = []
                for(let i = 0;i<this.event.nombreMembreJury;i++){ // on remet à null
                    if(jury[i]){
                        newJury.push(this.bdProfs[jury[i]-1]) // on cherche le profs dans la sélection de tous les profs
                    }
                    else{
                        newJury.push(null)
                    }
                }
                var idC = this.creneaux.indexOf(creneau)
                console.log(idC)
                this.creneaux[idC].jury = newJury
                if(affichage){
                    util.makeToast(this,"success","Enregister","Jury ajouter ! :)")
                }
                // appel AXIOS
                this.axiosUpdate({type : "jury", id :  this.creneaux[idC].id, jury : newJury});
            }
           
        },
        /* fonction lancé par le component creneau.vue lorsque l'utilisateur clique dessus et que this.mode = "salle" OU quand l'utilisateur le modifie directement sur le formulaire du créneau
        *  creneau : Object // créneau sur lequel on a appuyé
        *  salle : String
        *  affichage : Bool  // Permet de savoir si on affiche un toast ou pas
        *  Ajoute la salle au créneau et l'enregistre dans la BD
        */  
        ajoutSalle(creneau, salle, affichage = true){
            console.log(salle)
            if(this.isAdmin() && salle){
                var idC = this.creneaux.indexOf(creneau)
                this.creneaux[idC].salle = salle
                if(affichage){
                    util.makeToast(this,"success","Enregister","Salle ajouter ! :)")
                }
                // appel AXIOS
                this.axiosUpdate({type : "salle", id : this.creneaux[idC].id, salle : salle});
            }
        },
        /* fonction lancé par le component creneau.vue lorsque l'étudiant clique dessus et que this.mode = "inscription"
        *  creneau : Object // créneau sur lequel on a appuyé
        *  Ajoute le groupe de l'étudiant au créneau
        */  
        inscriptionGroup(creneau){
            if(creneau.groupe === null){ // n'a pas déjà un groupe
                if(this.hasGroup()){ // il a eu groupe
                    var dateActu = new Date();
                    if(dateActu <= new Date(this.event.dateLimiteResa)){
                        var modif = {id : creneau.id, idGroupe : this.getGroup() };
                        axios.put("http://localhost:3000/api/Evenement/"+this.$route.params.id+"/Creneau/"+creneau.id+"/Inscription", modif)
                        .then((reponse) => {
                            var data = reponse.data;
                            if(data.otherCreneau){ // On avait déjà réserver un créneau, on le remet à null
                                var i = 0
                                while(i < this.creneaux.length){
                                    console.log("InscriptGroup")
                                    if(this.creneaux[i].groupe == data.otherCreneau){
                                        this.creneaux[i].groupe = null
                                    }
                                }
                            }
                            creneau.groupe = this.getGroup(); // met le groupe de l'étudiant 
                        })
                        .catch((error) => console.log(error))          
                    }
                    else{
                        util.makeToast(this,"danger","Erreur","Vous ne pouvez plus réserver pour les soutenances, la date de limite est dépassée !") 
                    }
                }
                else{
                    util.makeToast(this,"warning","Erreur","Vous ne pouvez pas vous inscrire si vous n'avez pas de groupe !") 
                }
            }
            else{
                if(!creneau.groupe == this.getGroup()){
                    util.makeToast(this,"warning","Erreur","Vous ne pouvez pas voler le créneau de quelqu'un d'autre !") 
                }
            }
        },
        /* fonction lancé par le component creneau.vue lorsque l'utilisateur clique dessus et que this.mode = "ajout"
        *  creneau : Object // créneau sur lequel on a appuyé
        *  Ajoute un nouveau creneau ayant les mêmes propriétés que le créneau passé en paramètre (sauf groupe, salle et jury)
        */  
        duppliqueCreneau(creneau){
            if(this.isAdmin()){
                console.log(creneau)
                var newCreneau = {
                    date: creneau.date,
                    duree1h: creneau.duree1h ,
                    groupe: creneau.groupe ,
                    heureDebut: creneau.heureDebut,
                    heureTotal: creneau.heureTotal,
                    id: -1,
                    jury: [],
                    salle: null,
                    supprimer: false,
                    tabFrereCren: [],
                }
                var id = this.creneaux.indexOf(creneau)+1
                this.creneaux.splice(this.creneaux.indexOf(creneau)+1, 0, newCreneau); // on le rajoute juste après le créneau duppliquer

                for(let i = 0;i<creneau.jury.length;i++){  
                    this.creneaux[id].jury.push(null) 
                }
                // appel AXIOS
                this.axiosCreate(newCreneau,id);
                this.calculConcordanceCreneau(new Date(newCreneau.date))
                setTimeout(this.genererCreneau,50)
            }
        },
        /* fonction lancé par le component creneau.vue lorsque l'utilisateur clique dessus et que this.mode = "remove"
        *  creneau : Object // créneau sur lequel on a appuyé
        *  Supprime le créneau de la BD
        */  
        SupprimeDirectCreneau(creneau){ // clique sur un créneau avec l'option supprime
            if(this.isAdmin()){
                console.log("creneau")
                this.affichePanelCreneau(creneau)
                this.show = false
                this.supprimerCreneau()
            }
        },
        /* fonction lancé par le component creneau.vue lorsque l'utilisateur clique dessus et que this.mode = null
        *  creneau : Object // créneau sur lequel on a appuyé
        *  funcSalle : Function du component créneau permettant de savoir si on la salle est déjà présente
        *  funcJury : Function du component créneau permettant de savoir si on le jury est déjà présent
        *  Affiche un panel contenant un formulaire avec toutes les infos du créneau avec la possibilité les modifier.
        */  
        affichePanelCreneau(creneau, funcSalle, funcJury){
            if(this.isAdmin()){
                console.log(creneau)
                this.currentCreneau = creneau
                this.panelCreneau = {
                    idEvent : this.event.numEvenement,
                    id : creneau.id,
                    salle : creneau.salle,
                    dateCreneau : creneau.date,
                    heureDebut : creneau.heureTotal,
                    groupe : creneau.groupe,
                    funcSalle : funcSalle,
                    funcJury : funcJury,

                }
                
                this.panelCreneau.jury = []
                for(let i = 0;i<creneau.jury.length;i++){  // met l'id des profs dans le tableau de jury du panelCreneau
                    creneau.jury[i] !== null ?  this.panelCreneau.jury.push(creneau.jury[i].idProf) : this.panelCreneau.jury.push(null)
                }

                this.show = true
            }
        },
        /* fonction lancé lorsque l'utilisateur clique autour du panel contenant le formulaire d'un créneau
        *  La fonction cache le panel en remettant this.panelCreneau à son état initiale. 
        */  
        removePanel(){
            if(this.isAdmin()){
                this.show = false // enlève le panel
                this.currentCreneau = null
                for(let i = 0;i<this.event.nombreMembreJury;i++){ // on remet à null
                    this.panelCreneau.jury[i] = null
                }
                this.panelCreneau = {id : null,heureMin : 8, dateCreneau : null,salle : null,groupe : null} // rénitialise le formulaire du créneau
            }
        },
        /* fonction lancé lorsque l'utilisateur clique sur le bouton "enregistrer" du panel contenant le formulaire du créneau sélectionné.
        *  La fonction ajoute la salle, le jury et les autres propriété du créneau s'ils sont différents et l'enregistre dans la BD. 
        */ 
        enregistrerCreneau(){
            if(this.isAdmin()){
                var AncienneDate = this.currentCreneau.date
                var newJury = []
                for(let i = 0;i<this.panelCreneau.jury.length; i++){
                    newJury.push(this.panelCreneau.jury[i])
                }
                var affichage = true;
                if(this.currentCreneau.salle !== this.panelCreneau.salle){
                    if(this.panelCreneau.salle == ""){
                        this.currentCreneau.salle = null;                
                    }
                    else if(!this.panelCreneau.funcSalle(this.panelCreneau.salle)){ // on peut changer 
                        this.currentCreneau.salle = this.panelCreneau.salle
                        // appel AXIOS
                        this.PanelAjoutSalle(this.currentCreneau.salle);
                        this.axiosUpdate({type : "salle", id : this.currentCreneau.id, salle : this.currentCreneau.salle});
                    }
                    else{
                        util.makeToast(this,"warning","Attention !","La salle est sur 2 créneaux dans la même plage horaire ! :(")
                        affichage = false
                    }
                }
            
                this.currentCreneau.groupe = this.panelCreneau.groupe
                this.currentCreneau.heureDebut = (this.panelCreneau.heureDebut % 1).toFixed(2).substring(2)

                var relancer = false;
                relancer = this.currentCreneau.date !== this.panelCreneau.dateCreneau || Math.floor(this.currentCreneau.heureTotal) !== Math.floor(this.panelCreneau.heureDebut)

                this.currentCreneau.heureTotal = this.panelCreneau.heureDebut
                this.currentCreneau.date = util.formatDate(this.panelCreneau.dateCreneau)
                console.log("jury")
                console.log(newJury)
                if(newJury[0]){ 
                    if(!this.panelCreneau.funcJury(newJury)){// on peut changer 
                        if(this.PanelAjoutJury(newJury,true) !== null){ // ajout dans les jurys (il retourne null s'il y a plusieurs occurence d'un prof dans le jury)
                            this.ajoutJury(this.currentCreneau, newJury, false);
                        }
                        else{
                            util.makeToast(this,"warning","Attention !","Il manque un jury ou un enseignant est répété plusieurs fois ! :(")
                            affichage = false
                        }
                    }
                    else{
                            util.makeToast(this,"warning","Attention !","Un des membres du jury est sur 2 créneaux dans la même plage horaire ! :(")
                            affichage = false
                    }
                }
                this.calculConcordanceCreneau(new Date(this.currentCreneau.date), new Date(AncienneDate)) // on calcul la concordance avec les autres créneaux
                // appel axios
                this.axiosUpdate({type : "update", id : this.currentCreneau.id, heureDebut : this.currentCreneau.heureTotal, date :  this.currentCreneau.date});

                if(affichage){
                    util.makeToast(this,"success","Enregister","Votre modification a été enregistré ! :)")
                }
                if(relancer){
                    this.genererCreneau()
                }
                setTimeout(this.removePanel,50)
            }            
        },
        /* fonction lancé lorsque l'utilisateur clique sur le bouton "supprimer" du panel contenant le formulaire du créneau sélectionné. Ou par la fonction this.SupprimerDirectCreneau
        *  La fonction supprime le créneau de la BD.
        */ 
        supprimerCreneau(){
            if(this.isAdmin()){
                this.currentCreneau.supprimer = true;
                var id = this.currentCreneau.id;
                var idTab = this.creneaux.indexOf(this.currentCreneau)
                this.creneaux.splice(idTab, 1) // l'enlève du tableau des créneaux
                this.calculConcordanceCreneau(new Date(this.currentCreneau.date))
                // appel AXIOS
                this.axiosDelete(id) // remove dans la BD
                util.makeToast(this,"success","Supprimer","Le créneau a été supprimé ! :)")
                this.removePanel();
            }
        },
        /* fonction permettant de retourner un format spéciale pour la date donnée en paramètre
        *  d : Object (Date js)
        *  type : String
        */ 
        formatDate(d, type="normal"){
            return util.formatDate(d,type)
        },
        /* fonction permettant d'enlèver les weekend du module datePicker permettant de sélectionner une date.
        *  date : Object
        */
        dateDisabled(ymd, date) { // enlève les weekend du datePicker
            const weekday = date.getDay()
            return weekday === 0 || weekday === 6
        },
        /* fonction permettant de désafficher les jours qui ont un numéro différent de id. (lorsque l'utilisateur clique sur "lundi" par exemple) Ou de tout réafficher si on est déjà dans cet état
        *  id : Int // représente le numéro du jour {0,1,2,3,4,5,6} 0 = dimmanche, 1 : = lundi ....
        *  
        */
        desaffiche(id){
            var dejaDesafficher = false
            for(let i = 0;i<this.dateAffiche.length;i++){
                if(id != i && this.dateAffiche[i]){dejaDesafficher = true }  
            }

            if(dejaDesafficher && this.date.indexOf(this.dateActu.tab[id]) != -1){
                this.dateAffiche[id] = true
                for(let i = 0;i<this.dateAffiche.length;i++){
                    if(id != i){ this.dateAffiche[i] = false}  
                }
                this.dateActu.tab = this.getDateWeek(new Date(this.dateActu.tab[0]))
                setTimeout(this.genererCreneau,50)
            }
            else if(!dejaDesafficher){
                for(let i = 0;i<this.dateAffiche.length;i++){
                    this.dateAffiche[i] = true
                }
                this.dateActu.tab = this.getDateWeek(new Date(this.dateActu.tab[0]))
                setTimeout(this.genererCreneau,50)
            }
        },
        /* fonction permettant de générer les dates de l'événement 
        *  DateDébut : String // représentant une date
        *  DureeE : Int // durée de l'événement
        *  return les dates de tout l'évenement
        */
        generateDateEvent(DateDebut,DureeE){
            var tabDate = []
            var i = 0
            var dateActu = new Date(DateDebut)
            while(i < DureeE){
                console.log("While geneDateEvent")
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
        /* fonction permettant de générer les dates de la semaine du jour entrée en paramètre
        *  dateActu : String // représentant une date
        */
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
        /* fonction permettant d'aller à la prochaine semaine de l'évenement (s'il n'y en a plus, elle informe l'utilisateur)
        */
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
        /* fonction permettant d'aller à la semaine précédente de l'évenement (s'il n'y en a plus, elle informe l'utilisateur)
        */
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
        /* fonction permettant d'aller à la semaine prochaine sur le planning
        */
        nextWeek(){
            var lastDay = new Date(this.dateActu.tab[6]);
            lastDay.setDate(lastDay.getDate() + 1)
            this.dateActu.tab = this.getDateWeek(lastDay)
        },
        /* fonction permettant d'aller à la semaine précédente sur le planning
        */
        prevWeek(){
            var prevDay = new Date(this.dateActu.tab[0]);
            prevDay.setDate(prevDay.getDate() - 1)
            this.dateActu.tab = this.getDateWeek(prevDay)
        },
        /* fonction permettant de supprimer tous les éléments créneau de la page web (afin de pouvoir les récréer)
        */
        suppAllCreneau(){
            while(this.$el.getElementsByClassName("creneau").length > 0){
                console.log("Sup all creneau")
                this.$el.getElementsByClassName("creneau")[0].remove()
            }
        },
        /* fonction permettant de regénérer les éléments des créneaux sur la page web. 
        */
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
                                AjoutJury : this.ajoutJury,
                                AjoutSalle : this.ajoutSalle,
                                Inscription : this.inscriptionGroup,
                                GestionCouleur : {jury : this.jury, couleur : this.couleur},
                                Visualisation : {affiche : this.afficheVisuCreneau, quitte : this.quitVisuCreneau},
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
        },
         /* fonction permettant de comparer un tableau d'événement afin qu'ils soit classés dans leur ordre temporel.
         * a ,b :  Object  // représentant un événement
        */
        compare( a, b ) {
            if(new Date(a.date) < new Date(b.date)){
                return -1;
            }
            else if(new Date(a.date) > new Date(b.date)){
                return 1;
            }
            else if(a.date === b.date){ // même date on compare leurs heure de début
                if(parseFloat(a.heureTotal) < parseFloat(b.heureTotal)){
                    return -1;
                }
                if(parseFloat(a.heureTotal) > parseFloat(b.heureTotal)){
                    return 1 ;
                }
                return 0;
            }
         
        },
        /* fonction permettant de recalculer les créneaux ayant la même plage horraire afin de pouvoir les affiches plus petit sur le planning afin qu'ils ne se superposent pas 
         * date : Object (Date) //  date du jour où on a fait la modification de la temporalité du créneau
         * secondeDate : Object (Date) // Si on modif le jour d'un créneau, il faut recalculé la temporalité des créneaux des 2 jours
        */
        calculConcordanceCreneau(date, secondeDate = date){ // date de la modification
            this.creneaux.sort(this.compare) // on met le tableau dans l'ordre
            // on regarde les frères
            let i = 0;
            while(i<this.creneaux.length && (new Date(this.creneaux[i].date) <= date || new Date(this.creneaux[i].date) <= secondeDate )){ // tant que le tableau n'est pas fini et qu'on est inférieur ou égale à la date
                console.log("Concordance creneau")
                if(this.creneaux[i].date === this.formatDate(date) || this.creneaux[i].date === this.formatDate(secondeDate)){ // si la date est égale on calcul
                    this.creneaux[i].tabFrereCren = null // on met son tableau de frère à null
                    if(i > 0 && this.creneaux[i-1].date === this.creneaux[i].date){ // si un créneau à déja passé la boucle et qu'il est de même date
                        let heureFinal = this.event.dureeCreneau == "1_heure"? parseFloat(this.creneaux[i-1].heureTotal) + 1.25 : parseFloat(this.creneaux[i-2].heureTotal) + 1.75;
                        if(heureFinal > this.creneaux[i].heureTotal){ // si le créneau fini après le début du nouveau créneau
                            if(this.creneaux[i-1].tabFrereCren == null){ // n'avait pas de frère
                                let tabFrere = [this.creneaux[i-1],this.creneaux[i]] // créer le tableau des frères
                                this.creneaux[i-1].tabFrereCren = tabFrere
                                this.creneaux[i].tabFrereCren = this.creneaux[i-1].tabFrereCren
                            }
                            else{ // à déjà des frères
                                this.creneaux[i-1].tabFrereCren.push(this.creneaux[i]) // on l'ajoute dans le tableau
                                this.creneaux[i].tabFrereCren = this.creneaux[i-1].tabFrereCren // on l'ajout dans ses frères
                            }
                            
                        }
                    }
                }
                i++;
            }
            console.log(" i = "+i)
        },
        /* fonction permettant de lancer un appel axios POST (requête HTTP) au backend, enregisterant ainsi le creneau en paramètre dans la BD
         * creneau : Object // contenant le nouveau créneau à créer
         * id : Int // contenant l'id du créneaux dans le tableaux this.creneaux (contenant tous les créneaux de l'évenement)
        */
        axiosCreate(creneau,id){
            if(this.isAdmin()){
                axios.post("http://localhost:3000/api/Evenement/"+this.$route.params.id+"/Creneau/",{date : creneau.date ,groupe : creneau.groupe, salle : creneau.salle, heureTotal : creneau.heureTotal}).then((response)=> {
                this.creneaux[id].id = response.data.data.numCreneau;
                })
                .catch((error) => console.log(error))
            }
        },
        /* fonction permettant de lancer un appel axios PUT (requête HTTP) au backend, enregisterant ainsi la modification du creneau en paramètre dans la BD
         * creneau : Object // contenant les modifications du créneau
        */
        axiosUpdate(creneau){
            if(this.isAdmin()){
                axios.put("http://localhost:3000/api/Evenement/"+this.$route.params.id+"/Creneau/"+creneau.id, creneau).catch((error) => console.log(error))
            }
        },
        /* fonction permettant de lancer un appel axios DELETE (requête HTTP) au backend, supprimant le creneau en paramètre dans la BD
         * idCreneau : Int // contenant l'id du créneau
        */
        axiosDelete(idCreneau){ // supprimer le créneau dans la BD
            if(this.isAdmin()){
                axios.delete("http://localhost:3000/api/Evenement/"+this.$route.params.id+"/Creneau/"+idCreneau).catch((error) => console.log(error))
            }
        }
    },
    /* fonction appellé avant que le HTML soit générer (dans la partie template de la vue)
     * Elle va :
     *      - Mettre les dates de la semaine actuelle dans this.dateActu
     *      - Récupèrer les informations de l'événement grâce à l'id contenant dans le lien
     *      - Récupèrer les profs de la BD afin de pouvoir les sélectionner lorsqu'on modifie un créneau
     *      - Récupèrer tous les créneaux et les intégrer dans le HTML (template)
    */
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

            // récupère les créneaux
            axios.get(`http://localhost:3000/api/Evenement/`+this.$route.params.id+'/Creneau').then((response) => {
                var infoCreneau = response.data.creneaux;
                console.log(infoCreneau)
                let i = 0;
                this.creneaux = [];
                while(i < infoCreneau.length){
                    
                    let tabVideProf = []
                    for(let i = 0;i<this.event.nombreMembreJury;i++){
                        tabVideProf.push(null)
                    }
                    this.creneaux.push({
                        id : infoCreneau[i].numCreneau,
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

                    if( infoCreneau[i].salle !== null){
                        this.PanelAjoutSalle(infoCreneau[i].salle);
                    }

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

                    while(i < infoCreneau.length-1 && infoCreneau[i].numCreneau === infoCreneau[i+1].numCreneau){ // tant qu'on a des profs à rentré dans son jury 
                       
                        i++;
                        var j = 0;
                        console.log(this.creneaux[this.creneaux.length-1].jury.length)
                        while(this.creneaux[this.creneaux.length-1].jury.length > j && this.creneaux[this.creneaux.length-1].jury[j] !== null){ // tant que les cases du tableau ne sont pas vide, on continue
                            j++
                        } // on a trouvé la case qui est null
                        this.creneaux[this.creneaux.length-1].jury[j] = {idProf : infoCreneau[i].idProf, nomProf : infoCreneau[i].nomProf, prenomProf : infoCreneau[i].prenomProf} // ajout un nouveau prof
                        if(j === this.event.nombreMembreJury-1){ // on a rentré le dernier prof du jury
                            var tabJury = []
                            for(let k = 0;k<this.event.nombreMembreJury;k++){
                                tabJury.push(this.creneaux[this.creneaux.length-1].jury[k].idProf)
                            }
                            this.PanelAjoutJury(tabJury,true); // on l'ajoute au tableau de jury
                        }
                    }

                    var instance = new ComponentClass({
                        propsData: {
                            creneau: this.creneaux[this.creneaux.length-1],
                            Dates : this.dateActu,
                            appelPanel : this.affichePanelCreneau,
                            SupprimeCreneau : this.SupprimeDirectCreneau,
                            DuppliquerCreneau : this.duppliqueCreneau,
                            AjoutJury : this.ajoutJury,
                            AjoutSalle : this.ajoutSalle,
                            Inscription : this.inscriptionGroup,
                            GestionCouleur : {jury : this.jury, couleur : this.couleur},
                            Visualisation : {affiche : this.afficheVisuCreneau, quitte : this.quitVisuCreneau},
                            Mode : this.panel
                        }
                    })
                    instance.$mount() // pass nothing
                    //this.$el.lastChild.childNodes[Math.floor(infoCreneau[i].heureDebut)-6].childNodes[new Date(infoCreneau[i].date).getDay()].appendChild(instance.$el)
                    this.$el.lastChild.childNodes[Math.floor(infoCreneau[i].heureDebut)-6].getElementsByClassName("j_"+new Date(infoCreneau[i].date).getDay())[0].appendChild(instance.$el)
                    i++;
                }        
                if(this.isUser() && !this.isAdmin()){ // étudiant
                    this.panel.mode = "inscription";
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
            if(error.response.status == '403'){ // pas autorisé 
                console.log(error.response.data)
            }
        });
    }
    
}
</script>


<style lang="scss">
    .visuCreneau{
        position: fixed;
        top:0px;
        left:0px;
        width:15vw;
        padding : 10px;
        z-index: 95;
        background-color: white;
        border : solid 0.5px grey;
        border-radius: 15px;
        border-top-left-radius: 0px;

        p{
            border-radius: 15px;
            border-top-left-radius: 0px;
        }
        
    }
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
        .bg-info{
            background-color: #B2EBF2 !important;
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