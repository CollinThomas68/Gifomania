<template>
    <div>
        <div class="card text-center m-3">
            <h3>La sélection de la modération !</h3>
        </div>
            
        <div class="card-body">
            <div v-for="message in pageOfItems" :key="message.id">
                <a v-bind:href="'message/'+ message.id"><h4>{{message.title}}</h4>
                <div><img :src="message.file" alt="message.title"/></div>
                <div><p>Posté par : {{message.User.username}}</p></div>
                </a>
            </div>
          <div>{{msgError}}</div>
            
        </div>
        <div class="card-footer pb-0 pt-3">
            <jw-pagination :items="messageItems" @changePage="onChangePage" :pageSize="10"></jw-pagination>
        </div>
    </div>
</template>

<script>
import VueCookies from 'vue-cookies'
import axios from "axios";
export default {
    data() {
        return {
            messageItems:[],
            pageOfItems: [],
            jwtToken:VueCookies.get("jwtToken"),
            msgError:""
        };
    },
    methods: {

        onChangePage(pageOfItems) {
            // update page of items
            this.pageOfItems = pageOfItems;
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
        axios
    .get("http://localhost:3000/api/message/choixModeration",{
      headers:{
        Authorization: "Bearer " + JSON.parse(this.jwtToken)
      }
      
    })
    .then (messages=>{
        console.log(messages);
        console.log(messages.data);
      this.messageItems=messages.data;
    })
          .catch(error => {
              console.log('erreur')
        console.log(error); 
      })
  }
};

</script>