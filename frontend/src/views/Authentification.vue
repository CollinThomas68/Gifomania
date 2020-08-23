<template>
  <div>
    <form class="w-75 align-items-center form-block d-flex m-auto shadow rounded">
      <div
        class="form-block--left d-flex flex-column justify-content-center block-demi-container p-3 text-right align-self-stretch"
      >
        <img class="logo align-self-end" src="../assets/images/icon.svg" alt="Logo Groupomania" />
        <p>
          <small>
            Vous n'avez pas encore de compte,
            <router-link class="redirection-inscription" to="/inscription">Enregistrez-vous</router-link>
          </small>
        </p>
      </div>
      <div class="block-demi-container p-3">
        <div class="form-group">
          <label for="inputEmail">Email</label>
          <input type="text" class="form-control" id="inputEmail" v-model="dataAuthentification.email" />
        </div>
        <div class="form-group">
          <label for="inputPassword">Password</label>
          <input
            type="password"
            class="form-control"
            id="inputPassword"
            v-model="dataAuthentification.password"
          />
        </div>
        <button @click.prevent="Authentification" type="submit" class="btn btn-primary">Me connecter</button>
      </div>
    </form>
  </div>
</template>

<script>
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
      if (
        this.dataAuthentification.username !== null ||
        this.dataAuthentification.password !== null
      ) {
        axios
          .post("http://localhost:3000/api/auth/authentification", this.dataAuthentification)
          .then(response => {
            console.log(response.data)
            localStorage.setItem("userId",JSON.stringify(response.data.userId));
            localStorage.setItem("jwtToken",JSON.stringify(response.data.token));
            localStorage.setItem("isAdmin",JSON.stringify(response.data.isAdmin));
            this.$router.push('/perso');
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