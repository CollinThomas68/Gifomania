<template>
  <div class="container">
    <form class=" row">
      <div
        class="col-lg-6"
      >
        <img class="logo" src="../assets/images/icon.svg" alt="Logo Groupomania" />
        <p>
      
            Vous avez déjà un compte,
            <router-link class="redirection-authentification" to="/authentification">Connectez-vous</router-link>
     
        </p>
      </div>
      <div class="col-lg-6 text-align">
        <div class="form-group">
          <label for="inputEmail">Email Groupomania</label>
          <input type="email" class="form-control" id="inputEmail" v-model="dataInscription.email" placeholder="Votre adresse mail" required/>
        </div>
        <div class="form-group">
          <label for="inputUsername">Username</label>
          <input type="text" class="form-control" id="inputUsername" v-model="dataInscription.username" placeholder="Un surnom compris entre 5 et 20 caractères" required/>
        </div>
        <div class="form-group">
          <label for="inputPassword">Password</label>
          <input type="password" class="form-control" id="inputPassword" v-model="dataInscription.password" required placeholder="Entre 4 et 8 caractères 1minuscule, 1majuscule et 1 chiffre mini !" />
        </div>
        <p class="form__message">{{msg}}</p>
         <button @click.prevent="EnvoiInscription" type="submit" class="btn btn-danger mb-3 mt-3" >Créer mon compte</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Inscription",
  data() {
    return {
      dataInscription: {
        username: null,
        email: null,
        password: null
      },
      msg: ""
    };
  },
  methods: {
    EnvoiInscription() {
      const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{4,8}$/;
      const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
      const usernameRegex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{5,20}$/;
      if (
        (this.dataInscription.email !== null ||
        this.dataInscription.username !== null ||
        this.dataInscription.password !== null) &&
        (regexPassword.test(this.dataInscription.password) && regexEmail.test(this.dataInscription.email) && usernameRegex.test(this.dataInscription.username))
      ) {
        axios
          .post("http://localhost:3000/api/auth/inscription", this.dataInscription)
          .then(response => {
              console.log('test');
            console.log(response);
          this.msg ="Votre compte a été correctement crée. Vous allez être redirigé vers la page de connexion!";
          setTimeout(function () {
            document.location.href = "/authentification";
          }, 5000); 
          })
          .catch(error => console.log(error));
      } else {
        alert("Vos saisies ne sont pas conformes!");
      }
    }
  }
};
</script>

<style lang="scss">
.text-align{
  text-align:center;
}
.form-control{
  text-align:center;
}
.col-lg-6{
  border :2px solid black;
  display:flex;
  flex-direction:column;
  justify-content: center;
  align-items:center;
}
</style>