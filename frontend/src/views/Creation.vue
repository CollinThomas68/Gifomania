
<template>
  <div>
    <div class="block-post w-75 mt-5">
      <h3 class="mt-2"> Créer un Message </h3>
      <form enctype="multipart/form-data" action="/creation" method="post">
        <div class="input-group ">
          <label for="input_title">Quel sera le titre de votre gif?</label>
          <br />
          <input v-model="formCreation.title" class="input-text"  id="input_title" type="text" required/>
        </div>
        <div class="input-group ">
          <label for="input_description">Saisissez une brève description du gif</label>
          <br />
          <textarea v-model="formCreation.content" class="input-text" rows="3" id="input_description" type="text" required/>
        </div>
        
        <div>

           <div class="inputFile"> Télécharger une image
                <input name="inputFile" placeholder="Choisir un fichier" id="inputFile" type="file" class="inputFile" @change="onFileChange" accept="image/*">
            </div>
              <div class="image-preview" v-if="formCreation.image.length > 0">
               <img class="preview" :src="formCreation.image" height="100px">
              </div>
        </div>
        <button type="submit" @click.prevent="creationMessage" class="btn btn-secondary btn-poster mb-3 mt-3">Poster</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "CreationMessage",
  data() {
    return {
      formCreation: {
        userId:JSON.parse(localStorage.getItem('userId')),
        title:"",
        text:"",
        fichier:null,
        image:""
      },
      msg: ""
    };
  },
  methods: {
    creationMessage() {
      const fd = new FormData();
      const image =this.formCreation.fichier;
      const message = {
          userId: this.formCreation.userId,
          title: this.formCreation.title,
          content: this.formCreation.content
      };
  
      console.log(message);
      console.log('test Fichier');
      console.log(fichier);
      fd.append("message",JSON.stringify(message));
      //fd.append("file",this.formCreation.fichier);
      console.log('Test :');
      console.log(fd);
      console.log(localStorage.getItem("jwtToken"));
      /*//on déclare une constante FormData pour stocker les infos du Post
      if (fd.get("image") == "null" && fd.get("message") == "null") { 
        // si il n'y à rien a publier on affiche un texte d'erreur 
        let msgReturn = document.getElementById('msgReturnAPI')
        msgReturn.classList.add('text-danger')
        //this.msgError = "Vous devez au moins nous dire quelque chose !!";
      } else {*/
        axios // On effectue la requête grâce à axios et grâce au Token d'identification de l'User
          .post("http://localhost:3000/api/message/", fd, {
            headers: {
              Authorization: "Bearer " + JSON.parse(localStorage.getItem("jwtToken"))
            }
          })
          .then(response => {
            if (response) {
              window.location.reload();
            }
          }) // Sinon, on affiche une erreur de requête
          .catch(error => (this.msgError = error));
      
    },
    onFileChange(e) {
       console.log(e);
         this.formCreation.fichier = e.target.files[0] || e.dataTransfer.files;
       console.log(this.formCreation.fichier);
            var input = event.target;
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = (e) => {
                    this.formCreation.image = e.target.result;
                }
                reader.readAsDataURL(input.files[0]);
            }
    }
  }
};
</script>


<style lang="scss">
</style>