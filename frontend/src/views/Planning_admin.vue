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
            <b-row>
                <b-col cols="1">8h</b-col>
                <b-col class="colonne">
                   <Creneau :creneau="Creneau"></Creneau>
                </b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne">
                    <Creneau :creneau="Creneau"></Creneau>
                </b-col>
                <b-col class="colonne"></b-col> 
            </b-row>
            <b-row>
                <b-col cols="1">9h</b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
            </b-row>
            <b-row>
                <b-col cols="1">10h</b-col>
                <b-col class="colonne"><Creneau :creneau="Creneau"></Creneau></b-col>
                <b-col class="colonne"><Creneau :creneau="Creneau"></Creneau></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
            </b-row>
            <b-row>
                <b-col cols="1">11h</b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col> 
            </b-row>
            <b-row>
                <b-col cols="1">12h</b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
            </b-row>
            <b-row>
                <b-col cols="1">13h</b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
            </b-row>
            <b-row>
                <b-col cols="1">14h</b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col> 
            </b-row>
            <b-row>
                <b-col cols="1">15h</b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
            </b-row>
            <b-row>
                <b-col cols="1">16h</b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
            </b-row>
            <b-row>
                <b-col cols="1">17h</b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col> 
            </b-row>
            <b-row>
                <b-col cols="1">18h</b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
            </b-row>
            <b-row>
                <b-col cols="1">19h</b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
                <b-col class="colonne"></b-col>
            </b-row>
        </b-container>

    </div>
</template>


<script>
import Creneau from "@/components/Creneau.vue";
 
export default {
    components: { Creneau },
    data(){
        return{
            Creneau : {id:52,salle : "TD15", jury : ["jean","pedro"], groupe : "les monstres", duree1h:true, heureDebut:"25"}
        }
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
       max-width: 100vw !important;
       .colonne{
        border-top : 0px solid !important;
        border-bottom : 0px solid !important;
        background-color : transparent !important;
    }
    }
</style>