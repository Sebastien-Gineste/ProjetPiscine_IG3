<template>
    <div id="group">
        <h1 id="title">Gestion de groupe</h1>

        <!-- Si l'étudiant n'a pas encore de groupe | <b-container class="bv-example-row" v-if="Pas de groupe"> -->
        <b-container class="bv-example-row">
            <b-row>
                <!-- DÉBUT CREATION DE GROUPE -->
                
                <b-col>
                    <h6> Vous n'avez pas encore de groupe </h6>
                    <b-button id="submit" v-if="isCreate" type="submit" variant="primary">Créer un groupe</b-button>
                </b-col>
               
                <!-- FIN CREATION DE GROUPE -->
            </b-row>
        </b-container>

        <!-- Si l'étudiant a déjà au moins 1 groupe | <b-container class="bv-example-row" v-if="Au moins 1 groupe"> -->
        <b-container class="bv-example-row" >
            <b-row>
            <!-- DÉBUT CREATION DE GROUPE -->
                <!-- Amène sur la page de création de groupe -->
                <!-- Copie de create update evenement -->
                <b-button id="submit" v-if="isCreate" type="submit" variant="primary">Créer un nouveau groupe</b-button> 
            <!-- FIN CREATION DE GROUPE -->

            <!-- DÉBUT MODIFICATION DU GROUPE -->
                <div>
                    <b-table bordered hover :items="items" :fields="fields"></b-table>
                </div>      
            <!-- FIN MODIFICATION DU GROUPE -->

            </b-row>
        </b-container>
    </div>
</template>

<script>

    /* Copie de create update evenement
    const app = new Vue({
        el: '#group',
        data: {

        },
        methods: {
            isCreate(){
            return this.$route.params.id === undefined
            },
        }
    })
    Jusque là */

    export default {
        data() {
            return {
                // Note `isActive` is left out and will not appear in the rendered table
                fields: ['Groupe', 'Nom_projet', 'Nom_tuteur','Entreprise_tuteur', 'Nom_évenement', 'Membres', 'Modification'],
                items: [
                { isActive: false, Groupe: '01', Nom_projet: 'A', Nom_tuteur: 'T1', Entreprise_tuteur: 'Ent1', Nom_évenement: 'Evt2', Membres: [/*Liste des membres*/], Modification: 'Modifier' },
                { isActive: false, Groupe: '02', Nom_projet: 'B', Nom_tuteur: 'T2', Entreprise_tuteur: 'Ent2', Nom_évenement: 'Evt2', Membres: [/*Liste des membres*/], Modification: 'Modifier' },
                { isActive: false, Groupe: '03', Nom_projet: 'C', Nom_tuteur: 'T3', Entreprise_tuteur: 'Ent3', Nom_évenement: 'Evt3', Membres: [/*Liste des membres*/], Modification: 'Modifier' },
                { isActive: false, Groupe: '04', Nom_projet: 'D', Nom_tuteur: 'T4', Entreprise_tuteur: 'Ent4', Nom_évenement: 'Evt4', Membres: [/*Liste des membres*/], Modification: 'Modifier' },
                ]
            }
        },
        computed: {
            readonly() {
                return (this.isCreate ? false : !this.showModif )
            },
            isCreate(){
                return this.$route.params.id === undefined
            },
        },
  }

</script>

<style lang="scss">
    #group {
        text-align: center;
    };
    b-row {
        margin: 30px;
    }
</style>