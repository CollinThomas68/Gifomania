<template>
    <div >
      <div>
        <h3>Bienvenue sur la page du message numero {{messageDetail.id}}</h3>
        <div class="affichageMess">
          <h4>Titre : {{messageDetail.title}}</h4>

          <div class="center">


              <b-card
                :title="messageDetail.title"
                :img-src="messageDetail.file"
                :img-alt="messageDetail.title"
                img-top
                style="max-width: 40rem;"
                class="mb-2 cardlisting"
              >
                <b-card-text class="wrap">
                  <b><u>Posté par :</u></b> {{messageUser}}<br>
                  <b><u>Commentaire du posteur :</u></b> 
                    {{messageDetail.text}}
                </b-card-text>
              </b-card>

          </div>
          <div class="validation marg20">{{msg}}</div>
          <div class="probleme marg20">{{msgError}}</div>
          <div><button type="button" class="btn btn-danger marg20" @click="suppressionMessage" v-if="isAdmin=='true' || userId==messageDetail.userId">Suppression</button></div>
          <div><button type="button" class="btn btn-danger marg20" @click="setHighlight" v-if="isAdmin==='true' && !messageDetail.highlights">Mettre en avant</button></div>
          <div><button type="button" class="btn btn-danger marg20" @click="disableHighlight" v-if="isAdmin==='true' && messageDetail.highlights">Ne plus mettre en avant</button></div>
        </div>
      </div>
      <div  class="center">  
        <b-form @submit="creationCommentaire" class="col-lg-10" >

          <b-form-group id="comment-group-1" label="Commentaire :" label-for="comment-1" label-cols-sm="auto">
            <b-form-textarea
              id="comment-1"
              v-model="form.text"
              type="text"
              required
              placeholder="Votre texte ici (max 255 caractères)"
              maxlength="255"
              rows="3"
              max-rows="5"
            ></b-form-textarea>
          </b-form-group>
             <b-button class="button" type="submit" variant="dark">Envoyer</b-button>
        </b-form>
      </div>
        <div class="card text-center m-3">
            <h3>Tous les commentaires de la communauté pour ce message !</h3>
        </div>
            
        <div class="card-body">
            <div v-for="commentaire in pageOfItems" :key="commentaire.id">
              <div class="row marg20">
                <div class="col-md-3"><p><b><u>Posté par : {{commentaire.username}}</u></b><br>
                {{commentaire.createdAt}}</p></div>
                <div class="col-md-9 border backcolor wrap">{{commentaire.text}}</div>
              </div>  
            </div>

            
        </div>
        <div class="card-footer pb-0 pt-3">
            <jw-pagination :items="commentaireItems" @changePage="onChangePage" :pageSize="10"></jw-pagination>
        </div>
    </div>
</template>

<script>
import VueCookies from 'vue-cookies'
import axios from "axios";
export default {
    data() {
        return {
          commentaireItems:[],
          pageOfItems: [],
          form:{
            text:""
          },
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
    onChangePage(pageOfItems) {
  // update page of items
                this.pageOfItems = pageOfItems;
        },
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
          .catch(() => {this.msgError = "Vous n'êtes pas autorisé à faire ceci !"});
      
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
          .catch(error =>{ console.log(error.response.data.error)
          this.msgError=error.response.data.error});
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
            document.location.href = "/choixModeration";
          }, 5000); 
                    }) // Sinon, on affiche une erreur de requête
          .catch(error =>{ console.log(error.response.data.error)
          this.msgError=error.response.data.error});
       
    },creationCommentaire(evt) {
      evt.preventDefault();
      const id = window.location.pathname.split("message/")[1];
      if(this.jwtToken){
        axios // On effectue la requête grâce à axios et grâce au Token d'identification de l'User
          .post(`http://localhost:3000/api/commentaire/creation/${id}`, this.form, {
            headers: {
              Authorization: "Bearer " + JSON.parse(this.jwtToken)
            }
          })
          .then(response => {
                console.log(response);
              this.msg=response.data.message;
              setTimeout(function () {
            location.reload();
          }, 3000); 
          

          
            
          }) // Sinon, on affiche une erreur de requête
                    .catch(error =>{ console.log(error.response.data.error)
          this.msgError=error.response.data.error});
      }else{
        this.msgError="Merci de vous authentifier pour poster un commentaire"
      }
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


    //Requète pour obtenir les infos détaillées du message      
    axios
    .get(`http://localhost:3000/api/message/messageDetail/${id}`,{
      headers:{
        Authorization: "Bearer " + JSON.parse(VueCookies.get("jwtToken"))
      },

      
    })
    .then (response=>{
      
     
      this.messageDetail=response.data;
      this.messageUser=this.messageDetail.User.username;
      console.log('Reponse serveur',this.messageDetail);
    })
     .catch(error =>{ console.log(error.response.data.error)
          this.msgError=error.response.data.error});

    //Requète pour obtenir le listing des commentaires liés à ce message           
    axios
    .get(`http://localhost:3000/api/commentaire/listing/${id}`,{
      headers:{
        Authorization: "Bearer " + JSON.parse(this.jwtToken)
      }
      
    })
    .then (response=>{
      this.commentaireItems=response.data;
      console.log(this.commentaireItems);
    })
    .catch(error =>{ console.log(error.response.data.error)
          this.msgError=error.response.data.error});
  }
};

</script>
<style lang="scss">

</style>