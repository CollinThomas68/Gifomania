<template>
  <div class="container">
    <form class=" row" @submit.prevent="Authentification"> 
      <div
        class="col-lg-6"
      >
        <img class="logo" src="../assets/images/icon.svg" alt="Logo Groupomania" />
        <p>
      
            Vous n'avez pas encore de compte,
            <router-link class="redirection-inscription" to="/inscription">Enregistrez-vous</router-link>
     
        </p>
      </div>
      <div class="col-lg-6 text-align">
        <div class="form-group">
          <label for="inputEmail">Email</label>
          <input 
          type="text" 
          class="form-control" 
          id="inputEmail" 
          v-model="dataAuthentification.email" 
          placeholder="Votre mail!"
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          />
        </div>
        <div class="form-group">
          <label for="inputPassword">Password</label>
          <input
            type="password"
            title="Entre 4 et 8 caractères 1minuscule, 1majuscule et 1 chiffre mini !"
            class="form-control"
            id="inputPassword"
            v-model="dataAuthentification.password"
            placeholder="Votre mot de passe!"
            pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{4,8}$" 
            />
        </div>
        <div v-if="msgError" class="probleme center marg20">
         {{msgError}}
        </div>
                <button type="submit" class="btn btn-danger mb-3 mt-3">Me connecter</button>
      </div>



    </form>
  </div>
</template>

<script>
import VueCookies from 'vue-cookies'
import axios from "axios";
export default {
  name: "Authentification",
  data() {

    return {
      dataAuthentification: {
        email: null,
        password: null
      },
      msgError:"",
      msgError2:""

    };
  },
  methods: {
    Authentification() {

        axios
          .post("http://localhost:3000/api/auth/authentification", this.dataAuthentification)
          .then(response => {
            console.log(response.data)

            var jwtToken=JSON.stringify(response.data.token);
            VueCookies.set("jwtToken", jwtToken , "24H");
            document.location.href="/listing";
          })
          .catch(error =>{
          if(error.response.status == 429){
           console.log('test erreur',error.response.status)
           this.msgError=error.response.data
          }else{
            console.log( "test status :", error.response.status)
            this.msgError=error.response.data.error
          }
          
      
          });
    }
  }
};
</script>

<style lang="scss">
</style>