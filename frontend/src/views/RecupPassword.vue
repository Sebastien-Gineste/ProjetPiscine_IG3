<template>
    <div id="a">
        <h1>Récupération du mot de passe</h1>

<b-card v-if="!showModif">
      <b-form @submit="onSubmit">
        <b-form-group
          id="email-group-1"
          label="Adresse Email pour récupérer votre mot de passe"
          label-for="input-1"
        >
          <b-form-input
              id="email-1"
              v-model="form.email"
              type="email"
              required
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-code-1" label="Code reçu par mail" label-for="input-2">
          <b-form-input type="text" id="code" v-model="form.code"></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Envoyer</b-button>
        <p><b-link to="/Connexion"> Retour </b-link></p>
        <div v-if="messageError.length > 0">{{messageError}}</div>
      </b-form>
    </b-card>
    <b-card v-else>
        <b-form @submit="changeMdp">
            <b-list-group>
            <b-list-group-item>Nouveau Mot de passe : <input v-model="form.newPassword" type="password"> </b-list-group-item>
            <b-list-group-item>Confirmation Mot de passe : <input v-model="form.cnMdpEtudiant" type="password"> </b-list-group-item>
            </b-list-group>
            <b-button type="submit" variant="primary">Envoyer</b-button>
            <div v-if="messageError.length > 0">{{messageError}}</div>
        </b-form>
    </b-card>
  </div>
</template>

<script>
import axio from "axios";
const axios = axio.create({
  withCredentials: true
})

  export default {
    data() {
      return {
        form: {
          email: '',
          code: '',
          newPassword: '',
          cnMdpEtudiant: '',
        },
        showModif: false,
        messageError : "",
        codeVerif: -1,
        numEtudiant: '',
      }
    },
    methods: {
      onSubmit(evt) {
        evt.preventDefault()
        if (this.codeVerif>0){
            if (this.form.code.length!==5){                   //Verifie si le code fait bien 5 caractères
                this.messageError="Code non conforme";
            }
            else{
                if (this.form.code!=this.codeVerif){             //Verifie si le code est faux
                    this.messageError="Code faux";
                }
                else{                                         //code bon on peut changer le mdp
                    console.log("code bon")
                    this.showModif=true
                }
            }
        }
        else{
        axios.post(`http://localhost:3000/api/Etudiant/VerifMail`,this.form).then((response) => {
            this.codeVerif=response.data[0];
            this.numEtudiant=response.data[1];
        })
        .catch((error) => { 
            var msg = error.response;
            console.log(msg)
            if(msg.status == '403'){ // pas autorisé 
                this.messageError = msg.data
            }
        });
        }
        
      },
    
    changeMdp(c){
    c.preventDefault()
        if (this.form.newPassword!=this.form.cnMdpEtudiant){
            this.messageError="Le Mot de passe et sa confirmation sont différents";
        }
        else{
            axios.put(`http://localhost:3000/api/Etudiant/ModifMdp/`+this.numEtudiant,{newPassword:this.form.newPassword}).then(() => {
                console.log("mot de passe changé")
                axios.post("http://localhost:3000/api/Etudiant/Deconnexion")
                this.$store.dispatch('deconnexion');
                this.$router.push('/Connexion');
            
        })
        .catch((error) => { 
            var msg = error.response;
            console.log(msg)
            if(msg.status == '403'){ // pas autorisé 
                this.messageError = msg.data
            }
        });
        }
    }
  }
  }
</script>

<style lang="scss">
    #connexion{
        width: 70%;
        margin: 2%;
        margin-left: 15%;

        h1, button{
          margin-bottom: 2%;
        }

    }
</style>