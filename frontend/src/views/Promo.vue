<template>
    <!-- Liste des promos -->
             <div id="listePromo">
                  <h1> Gestion des promos </h1>

                 <b-row id="gestionPromo" class="my-1">
                    <b-col sm="2">  
                        <b-form-input
                            id="ajoutPromo"
                            v-model="currentPromo"
                            type="number"
                            required
                            max="2100"
                            min="2000"
                        ></b-form-input>
                     
                    </b-col>
                      
                    <b-button variant="primary" id="ajouter" type="button" @click="ajouterPromo()"> Ajouter la promo </b-button>
                    <b-col sm="4">  
                        <b-form-select id="input-promo" v-model="currentPromoRemove" required :options="listPromo">
                                <template #first>
                                    <b-form-select-option :value="null" disabled>Sélectionner une promo</b-form-select-option>
                                </template>
                        </b-form-select>
                    </b-col>  
                     <b-button variant="danger" id="supprimerPromo" type="button" @click="supprimerPromo()"> Supprimer la promo </b-button>
                </b-row>  
                <b-card>
                    <b-tabs content-class="mt-3" fill>
                        <b-tab v-for="(promo,id) in listeEtudiants" :key="id" :title="''+promo.promo+' - '+formatPromo(promo.promo)" > <!--Pour chaque promo-->
                                     <b-row v-if="promo.tabEtudiants.length > 0">
                                         <b-col sm="4" md="5" class="my-1">
                                            <b-form-group
                                            label="Par page"
                                            label-for="per-page-select"
                                            label-cols-sm="6"
                                            label-cols-md="4"
                                            label-cols-lg="3"
                                            label-align-sm="right"
                                            label-size="sm"
                                            class="mb-0"
                                            >
                                            <b-form-select
                                                id="per-page-select"
                                                v-model="promo.perPage"
                                                :options="pageOptions"
                                                size="sm"
                                            ></b-form-select>
                                            </b-form-group>
                                        </b-col>
                                        <b-col  sm="6" class="my-1">
                                            <b-pagination
                                                v-model="promo.currentPage"
                                                :total-rows="promo.totalRows"
                                                :per-page="promo.perPage"
                                                align="fill"
                                                size="sm"
                                                class="my-0"
                                            ></b-pagination>
                                        </b-col>
                                        
                                     </b-row>
                                    <b-table v-if="promo.tabEtudiants.length > 0" :busy="isBusy" striped hover :items="promo.tabEtudiants" :fields="fields"  :current-page="promo.currentPage" :per-page="promo.perPage">
                                    <!-- A custom formatted column -->
                                    <template #cell(delete)="data">
                                        <b-button type="button" variant="danger" @click="deleteEleve(data.item.numEtudiant, id)"> Supprimer </b-button>
                                    </template>

                                    <template #table-busy>
                                        <div class="text-center text-danger my-2">
                                        <b-spinner class="align-middle"></b-spinner>
                                        <strong>Loading...</strong>
                                        </div>
                                    </template>
                            </b-table>
                            <b-alert v-else variant="warning" show> Il n'y a pas encore d'élève dans cette promo </b-alert>
                        </b-tab>
                    </b-tabs>
                </b-card>
            </div>
</template>


