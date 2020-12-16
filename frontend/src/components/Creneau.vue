<template>
    <div v-if="creneau.show" :id="'cre_'+creneau.id" class="creneau">
        <table class="typeCreneau" :class="['_Com'+creneau.heureDebut, creneau.duree1h ? '_1heure' : '_1heure30']">
            <tbody>
                <tr>
                    <td></td>
                </tr>
            </tbody>
        </table>
        <span  class="creneau_Icon" :class="['_Com'+creneau.heureDebut]">
            <b-icon icon="x-circle" scale="1" variant="danger"></b-icon>
        </span>
        <div class="contenueCreneau" :class="['_Com'+creneau.heureDebut, creneau.duree1h ? '_1heure' : '_1heure30']">
            <div unselectable="on" tabindex="0" aria-owns="Planning" aria-label="text" class="inforCreneau">
              <b unselectable="on">{{creneau.id+" - "}}{{groupe}}</b>
                <br>{{profs}}
                <br>{{salle}}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {creneau: Object},
    computed : {
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
            if(this.creneau.jury !== null){
                let str = ""
                console.log(this.creneau)
                for (let i =0; i<this.creneau.jury.length;i++){
                    str += this.creneau.jury[i]+" - "
                }
                str = str.substr(0,str.length-3)
                return str
            }
            return "Jury non défini"
           
        }
    },
    beforeMount(){
        
    }
}
</script>

<style lang="scss">
    .creneau{
        cursor: auto;
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
    .creneau_Icon{
        position: absolute; 
        left: 2px; 
        top: 2px;
    }
    .inforCreneau{
        position: relative; 
        display: block;
        text-align: center;
        line-height: 120%;
        top: 10px;
    }
</style>