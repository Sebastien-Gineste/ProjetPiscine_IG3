<template>
    <div @click="goPanel" v-if="show && !creneau.supprimer" :id="'cre_'+creneau.id" class="creneau">
        <table  class="typeCreneau" :style="{'margin-left' : decaleCss+'% !important', width : splitCss+'% !important'}" :class="['_Com'+creneau.heureDebut, creneau.duree1h ? '_1heure' : '_1heure30']">
            <tbody>
                <tr>
                    <td></td>
                </tr>
            </tbody>
        </table>
        <div class="contenueCreneau" :style="{'margin-left' : decaleCss+'% !important', width : splitCss+'% !important'}" :class="['_Com'+creneau.heureDebut, creneau.duree1h ? '_1heure' : '_1heure30']" >
            <div aria-owns="Planning" aria-label="text" class="inforCreneau">
                <b v-if="split.substr(6)<3">{{creneau.id+" - "}}{{groupe}}</b>
                <br v-if="split.substr(6)<3">{{profs}}
                <br>{{salle}}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {creneau: Object, Dates : Object, appelPanel : Function, SupprimeCreneau : Function, DuppliquerCreneau : Function, Mode : Object},
    computed : {
        decale(){
            if(this.creneau.tabFrereCren !== null){
                 var id = this.creneau.tabFrereCren.indexOf(this.creneau)
                return "_decale"+id
            }
            else{
                return ""
            }
        },
        decaleCss(){
            if(this.creneau.tabFrereCren !== null){
                 var id = this.creneau.tabFrereCren.indexOf(this.creneau)
                return  (parseFloat(id) * (1/parseFloat(this.creneau.tabFrereCren.length)) * 100).toFixed(2)
            }
            else{
                return "0"
            }
        },
        splitCss(){
            if(this.creneau.tabFrereCren !== null){
                return  ((1/parseFloat(this.creneau.tabFrereCren.length)) * 100).toFixed(2)
            }
            else{
                return "100"
            }
        },
        split(){
            if(this.creneau.tabFrereCren !== null){
                var split = this.creneau.tabFrereCren.length-1
                return "_split"+split
            }
            else{
                return "_split0"
            }
        },
        dates(){
            return this.Dates.tab
        },
        show(){
            return this.dates.indexOf(this.creneau.date) != -1 ? true : false 
        },
        groupe(){
            if(this.creneau.groupe !== null){
                return this.creneau.groupe
            }
            else{
                return "groupe non défini"
            }
        },
        salle(){
            if(this.creneau.salle !== null){
                return this.creneau.salle
            }
            else{
                return "salle non défini"
            }
        },
        profs(){
            if(this.creneau.jury !== null && this.creneau.jury[0] !== null){
                let str = ""
                for (let i =0; i<this.creneau.jury.length;i++){
                    if(this.creneau.jury[i] !== null){
                        str += this.creneau.jury[i].nomProf+" - "
                    }
                }
                str = str.substr(0,str.length-3)
                return str
            }
            return "Jury non défini"
           
        }
    },
    methods: {
        goPanel(){
            if(this.Mode.mode === null){
                this.appelPanel(this.creneau)
            }
            else if(this.Mode.mode === "delete"){
                this.SupprimeCreneau(this.creneau)
            }
            else{ // "ajout"
                this.DuppliquerCreneau(this.creneau)
            }
            
        },
    }
}
</script>

<style lang="scss">

    .creneau{
        cursor: pointer;
        width: 100%;
    }
    .typeCreneau{
        background-color: rgb(204, 204, 0);
        position: absolute;
        left: 0px;
        width: 100%;
        border: 2px solid black;
    }
    ._1heure{
        height: 125% !important;
    }

    ._1heure30{
        height: 175% !important;
    }
  
   ._Com00{
        top : 0% !important;
    }

    ._Com25{
        top : 25% !important;
    }
    ._Com50{
        top : 50% !important;
    }
    ._Com75{
        top : 75% !important;
    }
    
    .contenueCreneau{
        font-size: 10px; 
        font-family: Dialog; 
        font-style: normal; 
        font-weight: normal; 
        color: rgb(0, 0, 204); 
        text-align: center; 
        overflow: hidden; 
        position: absolute; 
        left: 0px; 
        width: 100%;
    }

    .inforCreneau{
        position: relative; 
        display: block;
        text-align: center;
        line-height: 120%;
        top: 10px;
    }
</style>