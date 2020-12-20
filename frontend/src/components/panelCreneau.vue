<template>
    <div id="panelModif">
        <div :class="classToogleFleche" id="controlePanelRapide">
            <span></span>
            <i  @click="toggle" class="fas fa-chevron-circle-right"></i>
        </div>

        <div :class="[classToogle,focusD]" id="panelToggleDelete">
            <i @click="modeSupp" class="far fa-times-circle"></i>
            <span>Supprimer</span>
        </div>
        <div :class="[classToogle,focusA]" id="panelToggleUpdate">
            <i @click="modeAjout" class="fas fa-pencil-alt"></i>
            <span>Ajouter</span>
        </div>
    </div>
</template>


<script>
export default {
    props: {State: Object},
    data(){
            return{
                cacher : false,
                focusDelete : false,
                focusAjoute : false

            }
    },
    computed : {
        classToogle(){
            if(this.cacher){
                return "decalePanel"
            }
            else{
                return ""
            }
        },
        classToogleFleche(){
            if(this.cacher){
                return "changePanelRapide"
            }
            else{
                return ""
            }
        },
        focusD(){
            if(this.focusDelete){return "focus"}
            else{return ""}
        },
        focusA(){
            if(this.focusAjoute){return "focus"}
            else{return ""}
        }
    },
    methods : {
        toggle(){
            this.cacher = !this.cacher
            if(this.cacher){
                this.State.mode = null
                this.focusAjoute = false
                this.focusDelete = false     
            }
        },
        modeSupp(){
            if(this.focusAjoute){
                this.focusAjoute = false
            }
            this.focusDelete = !this.focusDelete
            if(this.focusDelete){
                this.State.mode = "delete"
            }
            else{
                this.State.mode = null
            }
        },
        modeAjout(){
            if(this.focusDelete){
                this.focusDelete = false
            }
            this.focusAjoute = !this.focusAjoute
            if(this.focusAjoute){
                this.State.mode = "ajout"
            }
            else{
                this.State.mode = null
            }
      
        }
    }
    
}
</script>


<style lang="scss">

    #panelToggleDelete,#panelToggleUpdate{
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
        
    #controlePanelRapide > *,#panelToggle > *,#panelToggleDelete > *,#panelToggleUpdate > *{
        transition: all 500ms ease;
        color : #30A5D6;
    }

    #panelControle,#controlePanelRapide,#flecheIndication,#flecheIndication i{
     transition: all 500ms ease;
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

</style>