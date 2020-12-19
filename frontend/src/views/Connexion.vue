<template>
  <div id="connexion">
    <b-form @submit="onSubmit" v-if="show">
      <b-form-group
        id="input-group-1"
        label="Email address:"
        label-for="input-1"
        description="We'll never share your email with anyone else."
      >
        <b-form-input
            id="input-1"
            v-model="form.email"
            type="email"
            required
            placeholder="Enter email"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Password" label-for="text-password">
        <b-form-input type="password" id="text-password" aria-describedby="password-help-block" v-model="form.password"></b-form-input>
        <b-form-text id="password-help-block">
        Your password must be 8-20 characters long, contain letters and numbers, and must not
        contain spaces, special characters, or emoji.
        </b-form-text>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
      <div v-if="messageError.length > 0">{{messageError}}</div>
    </b-form>
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
        show: true,
        error: false,
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
    }
</style>