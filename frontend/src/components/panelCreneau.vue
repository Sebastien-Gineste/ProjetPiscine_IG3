<template>
    <div id="panelModif">  
            <div id="panelSalleJury"> 
                <transition name="slide-fade-panel">
                    <div @click="removePanel()" id="fondModif" v-if="show"></div>
                </transition>
                <transition name="slide-fade-panel">
                    <div id="panelSalleJuryInput"  v-if="show && State.mode==='salles'" >
                            <h3>Gestion des salles</h3>
                            
                            <b-row class="my-1 gestionSalle">
                                    <b-form-input @keyup.enter="ajoutSalle()" id="NomGr" v-model="salle" type="text" required placeholder="Ajouter une nouvelle salle.."></b-form-input>
                                    <b-button id="ajout" @click="ajoutSalle()" type="button" variant="primary">Ajouter</b-button>
                            </b-row>

                            <div>
                                <h4>Liste des salles : </h4>
                                <div id="selectSalle">
                                    <b-form-radio  v-for="salle in Salle" class="radio" :key="salle" v-model="State.salleSelected" name="salle" :value="salle"><span @click="removeSalle(salle)">{{salle}}</span></b-form-radio>
                                </div>
                            </div>
                    </div>
                </transition>
                <transition name="slide-fade-panel">
                    <div id="panelSalleJuryInput"  v-if="show && State.mode==='jury'" >
                        <h3>Gestion des jurys</h3>

                        <b-form-group id="input-prof" label="Jury" label-for="input-jury">
                            <b-row class="my-1">
                                <b-col v-for="numJ in EventPlanning.nombreMembreJury" :key="numJ">  
                                    <b-form-select :id="'input-jury-'+numJ" v-model="jury[numJ-1]" required :options="Profs">
                                        <template #first>
                                            <b-form-select-option :value="null" disabled>Sélectionner un professeur</b-form-select-option>
                                        </template>
                                    </b-form-select>
                                </b-col>
                            </b-row>
                            <b-button id="ajout" @click="ajoutJury()" type="button" variant="primary">Ajouter</b-button>
                        </b-form-group> 

                        <div>
                            <h4>Liste des jurys : </h4>
                            <div id="selectSalle" class="jury">
                                <b-form-radio  v-for="(jury, idx) in Jury" class="radio" :key="idx" v-model="State.jurySelected" name="jury" :value="jury">
                                    <span @click="removeJury(idx)">{{printJury(idx)}}</span> 
                                    <input type="color" class="color-picker" v-model="couleur[idx]" name="color">
                                </b-form-radio>
                            </div>
                        </div>
                    </div> 
                </transition>
            </div> 
  
        <div :class="classToogleFleche" id="controlePanelRapide">
            <span></span>
            <i  @click="toggle" class="fas fa-chevron-circle-right"></i>
        </div>

        <div :class="[classToogle,focus('delete')]" id="panelToggleDelete">
            <i @click="changeMode('delete')" class="far fa-times-circle"></i>
            <span>Supprimer</span>
        </div>
        <div :class="[classToogle,focus('ajout')]" id="panelToggleUpdate">
            <i @click="changeMode('ajout')" class="fas fa-pencil-alt"></i>
            <span>Ajouter</span>
        </div>
        <div :class="[classToogle,focus('salles')]" id="panelToggleSalle">
            <i @click="changeMode('salles')" class="fas fa-map-marker"></i>
            <span>Salle <b-icon @click="showPanel('salles')" icon="menu-up" ></b-icon></span>
        </div>
        <div :class="[classToogle,focus('jury')]" id="panelToggleJury">
            <i @click="changeMode('jury')" class="fas fa-users"></i>
            <span>Jury <b-icon @click="showPanel('jury')" icon="menu-up" ></b-icon></span>
        </div>
    </div>
</template>