<script>
import util from "../service/fonctionUtil"
import axio from "axios";
const axios = axio.create({ withCredentials: true })
export default {
    
    data(){
        return{
            currentPromo : new Date().getFullYear(),
            currentPromoRemove : null,
            pageOptions: [2,5, 10, 15, { value: 100, text: "Show a lot" }],
            listPromo : [],
            isBusy : true,
            listeEtudiants : [],
            fields : [{ key: 'numEtudiant',sortable: true},{ key: 'nomEtudiant',sortable: true},{ key: 'prenomEtudiant',sortable: true}, { key: 'idGroupe',sortable: true},{key : 'delete' ,label : "Supprimer" }]
        }
    },
    methods:{
        formEtudiant(etudiant){
            return {nomEtudiant : etudiant.nomEtudiant, prenomEtudiant :etudiant.prenomEtudiant, numEtudiant : etudiant.numEtudiant, idGroupe : (etudiant.idGroupe?etudiant.idGroupe: "Pas de groupe" )} 
        },
        formatPromo(promo){
            var debut = "IG"
            var fin = ((((new Date().getMonth() + 1) >= 9)? 6 : 5 )-(promo - new Date().getFullYear()))
            if(fin > 5){
                return "Ancienne Promo"
            }
            else if(fin < 3){
                return "Nouvelle Promo"
            }
            else{
                return debut+fin
            }

        },
        deleteEleve(id, idTab){
            console.log(id)
            console.log(idTab)  
            if(confirm("Voulez vous vraiment supprimer cet étudiant?")){ 
                axios.delete('http://localhost:3000/api/Etudiant/'+id).then((response)=>{
                    console.log(response.data)
                    var i = 0
                    while(i<this.listeEtudiants[idTab].tabEtudiants.length && this.listeEtudiants[idTab].tabEtudiants[i].numEtudiant != id){
                        i++
                    } 
                    console.log(this.listeEtudiants[idTab].tabEtudiants[i])
                    this.listeEtudiants[idTab].tabEtudiants.splice(i,1) // enlève l'étudiant du tableau
                    util.makeToast(this,"success","Etudiant","L'étudiant a été suprimmé !")
                })
                .catch((error)=>{
                    console.log(error.response)
                })
            }
        },
        supprimerPromo(){
            if(confirm("Voulez vous vraiment supprimer la promo, ainsi que tous ses élèves et groupes?")){
                axios.delete('http://localhost:3000/api/Promo/'+this.currentPromoRemove).then((response)=>{
                    console.log(response.data)
                    var id = this.listPromo.indexOf(this.currentPromoRemove)
                    console.log(id)
                    this.listPromo.splice(id,1) // on l'enlève du tableau
                    this.listeEtudiants.splice(id,1) 
                    this.currentPromoRemove= null
                    util.makeToast(this,"success","Promo","La promo a été suprimmée !")
                })
                .catch((error)=>{
                    console.log(error.response)
                })
            }
        },
        ajouterPromo(){
            if(this.listPromo.indexOf(this.currentPromo) == -1){
                axios.post('http://localhost:3000/api/Promo/',{promo : this.currentPromo}).then((response)=>{
                    console.log(response.data)
                    this.listPromo.push(response.data.annePromo)
                    this.listeEtudiants.push({promo : response.data.annePromo, tabEtudiants : [], currentPage : 1, totalRows : 0, perPage : 5})
                    util.makeToast(this,"success","Promo","La promo a été créée !")

                })
                .catch((error)=>{
                    console.log(error.response)
                    util.makeToast(this,"warning","Promo",error.response)
                })
            }
            else{
                util.makeToast(this,"warning","Attention !","Vous ne pouvez pas créer une promo déjà existante !")
            }
        }
    },
    beforeMount(){
        axios.get('http://localhost:3000/api/Etudiant/').then((response) => {
                console.log(response.data)
                var liste = response.data;
                for(let i = 0;i<liste.length;i++){
                    if(liste[i].numEtudiant === null){ // promo sans étudiant
                        this.listPromo.push(liste[i].annePromo)
                        this.listeEtudiants.push({promo : liste[i].annePromo, tabEtudiants : [], currentPage : 1, totalRows : 0, perPage : 5})
                    }
                    else if(this.listPromo.indexOf(liste[i].annePromo) == -1){ // promo nouvelle avec des étudiants
                        this.listPromo.push(liste[i].annePromo)
                        this.listeEtudiants.push({promo : liste[i].annePromo, tabEtudiants : [this.formEtudiant(liste[i])], currentPage : 1, totalRows : 1, perPage : 5})
                    }
                    else{ // ajout de l'étudiant (Promo déjà existante)
                        let idPromo = this.listPromo.indexOf(liste[i].annePromo)
                        this.listeEtudiants[idPromo].tabEtudiants.push(this.formEtudiant(liste[i]))
                        this.listeEtudiants[idPromo].totalRows++
                    }
                }
                this.isBusy = false
        })
        .catch((error)=>{
                console.log(error.response)
                this.isBusy = false
        })
    }
    
}
</script>


<style lang="scss">
    #listePromo{
        width: 80%;
        margin-left: 10%;
        padding: 20px;

        table{
            margin-top: 2%;
        }

        #ajouter{
            margin-left: 5px;
        }

        h1{
            margin-bottom: 2%;
        }

        .card-body{
            background-color: lightblue;

            & >div{
                background-color: white;
            }
        }

        #gestionPromo{
            background-color: lightblue;
            padding: 10px;
            border-radius: 9px;
        }
    }
</style>