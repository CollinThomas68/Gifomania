<template>
<div>
        <div class="card text-center m-3">
            <h3>Tous les gifs de la communauté !</h3>
        </div>
        <div class="center">
  <b-form @submit="creationMessage" class="col-lg-10" >
    <b-form-group id="input-group-1" label="Titre :" label-for="input-1" label-cols-sm="auto">
      <b-form-input
        id="input-1"
        v-model="form.title"
        type="text"
        required
        placeholder="Titre de l'image"
      ></b-form-input>
    </b-form-group>

    <b-form-group id="input-group-2" label="Commentaire :" label-for="input-2" label-cols-sm="auto">
      <b-form-textarea
        id="input-2"
        v-model="form.text"
        type="text"
        required
        placeholder="Votre texte ici (max 255 caractères)"
        maxlength="255"
        rows="3"
        max-rows="5"
      ></b-form-textarea>
    </b-form-group>

    <b-form-group
      id="input-group-3"
      label="Ajouter une image :"
      label-for="input-3"
      labels-cols-sm="auto"
      label-size="sm"
    >
      <b-form-file
        v-model="form.file"
        type="file"
        placeholder="Choisissez une image au format .jpg ou .png... max 5Mo"
        drop-placeholder="Drop file here..."
        accept=".jpg, .jpeg, .png, .gif"
        size="sm"
        required
      ></b-form-file>
      <div v-if="form.file" class="mt-2">Fichier sélectionné : {{ form.file ? form.file.name : ''}}</div>
    </b-form-group>
    <div v-if="msgError" class="probleme marg20">{{msgError}}</div>
    <div v-if="msg" class="validation marg20">{{msg}}</div>
    <b-button class="button" type="submit" variant="dark">Envoyer</b-button>
    <b-button class="button-reset" size="sm" type="reset" variant="danger">Effacer</b-button>
  </b-form>
  </div>
  </div>
</template>

<script>
import VueCookies from 'vue-cookies'
import axios from "axios";
export default {
  name: "Creation",
  data() {
    return {
      form: {
        userId:VueCookies.get('userId'),
        title:"",
        text:"",
        file:[]
      },
      msg: "",
      msgError:"",
      jwtToken:VueCookies.get("jwtToken")
     

    };
  },
  mounted(){
            //Test si le cookie d'authentification existe toujours
              if(VueCookies.isKey("jwtToken")){
               console.log('Utilisateur authentifié')
              }else{
                this.msgError="Vous n'êtes plus authentifié, vous allez être redirigé vers l'accueil du site !";
                setTimeout(function () {
                document.location.href = "/";
                }, 5000); 
              }
  },
  methods: {
    creationMessage(evt) {
      evt.preventDefault();
      const fd = new FormData();
      const image =this.form.file;
      console.log('image :',image);
      const message = {
          title: this.form.title,
          text: this.form.text
      };
      console.log('test nom image :', image.name);
      var nomimage = image.name;
      var extension = nomimage.substring(nomimage.lastIndexOf(".")+1, nomimage.length);
      console.log("extension : ",extension);
      console.log(message);
      console.log('test image');
      console.log(image);
      fd.append("message",JSON.stringify(message));
      fd.append("image",image);
      console.log('Test :');
      console.log(fd);
      console.log(this.jwtToken);
      
      if(this.jwtToken){
        if(extension === 'jpg' || extension ==='jpeg' || extension === 'png' || extension === 'gif'){
        axios // On effectue la requête grâce à axios et grâce au Token d'identification de l'User
          .post("http://localhost:3000/api/message/creation", fd, {
            headers: {
              Authorization: "Bearer " + JSON.parse(this.jwtToken)
            }
          })
          .then(response => {
                console.log(response);
              this.msg="Votre gif a bien été enregistré, vous allez être redirigé vers la section des gifs !";
               setTimeout(function () {
            document.location.href = "/listing";
          }, 5000); 
          

          
            
          }) // Sinon, on affiche une erreur de requête
                    .catch(error =>{ console.log(error.response.data.error)
          this.msgError=error.response.data.error});
        }else{
          this.msgError="Ce type de fichier n'est pas pris en compte !"
        }
      }else{
        this.msgError="Merci de vous authentifier pour poster un gif!"
      }
    }
  }
};
</script>


<style lang="scss">

</style>