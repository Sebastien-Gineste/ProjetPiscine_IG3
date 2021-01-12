<template>
    <div id="EventManagement">

        <h1 id="title"> Gestion des évenements </h1>
        
        <button> Créer un évenement </button>

        <li v-for="item in event" :key=item>
            <ul> 
                Evenement n°X | 
            </ul>
        </li>
    </div>
</template>
    
<script>
    export default {
    
    }
</script>
    
<style>
    #title_event{
        margin-bottom: 3%;
    };
    
    #Evenement_panel{
        margin-top: 5%;
    }
</style>