<script>
export default {
    props: {State: Object, Salle : Array,Couleur : Array, Jury : Array, EventPlanning : Object,Profs : Array, AjoutS : Function, AjoutJ : Function, RemoveS : Function, RemoveJ : Function},
    data(){
            var juryTab = []
            for(let i=0;i<this.EventPlanning.nombreMembreJury;i++){
                juryTab.push(null)
            }

            return{
                couleur: this.Couleur,
                cacher : false,
                show : false,
                panel : null,
                salle : "",
                jury : juryTab,
                salleSelected : ""
            }
    },
    computed : {
        /* propriété calculer qui retourne le nom d'une classe en fonction de la valeur du boolean (this.cacher)
         * Cette classe va déplacer le panel à droite afin de le caché.
        */
        classToogle(){
            if(this.cacher){
                return "decalePanel"
            }
            else{
                return ""
            }
        },
        /* propriété calculer qui retourne le nom d'une classe en fonction de la valeur du boolean (this.cacher)
        */
        classToogleFleche(){
            if(this.cacher){
                return "changePanelRapide"
            }
            else{
                return ""
            }
        },
    },
    methods : {
        /* Fonction qui permet de changer la valeur de (this.cacher) 
        */
        toggle(){
            this.cacher = !this.cacher
            if(this.cacher){
                this.State.mode = null    
            }
        },
        /* Fonction qui permet de changer la valeur de (this.Sate.mode) permettant d'effectuer des actions spécifique lors d'un clique sur un créneau 
        */
        changeMode(mode){
            if(this.State.mode != mode){
                this.State.mode = mode
            }
            else{
                this.State.mode = null
            }
        },
        /* Fonction qui permet d'appliquer une classe si l'utilisateur reclique sur un panel déjà sélectionner 
        */
        focus(mode){
            if(mode == this.State.mode){return "focus"}
            else{return ""}
        },
        /* Fonction qui permet d'ajouter une salle 
        */
        ajoutSalle(){
            if(this.AjoutS(this.salle)){
                this.salle = "" // on la remet à ""
            }
        },
        /* Fonction qui permet de supprimer une salle 
        */
        removeSalle(salle){
           this.RemoveS(salle)
        },
        /* Fonction qui compare des INT d'un tableau pour les mettres dans l'odre croissant
        */
        compare( a, b ) {
            if(a <b){
                return -1;
            }
            else if(a > b){
                return 1;
            }
            return 0;
        },
        /* Fonction qui permet d'ajouter un jury 
        */
        ajoutJury(){
            var tabJury = []
            for (var i = 0; i < this.jury.length; i++){
                tabJury.push(this.jury[i]);
            }
            if(this.AjoutJ(tabJury)){ // ça à ajouter => On remet à 0 
                var juryTab = []
                for(let i=0;i<this.EventPlanning.nombreMembreJury;i++){
                    this.jury[i] = this.Profs[this.jury[i]-1]
                    juryTab.push(null)
                }
                this.jury = juryTab
            }
        },
        /* Fonction qui permet de supprimer un jury 
        */
        removeJury(idJury){
            this.RemoveJ(idJury)
        },
        /* Fonction qui retourn un STRING contenant le résumer du jury du créneau 
        */
        printJury(idJury){
            var str = "";
            for(let i = 0; i <this.Jury[idJury].length; i++){
               str += this.Profs[this.Jury[idJury][i]-1].text + ", "
            }
            return str.substr(0,str.length-2)

        },
        /* Fonction qui permet d'afficher le panel de modif des salles ou des jury en fonction du mode 
        */
        showPanel(mode){
            if(mode === "jury" && this.State.mode === "jury" && !this.show){
                console.log("jury")
                this.show = true;
            }
            else if(mode === "salles" && this.State.mode === "salles" && !this.show){
                console.log("salles")
                this.show = true;
            }   
        },
        /* Fonction qui permet de désafficher le panel des salles/jurys
        */
        removePanel(){
             this.show = false // enlève le panel
        }
    }
    
}
</script>


<style lang="scss">

    .color-picker{
        margin-left: 5px;
    }

    #panelToggleDelete,#panelToggleUpdate,#panelToggleSalle,#panelToggleJury{
        position: fixed;
        z-index: 1;
        display: flex;
        flex-direction: column-reverse;
        align-items: center;
        right: -1px;
        background: white;
        border-bottom: 2px solid #30A5D6;
        border-left: 2px solid #30A5D6;
        transition: all 500ms ease;
    }
        
    #controlePanelRapide > *,#panelToggle > *,#panelToggleDelete > *,#panelToggleUpdate > *,#panelToggleSalle > *,#panelToggleJury > *{
        transition: all 500ms ease;
        color : #30A5D6;
    }

    #panelControle,#controlePanelRapide,#panelToggleSalle,#panelToggleJury,#flecheIndication,#flecheIndication i{
     transition: all 500ms ease;
    }

    i{
        cursor : pointer;
    }

    /* Gestion tout panel => petite flèche */

    #controlePanelRapide{
        cursor : pointer;
        position: fixed;
        padding: 4px;
        padding-left: 5px;
        z-index: 1;
        top: 31px;
        right: -3px;
        background: white;
        border: 2px solid #30A5D6;
        color :#30A5D6;
    }

    .changePanelRapide > *{
        position: relative;
    }

.changePanelRapide{
  top: 62px !important;

  span{
      right: -26px;
  }

  i{
      transform: rotate(180deg);
  }

}

.decalePanel{
  right: -72px !important;
}

#panelControle.decalePanel{
  right: -372px !important;
}
    /* supprime rapide */

#panelToggleDelete{
  padding: 2px;
  top: 65px;
  border-top: 2px solid #30A5D6;
}

#panelToggleDelete.visible{
  z-index: 5;
}

#panelToggleDelete i{
  font-size: 48px;
  margin-bottom: 5px;
  margin-top: 3px;
}

#panelToggleDelete span{
  font-size: 14px;
}

#panelToggleDelete i:hover{
  transform: rotate(180deg) scale(1.1);
  color : #ff4444;
}

