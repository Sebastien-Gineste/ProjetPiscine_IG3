<template>
    <div v-if="show && !creneau.supprimer" :id="'cre_'+creneau.id" class="creneau">
        <table  class="typeCreneau" :class="['_Com'+creneau.heureDebut, creneau.duree1h ? '_1heure' : '_1heure30']">
            <tbody>
                <tr>
                    <td></td>
                </tr>
            </tbody>
        </table>
        <div @click="goPanel"  class="contenueCreneau" :class="['_Com'+creneau.heureDebut, creneau.duree1h ? '_1heure' : '_1heure30']">
            <div aria-owns="Planning" aria-label="text" class="inforCreneau">
              <b>{{creneau.id+" - "}}{{groupe}}</b>
                <br>{{profs}}
                <br>{{salle}}
            </div>
        </div>
         <span @click="supprime" class="creneau_Icon" :class="['_Com'+creneau.heureDebut]">
            <b-icon icon="x-circle-fill" scale="1" variant="danger"></b-icon>
        </span>
    </div>
</template>

<script>
export default {
    props: {creneau: Object, Dates : Object, appelPanel : Function, SupprimeCreneau : Function },
    computed : {
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
            this.appelPanel(this.creneau)
        },
        supprime(){
            this.SupprimeCreneau(this.creneau)
        }
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
        &.creneau_Icon{
            top : 5% !important;
        }
    }

    ._Com25{
        top : 25% !important;
        &.creneau_Icon{
            top : 30% !important;
        }
    }
    ._Com50{
        top : 50% !important;
        &.creneau_Icon{
            top : 55% !important;
        }
    }
    ._Com75{
        top : 75% !important;
        &.creneau_Icon{
            top : 80% !important;
        }
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
        left: 5%;
        transform: scale(1);
        transition: all 0.5s ease;

        .b-icon.bi{
            transition: all 0.5s ease;
        }

        :hover{
            color : white;
        }
        .b-icon.bi:hover{
            transform: scale(1.3) rotateZ(-90deg);
        }
    }
    .inforCreneau{
        position: relative; 
        display: block;
        text-align: center;
        line-height: 120%;
        top: 10px;
    }
</style>