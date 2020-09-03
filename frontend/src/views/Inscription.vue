<template>
  <div class="container">
    <form class=" row" @submit.prevent="EnvoiInscription">
      <div
        class="col-lg-6"
      >
        <img class="logo" src="../assets/images/icon.svg" alt="Logo Groupomania" />
        <p>
      
            Vous avez déjà un compte,
            <router-link class="redirection-authentification" to="/">Connectez-vous</router-link>
     
        </p>
      </div>
      <div class="col-lg-6 text-align">
        <div class="form-group">
          <label for="inputEmail">Email Groupomania</label>
          <input 
          type="email"
          class="form-control" 
          id="inputEmail" 
          required 
          v-model="dataInscription.email" 
          placeholder="Votre adresse mail"
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          />
        </div>
        <div class="form-group">
          <label for="inputUsername">Username</label>
          <input
          type="text" 
          class="form-control" 
          id="inputUsername" 
          v-model="dataInscription.username" 
          placeholder="Votre nom d'utilisateur" 
          title="Un surnom compris entre 5 et 20 caractères"
          required
          pattern="^[a-z0-9A-Z]{5,20}$"
          />
        </div>
        <div class="form-group">
          <label for="inputPassword">Password</label>
          <input
          type="password" 
          class="form-control" 
          id="inputPassword" 
          v-model="dataInscription.password"
          required 
          title="Entre 4 et 8 caractères 1minuscule, 1majuscule et 1 chiffre mini !"
          placeholder="Votre mot de passe"
          pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{4,8}$" 
          rows="4"
          />
        </div>
        <div v-if="msgError" class="probleme col-lg-6 center marg20">
            {{msgError}}
        </div>
        <div v-if="msg" class="form__message validation marg20" >{{msg}}</div>
         <button  type="submit" class="btn btn-danger mb-3 mt-3" >Créer mon compte</button>
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
      msg: "",
      msgError:""
    };
  },
  methods: {
    EnvoiInscription(evt) {
      evt.preventDefault();
      
        axios
          .post("http://localhost:3000/api/auth/inscription", this.dataInscription)
          .then(response => {
              console.log('test');
            console.log(response);
          this.msg ="Votre compte a été correctement crée. Vous allez être redirigé vers la page de connexion!";
          setTimeout(function () {
            document.location.href = "/";
          }, 3000); 
          })
          .catch(error =>{ console.log(error.response.data.error)
          this.msgError=error.response.data.error});
         
    }

  }
};
</script>

<style lang="scss">

</style>