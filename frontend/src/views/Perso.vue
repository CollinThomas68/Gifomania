<template>
  <div class="about">
    <h1>Ceci est votre page de profil</h1>
    <P> Toujours en chantier, mais bienvenue {{userDetail.username}} !</p>
    <div>{{msgError}}</div>
    
  </div>
</template>

<script>
import VueCookies from 'vue-cookies'
import axios from "axios";
export default {
    data() {
        return {
          //userid: JSON.parse(localStorage.getItem('userId')),
          userid:VueCookies.get('userId'),
          userDetail:{},
          jwtToken:VueCookies.get("jwtToken"),
          msgError:""
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
          var id=this.userid;

        axios
    .get(`http://localhost:3000/api/auth/perso/${id}`,{
      headers:{
        //Authorization: "Bearer " + JSON.parse(localStorage.getItem("jwtToken"))
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
  }
};

</script>