<template>
  <div class="container">
    <div class=" row">
      <div class="col-lg-6 text-align">
        <h3>Bienvenue sur votre espace personnel</h3>
        <p>Ceci est votre espace dédié {{userDetail.username}} ! </p>
        <p>Des fonctionnalités seront bientôt ajoutées, n'hésitez pas à nous faire des propositions d'améliorations!</p>
      </div>
      <div class="col-lg-6 text-align">
        <h3>Formulaire de modification</h3>
        <div class="form-group">
          <label for="inputEmail">Email</label>
          <input type="text" class="form-control" id="inputEmail"  placeholder="Votre mail!"/>
        </div>
        <div class="form-group">
          <label for="inputPassword">Password</label>
          <input
            type="password"
            class="form-control"
            id="inputPassword"
           
            placeholder="Votre mot de passe!"
          />
          <button  type="submit" class="btn btn-danger mb-3 mt-3">Me connecter</button>
        </div>
     
      </div>
      <div class="col-lg text-align">
        <h3>Suppression de votre compte</h3>
        <p>Cette procédure entraîne la suppression totale de votre compte ainsi que de tous vos messages ! </p>
        <p>Pour pouvoir lancer la suppression, veuillez cliquer sur le bouton " J'ai bien compris "</p>
          <button v-on:click="affichage=true" type="submit" class="btn btn-danger mb-3 mt-3" v-if="!affichage" >J'ai bien compris</button>
      
        <button @click="Suppression" type="submit" class="btn btn-danger mb-3 mt-3" v-if="affichage">Supprimer mon compte</button>
      </div>
    </div>
  </div>
</template>

<script>
import VueCookies from 'vue-cookies'
import axios from "axios";
export default {
    data() {
        return {
          formControl: {
          emailCompte:"",
          passwordCompte:""
          },
          userDetail:{},
          jwtToken:VueCookies.get("jwtToken"),
          msgError:"",
          userId:VueCookies.get("userId"),
          affichage:false
        };
    },
    mounted(){
        //Test si le cookie d'authentification existe toujours
              if(VueCookies.isKey("jwtToken")){
               console.log('Utilisateur authentifié')
              }else{
                this.msgError="Vous n'êtes plus authnetifié, vous allez être redirigé vers l'accueil du site !";
                setTimeout(function () {
                document.location.href = "/authentification";
                }, 5000); 
              }


        axios
      .get("http://localhost:3000/api/auth/perso",{

      headers:{
        Authorization: "Bearer " + JSON.parse(this.jwtToken)
      },

      
    })
    .then (response=>{
        

      this.userDetail=response.data;
      console.log(this.userDetail);
    })
          .catch(error => {
              console.log('erreur')
        console.log(error); 
      })
    },
    methods: {
        Suppression(evt) {
          evt.preventDefault();


            axios
              .delete("http://localhost:3000/api/auth/suppression" , {
                headers: {
                  Authorization: "Bearer " + JSON.parse(this.jwtToken)
                }
              })
              .then(response => {

                console.log(response);

                VueCookies.remove("jwtToken");
                VueCookies.remove("isAdmin")
                document.location.href="/";
              })
              .catch(() => console.log(  "Ca bloque ici"));
   
        }
    }
  };

</script>