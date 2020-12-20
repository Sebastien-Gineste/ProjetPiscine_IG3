<template>
    <div @click="goPanel" v-if="show && !creneau.supprimer" :id="'cre_'+creneau.id" class="creneau">
        <table  class="typeCreneau" :class="['_Com'+creneau.heureDebut, creneau.duree1h ? '_1heure' : '_1heure30',decale,split]">
            <tbody>
                <tr>
                    <td></td>
                </tr>
            </tbody>
        </table>
        <div class="contenueCreneau" :class="['_Com'+creneau.heureDebut, creneau.duree1h ? '_1heure' : '_1heure30', split,decale]">
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
    #icons{
        position: absolute;
        text-align: left;
        width: fit-content;
    }

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

   
    ._split1{
        width: 50% !important;
        &._decale1{
            margin-left: 50% !important;
            &#icons{
                margin-left: 60% !important;
            }
        }
        &#icons{
            margin-left: 10%;
        }
    }

    ._split2{
        width: 33.33% !important;
        &._decale1{
            margin-left: 33.33% !important;
        }
        &._decale2{
            margin-left: 66.66% !important;
        }
    }

    ._split3{
        width: 25% !important;
        &._decale1{
            margin-left: 25% !important;
        }
        &._decale2{
            margin-left: 50% !important;
        }
        &._decale3{
            margin-left: 75% !important;
        }
    }

    ._split4{
        width: 20% !important;
        &._decale1{
            margin-left: 20% !important;
        }
        &._decale2{
            margin-left: 40% !important;
        }
        &._decale3{
            margin-left: 60% !important;
        }
        &._decale4{
            margin-left: 80% !important;
        }
    }

     ._split5{
        width: 16.66% !important;
        &._decale1{
            margin-left: 16.66% !important;
        }
        &._decale2{
            margin-left: 33.33% !important;
        }
        &._decale3{
            margin-left: 50% !important;
        }
        &._decale4{
            margin-left: 66.67% !important;
        }
        &._decale5{
            margin-left: 83.33% !important;
        }
    }

    ._Com00{
        top : 0% !important;
        &#icons{
            top : 5% !important;
        }
        &.plus{
            top : 50% !important;
        }
    }

    ._Com25{
        top : 25% !important;
       &#icons{
            top : 30% !important;
        }
        &.plus{
            top : 75% !important;
        }
    }
    ._Com50{
        top : 50% !important;
        &#icons{
            top : 55% !important;
        }
        &.plus{
            top : 100% !important;
        }
    }
    ._Com75{
        top : 75% !important;
        &#icons{
            top : 80% !important;
        }
        &.plus{
            top : 125% !important;
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
        position: relative; 
        left: 5%;
        transform: scale(1);
        transition: all 0.5s ease;
        &.plus{
             //margin-left: 7%;
        }

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