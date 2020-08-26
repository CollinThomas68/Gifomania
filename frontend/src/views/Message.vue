<template>
    <div >
        <h3>Bienvenue sur la page du message numero {{messageDetail.id}}</h3>
        <h4>Titre : {{messageDetail.title}}</h4>
        <div><img :src="messageDetail.file" :alt="messageDetail.title"/></div>
          <div><p>Posté par : {{messageUser}}</p></div>
        <div><p>Commentaire du posteur : {{messageDetail.text}}</p></div>
        <div >{{msg}}</div>
        <div >{{msgError}}</div>
        <div><button type="button" class="btn btn-danger" @click="suppressionMessage" v-if="isAdmin=='true' || userId==messageDetail.userId">Suppression</button></div>
        <div><button type="button" class="btn btn-danger" @click="setHighlight" v-if="isAdmin=='true' && !messageDetail.highlights">Mettre en avant</button></div>
        <div><button type="button" class="btn btn-danger" @click="disableHighlight" v-if="isAdmin=='true' && messageDetail.highlights">Ne plus mettre en avant</button></div>
    </div>
</template>

<script>
import VueCookies from 'vue-cookies'
import axios from "axios";
export default {
    data() {
        return {
            messageDetail:{},
            messageUser:"",
            msgError:"",
            msg:"",
            jwtToken:VueCookies.get("jwtToken"),
            userId:VueCookies.get("userId"),
            isAdmin:VueCookies.get("isAdmin")

        };
    },
    methods: {
    suppressionMessage() {
      //evt.preventDefault();
      
 
      const id = window.location.pathname.split("message/")[1];

        axios // On effectue la requête grâce à axios et grâce au Token d'identification de l'User
          .delete(`http://localhost:3000/api/message/suppression/${id}`, {
            headers: {
              Authorization: "Bearer " + JSON.parse(this.jwtToken)
            }
          })
          .then(response => {
                console.log(response);
              this.msg="Votre gif a bien été supprimé ! Vous allez être redirigé vers la liste des gifs!";
               setTimeout(function () {
            document.location.href = "/listing";
          }, 5000); 
          

          
            
          }) // Sinon, on affiche une erreur de requête
          .catch(() => {this.msgError = "problème de requète !"});
      
    },
    setHighlight(){
      console.log('Coucou')

      const id = window.location.pathname.split("message/")[1];
        axios // On effectue la requête grâce à axios et grâce au Token d'identification de l'User
          .put(`http://localhost:3000/api/message/highlight/${id}`,{highlights:1},
              
            {
            headers: {
              Authorization: "Bearer " + JSON.parse(this.jwtToken)
            }
          })
          .then(response => {
                console.log(response);
              this.msg="Ce gif a bien été placé dans les HighLights!";
               setTimeout(function () {
            document.location.href = "/listing";
          }, 5000); 
                    }) // Sinon, on affiche une erreur de requête
          .catch(() => {this.msgError = "problème de requète !"});
    },
    disableHighlight(){
      console.log('Coucou')
      const id = window.location.pathname.split("message/")[1];
        axios // On effectue la requête grâce à axios et grâce au Token d'identification de l'User
          .put(`http://localhost:3000/api/message/highlight/${id}`,{highlights:0}, {
            headers: {
              Authorization: "Bearer " + JSON.parse(this.jwtToken)
            }
          })
          .then(response => {
                console.log(response);
              this.msg="Ce gif a bien été supprimé des HighLights!";
               setTimeout(function () {
            document.location.href = "/listing";
          }, 5000); 
                    }) // Sinon, on affiche une erreur de requête
          .catch(() => {this.msgError = "problème de requète !"});
    }
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


          const id = window.location.pathname.split("message/")[1];
          console.log(id);
          console.log('Test admin :');
          console.log(this.isAdmin);
        axios
    .get(`http://localhost:3000/api/message/messageDetail/${id}`,{
      headers:{
        //Authorization: "Bearer " + JSON.parse(localStorage.getItem("jwtToken"))
        Authorization: "Bearer " + JSON.parse(VueCookies.get("jwtToken"))
      },

      
    })
    .then (response=>{
        

      this.messageDetail=response.data;
      this.messageUser=this.messageDetail.User.username;
      console.log(this.messageDetail);
    })
          .catch(error => {
              console.log('erreur')
        console.log(error); 
      })
  }
};

</script>