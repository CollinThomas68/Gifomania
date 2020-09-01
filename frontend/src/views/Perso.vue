<template>
<div>
  <div class="card text-center m-3">
      <h3>Votre espace personnel !</h3>
  </div>
  <div class="container">
    <div class=" row">
      <!--Haut de page-->
      <div class="col-lg-6 text-align marg20">
         
        <h4>Bienvenue sur votre espace personnel</h4>
        <img class="logo" src="../assets/images/icon.svg" alt="Logo Groupomania" />
        <p>Ceci est votre espace dédié {{userDetail.username}} ! </p>
        <p>Votre adresse mail est : {{userDetail.email}}</p>
        <p>Des fonctionnalités seront bientôt ajoutées, n'hésitez pas à nous faire des propositions d'améliorations!</p>
      </div>
      <div class="col-lg-6 text-align backcolor marg20">
        <h3>Formulaire de modification</h3>
        <!--Modif Mail-->
        <form @submit.prevent="ModifMail">
        <div class="form-group">
          <label for="ancienEmail"><b><u>Email actuel :</u></b></label>
          <input 
          type="email" 
          class="form-control" 
          id="ancienEmail" 
          placeholder="Votre mail actuel!" 
          v-model="formEmail.emailActuel" 
          required
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"/>
          <label for="nouveauEmail"><b><u>Email nouveau :</u></b></label>
          <input 
          type="email" 
          class="form-control" 
          id="nouveauEmail" 
          placeholder="Votre nouveau mail!" 
          v-model="formEmail.emailNouveau" 
          required
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"/>
            </div>
              <div v-if="msgEmail!=null" class="validation marg20">
            <span>{{msgEmail}}</span>
        </div>
        <div v-if="msgEmailError" class="probleme marg20">
            <span>{{msgEmailError}}</span>
        </div>
          <button  type="submit" class="btn btn-danger mb-3 mt-3">Modifier mon Email</button>
      
        </form>
  
        <!--Modif Password-->
        <form @submit.prevent="ModifPassword">
        <div class="form-group">
          <label for="actuelPassword"><b><u>Password actuel :</u></b></label>
          <input
            type="password"
            class="form-control"
            id="actuelPassword"
            v-model="formPassword.passwordActuel"
            placeholder="Votre mot de passe actuel!"
            required
            pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{4,8}$"
          />
             <label for="nouveauPassword"><b><u>Password nouveau :</u></b></label>
          <input
            type="password"
            class="form-control"
            id="nouveauPassword"
            v-model="formPassword.passwordNouveau"
            placeholder="Votre nouveau mot de passe"
            title="Le nouveau, 4 à 8 caractères, 1maj, 1 min et 1 chiffre mini!"
            required
            pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{4,8}$"
            rows="3"
          />
        <div v-if="msgPassword!=null" class="validation marg20">
            <span>{{msgPassword}}</span>
        </div>
            <div v-if="msgPasswordError" class="probleme marg20">
              <span>{{msgPasswordError}}</span>
          </div>
          <button  type="submit" class="btn btn-danger mb-3 mt-3">Modifier mon mot de passe</button>
        </div>
    
        </form>
   
      </div>
      <div class="col-lg text-align backcolor">
        <h3>Formulaire de suppression</h3>
        <p>Cette procédure entraîne la suppression totale de votre compte ainsi que de tous vos messages ! </p>
        <form @submit.prevent="Verifcompte">
          <div class="form-group">
            <label for="inputEmail"><b><u>Votre Email :</u></b></label>
            <input 
            type="email" 
            class="form-control" 
            id="inputEmail" 
            required 
            placeholder="Votre mail!" 
            v-model="formControl.emailCompte"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            />
          </div>

          <div class="form-group">
            <label for="inputPassword"><b><u>Votre Password :</u></b></label>
            <input
              type="password"
              class="form-control"
              id="inputPassword"
              placeholder="Votre mot de passe!"
              required
              v-model="formControl.passwordCompte"
              pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{4,8}$"              
            />
          </div>
          <div v-if="msgVerifCompte" class="probleme marg20">
              <span>{{msgVerifCompte}}</span>
          </div>
          <button  type="submit" class="btn btn-danger mb-3 mt-3" v-if="!affichage">Vérifier Infos</button>
   
        </form>
        <div v-if="affichage" class="validation">
          <P>Dernier avertissement, cette procédure est sans retour!</p>
          <div v-if="msgVerifCompte" class="probleme marg20">
              <span>{{msgVerifCompte}}</span>
          </div>
          <button @click="Suppression" type="submit" class="btn btn-danger mb-3 mt-3" >Supprimer mon compte</button>
        </div>


      </div>
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
          formEmail:{
            emailActuel:"",
            emailNouveau:""
          },
          formPassword:{
            passwordActuel:"",
            passwordNouveau:""
          },
          userDetail:{},
          jwtToken:VueCookies.get("jwtToken"),
          msgEmail:"",
          msgEmailError:"",
          msgPassword:"",
          msgPasswordError:"",
          msgVerifCompte:"",
          msgSuppression:"",
          affichage:false
        };
    },
    mounted(){
        //Test si le cookie d'authentification existe toujours
              if(VueCookies.isKey("jwtToken")){
               console.log('Utilisateur authentifié')
              }else{
                this.msgError="Vous n'êtes plus authentifié, vous allez être redirigé vers l'accueil du site !";
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
            VueCookies.remove("userId");
            VueCookies.remove("jwtToken");
            VueCookies.remove("isAdmin")
            document.location.href="/";
          })
          .catch(error =>{ console.log(error.response.data.error)
          this.msgSuppression=error.response.data.error});

    },
    Verifcompte(){


        axios
          .put("http://localhost:3000/api/auth/verif" , this.formControl,{
            headers: {
              Authorization: "Bearer " + JSON.parse(this.jwtToken)
            }
          })
          .then(response => {
            console.log(response);
            this.affichage=true;
          })
         .catch(error =>{ console.log(error.response.data.error)
          this.msgVerifCompte=error.response.data.error});
    },
  
  ModifMail(){

        axios
          .put("http://localhost:3000/api/auth/modifmail" , this.formEmail,{
            headers: {
              Authorization: "Bearer " + JSON.parse(this.jwtToken)
            }
          })
          .then(response => {
            console.log(response.data.message);
            this.msgEmail=response.data.message;
            setTimeout(function () {
            document.location.href = "/perso";
          }, 2500); 
          
          })

          .catch(error =>{ console.log(error.response.data.error)
          this.msgEmailError=error.response.data.error});
          
    },
  
  ModifPassword(){
        


        axios
          .put("http://localhost:3000/api/auth/modifpassword" , this.formPassword,{
            headers: {
              Authorization: "Bearer " + JSON.parse(this.jwtToken)
            }
          })
          .then(response => {
            console.log(response.data.message);
            this.msgPassword=response.data.message;
            setTimeout(function () {
            document.location.href = "/perso";
          }, 2500); 
          
          })

          .catch(error =>{ console.log(error.response.data.error)
          this.msgPasswordError=error.response.data.error});

    }
     }
};

</script>

<style lang="scss">

</style>