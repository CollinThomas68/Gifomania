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
          <label for="ancienEmail">Email</label>
          <input type="text" class="form-control" id="ancienEmail" placeholder="Votre mail actuel!" v-model="formEmail.emailActuel"/>
          <label for="nouveauEmail">Email</label>
          <input type="text" class="form-control" id="nouveauEmail" placeholder="Votre nouveau mail!" v-model="formEmail.emailNouveau"/>
          <button @click="ModifMail" type="submit" class="btn btn-danger mb-3 mt-3">Modifier</button>
        </div>
        <div v-if="msgEmail!=null" class="validation">
            <span>{{msgEmail}}</span>
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
        <h3>Formulaire de suppression</h3>
        <p>Cette procédure entraîne la suppression totale de votre compte ainsi que de tous vos messages ! </p>
        <form>
          <div class="form-group">
            <label for="inputEmail">Email</label>
            <input type="text" class="form-control" id="inputEmail" required placeholder="Votre mail!" v-model="formControl.emailCompte"/>
          </div>

          <div class="form-group">
            <label for="inputPassword">Password</label>
            <input
              type="password"
              class="form-control"
              id="inputPassword"
              placeholder="Votre mot de passe!"
              required
              v-model="formControl.passwordCompte"
            />
          </div>
          <button @click="Verifcompte" type="submit" class="btn btn-danger mb-3 mt-3" v-if="!affichage">Vérifier Infos</button>
        </form>
        <div v-if="affichage">
          <P>Dernier avertissement, cette procédure est sans retour!</p>
          <button @click="Suppression" type="submit" class="btn btn-danger mb-3 mt-3" >Supprimer mon compte</button>
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
          userDetail:{},
          jwtToken:VueCookies.get("jwtToken"),
          msgError:"",
          msgEmail:"",
          userId:VueCookies.get("userId"),
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

      const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{4,8}$/;
      const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
      if (
        (this.formControl.emailCompte !== null ||
        this.formControl.passwordCompte !== null)  &&
                (regexPassword.test(this.formControl.passwordCompte) && regexEmail.test(this.formControl.emailCompte))
      ) {
        axios
          .delete("http://localhost:3000/api/auth/suppression" , {
            headers: {
              Authorization: "Bearer " + JSON.parse(this.jwtToken)
            }
          })
          .then(response => {

            //localStorage.setItem("userId",JSON.stringify(response.data.userId));
            //localStorage.setItem("jwtToken",JSON.stringify(response.data.token));
            //localStorage.setItem("isAdmin",JSON.stringify(response.data.isAdmin));
            console.log(response);
            VueCookies.remove("userId");
            VueCookies.remove("jwtToken");
            VueCookies.remove("isAdmin")
            document.location.href="/";
          })
          .catch(() => console.log(  "Ca bloque ici"));
      } else {
        console.log("Un problème est survenu !");
      }
    },
    Verifcompte(evt){
         evt.preventDefault();

    
      const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{4,8}$/;
      const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
      if (
        (this.formControl.emailCompte !== null ||
        this.formControl.passwordCompte !== null)  &&
                (regexPassword.test(this.formControl.passwordCompte) && regexEmail.test(this.formControl.emailCompte))
      ) {
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
          .catch(() => console.log(  "Ca bloque ici"));
      } else {
        console.log("Un problème est survenu !");
      }
    },
  
  ModifMail(evt){
         evt.preventDefault();
        console.log(this.formEmail.emailActuel);
        console.log(this.formEmail.emailNouveau);
        console.log(this.formEmail);
     // const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
      //if (
       // (this.formEmail.emailActuel !== null ||
        //this.formEmail.emailNouveau !== null)  &&
          //      (regexEmail.test(this.formEmail.emailActuel) && regexEmail.test(this.formEmail.emailNouveau))
     // ) {
        console.log('test');
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
          .catch(() => console.log(  "Ca bloque ici"));
      //} else {
       // console.log("Un problème est survenu !");
     // }
    }
  }
};

</script>

<style lang="scss">
.validation{
  background-color:green;
  color:white;
}
</style>