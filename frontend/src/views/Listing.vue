<template>
    <div>
        <div class="card text-center m-3">
            <h3>Tous les gifs de la communauté !</h3>
        </div>

        <div class="card-body container">
          <div class="row">
            <div v-for="message in pageOfItems" :key="message.id"  class="col-md-6">
                <b-card
                :title="message.title"
                :img-src="message.file"
                :img-alt="message.title"
                img-top
                tag="article"
                style="max-width: 20rem;"
                class="mb-2 cardlisting"
              >
                <b-card-text class="wrap">
                    {{message.text}}
                </b-card-text>

                <b-button v-bind:href="'message/'+ message.id" variant="primary">Accéder aux détails</b-button>
              </b-card>

                
            </div>
          </div>
          <div class="probleme marg20">{{msgError}}</div>
            
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
    .get("http://localhost:3000/api/message/listing",{
      headers:{
        Authorization: "Bearer " + JSON.parse(this.jwtToken)
      }
      
    })
    .then (response=>{
      this.messageItems=response.data;
    })
    .catch(error =>{ console.log(error.response.data.error)
          this.msgError=error.response.data.error});
  }
};

</script>
