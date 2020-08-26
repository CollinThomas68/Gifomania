<template>
  <div class="container">
    <form class=" row">
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
          <input type="text" class="form-control" id="inputEmail" v-model="dataAuthentification.email" placeholder="Votre mail!"/>
        </div>
        <div class="form-group">
          <label for="inputPassword">Password</label>
          <input
            type="password"
            class="form-control"
            id="inputPassword"
            v-model="dataAuthentification.password"
            placeholder="Votre mot de passe!"
          />
        </div>
        <button @click.prevent="Authentification" type="submit" class="btn btn-danger mb-3 mt-3">Me connecter</button>
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
      msg: ""

    };
  },
  methods: {
    Authentification() {
      const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{4,8}$/;
      const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
      if (
        (this.dataAuthentification.email !== null ||
        this.dataAuthentification.password !== null)  &&
                (regexPassword.test(this.dataAuthentification.password) && regexEmail.test(this.dataAuthentification.email))
      ) {
        axios
          .post("http://localhost:3000/api/auth/authentification", this.dataAuthentification)
          .then(response => {
            console.log(response.data)
            //localStorage.setItem("userId",JSON.stringify(response.data.userId));
            //localStorage.setItem("jwtToken",JSON.stringify(response.data.token));
            //localStorage.setItem("isAdmin",JSON.stringify(response.data.isAdmin));
            var jwtToken=JSON.stringify(response.data.token);
            VueCookies.set("userId", response.data.userId , "24H");
            VueCookies.set("jwtToken", jwtToken , "24H");
            VueCookies.set("isAdmin",response.data.isAdmin,"24H")
            document.location.href="/perso";
          })
          .catch(error => console.log(error));
      } else {
        console.log("Un problème est survenu !");
      }
    }
  }
};
</script>

<style lang="scss">
</style>