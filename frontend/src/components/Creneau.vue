<template>
    <div :style="{cursor : cursor  }" @click="goPanel" v-if="show && !creneau.supprimer" :id="'cre_'+creneau.id" class="creneau"  @mouseover="showInfo = true"  @mouseleave="showInfo = false">
        <table  class="typeCreneau" :style="{'margin-left' : decaleCss+'% !important', width : splitCss+'% !important'}" :class="['_Com'+creneau.heureDebut, creneau.duree1h ? '_1heure' : '_1heure30']">
            <tbody>
                <tr>
                    <td></td>
                </tr>
            </tbody>
        </table>
        <div class="contenueCreneau" :style="{'margin-left' : decaleCss+'% !important', width : splitCss+'% !important'}" :class="['_Com'+creneau.heureDebut, creneau.duree1h ? '_1heure' : '_1heure30']" >
            <div aria-owns="Planning" aria-label="text" class="infoCreneau">
                <b v-if="split<3">{{creneau.id+" - "}}{{groupe}}</b>
                <br v-if="split<3">{{profs}}
                <br>{{salle}}
            </div>
        </div>
        <div class="infoCreneauDiv" v-if="showInfo" :style="{'margin-top' : creneau.heureDebut == '00' ? '0' : (creneau.heureDebut == '25' ? '5' : (creneau.heureDebut == '50' ? '10' : '15')) +'% !important'}">
            <p> 
                <b >{{creneau.id+" - "}}{{groupe}}</b>
                <br >{{profs}}
                <br>{{salle}}
            </p>   
        </div>
    </div>
</template>