#panelToggleDelete i:hover + span{
  color:#ff4444;
}

#panelToggleDelete.focus{
    i {
        transform: rotate(180deg) scale(1.1);
        color : #ff4444;
    }
    i + span{
          color:#ff4444;
    }
}

/* fin supprimer rapide */

/* ajout rapide */
#panelToggleUpdate{
  padding: 9px;
  border-top: 1px solid #30A5D6;
  top: 149px;
}

#panelToggleUpdate.visible{
  z-index: 5;
}

#panelToggleUpdate i{
  font-size: 48px;
  margin-bottom: 5px;
  margin-top: 3px;
}

#panelToggleUpdate span{
  font-size: 16px;
}

#panelToggleUpdate.focus{
    i.fa-pencil-alt{
          transform: rotate(90deg) scale(1.1);
          color : #fb3 ;
    }

    i.fa-pencil-alt + span{
        color : #fb3 ;
    }
}

#panelToggleUpdate i.fa-pencil-alt:hover{
  transform: rotate(90deg) scale(1.1);
  color : #fb3 ;
}

#panelToggleUpdate i.fa-pencil-alt:hover + span{
  color: #fb3 ;
}

/* fin ajout rapide */

/* ajout rapide salle */
#panelToggleSalle{
    padding: 5.5px;
    padding-left: 6.5px;
    padding-right: 6.5px;
    border-top: 2px solid #30A5D6;
    top: 244px;
}

#panelToggleSalle.visible{
  z-index: 5;
}

#panelToggleSalle i{
  font-size: 48px;
  margin-bottom: 5px;
  margin-top: 3px;
  transform: scale(0.9);
}

#panelToggleSalle span{
  font-size: 16px;
}

#panelToggleSalle.focus{
    i.fa-map-marker{
          transform: scale(1.2);
          color : rgb(104, 200, 85) ;
    }

    i.fa-map-marker + span{
        color : rgb(104, 200, 85) ;
    }
}

#panelToggleSalle i.fa-map-marker:hover{
  transform: scale(1.2);
  color : rgb(104, 200, 85);
}

#panelToggleSalle i.fa-map-marker:hover + span{
  color:rgb(104, 200, 85) ;
}

/* fin ajout rapide salle */

/* ajout rapide jury */
#panelToggleJury{
    padding: 4.5px;
    border-top: 2px solid #30A5D6;
    top: 337px; 
}

#panelToggleJury.visible{
  z-index: 5;
}

#panelToggleJury i{
  font-size: 48px;
  margin-bottom: 5px;
  margin-top: 3px;
}

#panelToggleJury span{
  font-size: 16px;
}

#panelToggleJury.focus{
    i.fa-users{
        transform: translateY(-5px) scale(0.9);
        color : rgb(14, 14, 176) ;
    }

    i.fa-users + span{
        color : rgb(14, 14, 176) ;
    }
}

#panelToggleJury i.fa-users:hover{
  transform: translateY(-5px) scale(0.9);
  color : rgb(14, 14, 176)  ;
}

#panelToggleJury i.fa-users:hover + span{
  color: rgb(14, 14, 176)  ;
}

/* fin ajout rapide jury */
.focus .bi-menu-up{
    transition: all 500ms ease;
}

.focus .bi-menu-up:hover{
    color : #fb3;
    cursor: pointer;
}

    .gestionSalle{
        display: flex;

        .form-control{
            margin-left: 30%;
            width: 30%;
        }

        .btn{
            width: 10%;
        }
    }
    
    #selectSalle{
        display: flex;
        .radio{
            margin-right: 2%;
        }
        &.jury{
            display: block;
        }

    }

    #panelSalleJuryInput{
        min-height: 50%;
        top:10%;
        position: fixed;
        width: 70%;
        margin-left: 15%;
        text-align: center;
        background: lightcyan;
        z-index: 100;
        padding: 15px;
        border: solid 2px lightgrey;

        h4{
            margin : 3%;
        }

        h3{
            padding: 10px;
        }

        h4 + div.jury{
            padding: 10px;
            max-height: 26vh;
            overflow-y: scroll;
            height: max-content;
        }

        span:hover{
            color: red;
        }
    }
    #fondModif{
        position: fixed;
        width: 100vw;
        height: 100vh;
        background: lightgrey;
        z-index :98;
        opacity: 0.7;
        left: 0px;
        top: 0px;
    }

    
    /* Les animations d'entrée (« enter ») et de sortie (« leave »)  */
    /* peuvent utiliser différentes fonctions de durée et de temps.  */
    .slide-fade-panel-enter-active {
        transition: all .3s ease;
        z-index: 100;
    }
    .slide-fade-panel-leave-active {
        transition: all .6s cubic-bezier(1.0, 0.5, 0.8, 1.0);
        z-index: 100;
    }
    .slide-fade-panel-enter, .slide-fade-panel-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */ {
        transform: translateX(10px);
        opacity: 0;
        z-index: 100;

    }

</style>