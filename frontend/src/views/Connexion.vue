<template>
  <div id="connexion">
    <h1 >Connexion</h1>
    <b-card>
      <b-form @submit="onSubmit">
        <b-form-group
          id="email-group-1"
          label="Adresse Email"
          label-for="input-1"
        >
          <b-form-input
              id="email-1"
              v-model="form.email"
              type="email"
              required
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" label="Mot de passe" label-for="text-password">
          <b-form-input type="password" id="text-password" v-model="form.password"></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Se connecter</b-button>
        <p>Si vous n'avez pas encore de compte, pensez à vous <b-link to="/CreationCompte"> inscrire </b-link></p>
        <p>Si vous avez oubliez votre mot de passe, cliquer <b-link to="/RecupMdp"> ici </b-link></p>
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
          password : '',
        },
        messageError : "",
      }
    },
    methods: {
      onSubmit(evt) {
        evt.preventDefault()
        axios.post(`http://localhost:3000/api/Etudiant/Connexion`,this.form).then((response) => {
             var user = response.data;
             this.$store.dispatch('connexion',user);
             this.$router.push("/")
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