<script>
import util from "../service/fonctionUtil"
export default {
    data(){
        return {
            showInfo:false,
        }
    },
    props: {creneau: Object, Dates : Object, appelPanel : Function, SupprimeCreneau : Function, DuppliquerCreneau : Function,AjoutJury : Function,AjoutSalle : Function, Mode : Object},
    computed : {
        /* Propriété calculé qui return la valeur CSS du cursor en fonction du mode du panel 
        */
        cursor(){
            switch(this.Mode.mode){
                case 'jury' :
                    if(this.Mode.jurySelected){return "cell" }
                    break;
                case 'salles' :
                    if(this.Mode.salleSelected){return "cell"}
                    break;
                case null : 
                    return "pointer"
                case "ajout":
                    return "copy"
                case "delete":
                    return "not-allowed"
                default:
                    return "pointer"
            }
            return "pointer"
        },
        /* Propriété calculé qui return la valeur CSS de "margin-left" en fonction du de la position du créneau comparer à ses frères (même temporalité) 
        */
        decaleCss(){
            if(this.creneau.tabFrereCren !== null){
                var id = this.creneau.tabFrereCren.indexOf(this.creneau)
                var split = this.creneau.tabFrereCren.length
                return  (parseFloat(id) * (1/parseFloat(split)) * 100).toFixed(2)
            }
            else{
                return "0"
            }
        },
        /* Propriété calculé qui return la valeur CSS de "width" en fonction du tableau de ses frères (même temporalité) 
        */
        splitCss(){
            if(this.creneau.tabFrereCren !== null){ 
               return  ((1/parseFloat(/*split*/this.creneau.tabFrereCren.length)) * 100).toFixed(2)
            }
            else{
                return "100"
            }
        },
        /* Propriété calculé qui permet de savoir si on doit afficher toutes les infos du créneau ou seulement quelques infos.
        */
        split(){
            if(this.creneau.tabFrereCren !== null){
                var split = this.creneau.tabFrereCren.length-1
                return ""+split
            }
            else{
                return "0"
            }
        },
         /* Propriété calculé qui permet de retourner le tableau des dates
        */
        dates(){
            return this.Dates.tab
        },
        /* Propriété calculé qui permet de savoir si on doit afficher le créneau ou pas (on vérifie si ça date est compris dans le tableau de dates de la semaine.)
        */
        show(){
            return this.dates.indexOf(this.creneau.date) != -1 ? true : false 
        },
        /* Propriété calculé qui permet de faire un affichage du groupe du créneau
        */
        groupe(){
            if(this.creneau.groupe !== null){
                return this.creneau.groupe
            }
            else{
                return "groupe non défini"
            }
        },
        /* Propriété calculé qui permet de faire un affichage de la salle du créneau
        */
        salle(){
            if(this.creneau.salle !== null){
                return this.creneau.salle
            }
            else{
                return "salle non défini"
            }
        },
        /* Propriété calculé qui permet de faire un affichage du jury du créneau
        */
        profs(){
            if(this.creneau.jury !== null && this.creneau.jury[0] !== null){
                let str = ""
                for (let i=0; i<this.creneau.jury.length;i++){
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
        /* Fonction qui retourne un tableau des créneaux qui sont dans la temporalité exact du créneau this.creneau
        */
        frereDirect(){
            var tabFrere = null
            const heureDebut = parseFloat(this.creneau.heureTotal);
            const dureeCreneau = this.creneau.duree1h ?  1.25 : 1.75;
            const heureFin = heureDebut + dureeCreneau

            if(this.creneau.tabFrereCren){
                for(let i = 0;i<this.creneau.tabFrereCren.length;i++){
                    let creneauDebut = parseFloat(this.creneau.tabFrereCren[i].heureTotal) 
                    let creneauFin = creneauDebut + dureeCreneau 
                    if((creneauDebut > heureDebut &&  creneauDebut < heureFin ) || (creneauDebut < heureDebut && creneauFin > heureDebut ) || ( this.creneau.tabFrereCren[i] !== this.creneau && (creneauDebut === heureDebut && creneauFin === heureFin))){ // ils sont sur la même plage horraire
                        if(tabFrere){
                            tabFrere.push(this.creneau.tabFrereCren[i]);
                        }  
                        else{
                            tabFrere = [this.creneau.tabFrereCren[i]];
                        }
                    }
                }
            }
            return tabFrere;
        },
        /* Fonction qui retourne Vrai si le jury est duppliquer 
        */
        duplicationJury(juryCompare){
            var tab = this.frereDirect();
            var duplicationJury = false;
            if(tab){
                for(let i = 0; i<tab.length; i++){
                    if(tab[i].jury && tab[i].jury[0]){ // les profs sont non null
                        for(let j = 0; j<tab[i].jury.length; j++){
                            if(tab[i].jury[j].idProf == juryCompare[0] || tab[i].jury[j].idProf == juryCompare[1]){
                                duplicationJury = true;
                            }
                        }
                    }
                }
            }
            return duplicationJury
        },
         /* Fonction qui retourne Vrai si la salle est duppliquer 
        */
        duplicationSalle(salle){
            console.log(salle)
            var tab = this.frereDirect();
            console.log(tab)
            var duplicationSalle = false;
            if(tab){
                for(let i = 0; i<tab.length; i++){
                    if(tab[i].salle === salle ){ // la salle est présente
                        duplicationSalle = true
                    }
                }
            }
            return duplicationSalle
        },
        /* Fonction qui se lance lorsqu'on clique sur un créneau. Elle permet de lancer la bonne fonction en fonction du mode (this.Mode.mode) du composant panelCreneau du planning
        Elle permet de :
            -Afficher un formulaire pour le créneau afin de la modifier
            -Supprimer le créneau
            -Modifier la salle du créneau
            -Modifier le jury du créneau
        */
        goPanel(){
            if(this.Mode.mode === null){
                this.appelPanel(this.creneau,this.duplicationSalle, this.duplicationJury)
            }
            else if(this.Mode.mode === "delete"){
                this.SupprimeCreneau(this.creneau)
            }
            else if(this.Mode.mode === "salles"){
                // vérifie si la salle n'est pas présent dans ses frères
                if(this.Mode.salleSelected){
                    if(!this.duplicationSalle(this.Mode.salleSelected)){
                        this.AjoutSalle(this.creneau, this.Mode.salleSelected)
                    }
                    else{
                        util.makeToast(this,"warning","Attention !","La salle est sur 2 créneaux dans la même plage horaire ! :(")
                    }
                }
            }
            else if(this.Mode.mode === "jury"){
                if(this.Mode.jurySelected){
                    // vérifie si un membre du jury n'est pas présent dans ses frères
                    if(!this.duplicationJury(this.Mode.jurySelected)){
                        this.AjoutJury(this.creneau,this.Mode.jurySelected)
                    }
                    else{
                        util.makeToast(this,"warning","Attention !","Un des membres du jury est sur 2 créneaux dans la même plage horaire ! :(")
                    }
                }                
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

    .infoCreneau{
        position: relative; 
        display: block;
        text-align: center;
        line-height: 120%;
        top: 10px;
    }
    .infoCreneauDiv{
        max-width: 100% !important;
        background-color: unset !important;
        position : absolute;
        margin-left: 10% !important;
        z-index: 95;

        p,h3{
            width: fit-content;
            font-size: 12px;
            padding: 12px;
            border-radius: 7px;
            border: black solid 1px;
            background-color: #f2f2f2;
        }
        h3{
            font-weight: bold;
        }
    }


</style>