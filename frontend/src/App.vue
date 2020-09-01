<template>
<div id="app">
  <b-navbar toggleable="lg" type="light"  variant="light">
    <b-navbar-brand >Groupomania</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"  class="white"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item router-link to="/">Home</b-nav-item>
        <b-nav-item router-link to="/inscription" v-if="!cookie">Inscription</b-nav-item>
        <b-nav-item router-link to="/authentification" v-if="!cookie"> Authentification</b-nav-item>
        <b-nav-item router-link to="/choixModeration" v-if="cookie"> La sélection de la Modération</b-nav-item>
        <b-nav-item router-link to="/listing" v-if="cookie"> Tous les Messages</b-nav-item>
        <b-nav-item router-link to="/creation" v-if="cookie"> Créer un message</b-nav-item>
        <b-nav-item router-link to="/perso" v-if="cookie"> Espace Perso</b-nav-item>
        <b-nav-item router-link to="/about"> About</b-nav-item>    
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-button class="btn btn-danger" @click="disconnect" v-if="cookie"> Déconnexion </b-button>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
   <router-view/>
       <footer>
      <ul class="list-inline">
        <li class="list-inline-item"><a class="social-icon text-xs-center" target="_blank" href="#">FB</a></li>
        <li class="list-inline-item">&middot;</li>
        <li class="list-inline-item"><a class="social-icon text-xs-center" target="_blank" href="#">G+</a></li>
        <li class="list-inline-item">&middot;</li>
        <li class="list-inline-item"><a class="social-icon text-xs-center" target="_blank" href="#">T</a></li>
        <li class="list-inline-item">&middot;</li>
        <li class="list-inline-item"><a href="mailto:moderation@groupomania.fr" title="Nous contacter">Contactez-nous</a></li>
     </ul>
    </footer>
</div>
</template>

<script>
import VueCookies from 'vue-cookies'
export default {
  data(){
    return{
      cookie:''
      
    };
  },
  methods: {
    disconnect() {
      // Pour se déconnecter, On vide le localStorage, on actualise la page et on redirige vers la page d'authentification
      //localStorage.clear();
      VueCookies.remove("jwtToken");
      VueCookies.remove("userId");
      VueCookies.remove("isAdmin");
      document.location.href = "/";

        
           
          }
  },mounted(){
    if(VueCookies.isKey("jwtToken")){
      this.cookie=true;
    }else{
      this.cookie=false;
    }
  }
};
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding-bottom:125px;
}
h1{
  font-size:2rem;
}
nav {
  margin-bottom:30px;

  a {
    font-weight: bold;
    color: white;

    &.router-link-exact-active {
      color: black !important;
    }
  }
  li{
    padding-left : 5px;
  }

}
.validation{
  background-color:green;
  color:white;
}
.probleme{
  background-color:red;
  color:white;
}

.text-align{
  text-align:center;
}
.form-control{
  text-align:center;
}
.col-lg-6{
  border :2px solid #f8f9fa;
  display:flex;
  flex-direction:column;
  justify-content: center;
  align-items:center;
  
}
.col-md-6{
    display:flex;
  flex-direction:column;
  justify-content: center;
  align-items:center;

}
.border{
   border :2px solid #f8f9fa;
}

footer {
    position: fixed;
    height: 100px;
    bottom: 0;
    width: 100%;
    text-align:center;
    background-color:#f8f9fa;
    display:flex;
    margin-top: 25px;
    padding-top: 20px;
      a{
         color:#fd2d01;
         font-style: bold;
      }

}
header{
  background-color:#f8f9fa;
  height:100px;
  text-align:center;
}
.col-lg-10{
  border: solid 2px #f8f9fa;
  padding:15px;
  background-color:#f8f9fa;
}

.center{
  display:flex;
  justify-content:center;
}
.test{
  background-color:#f8f9fa;
}
.card{
    background-color : #f8f9fa !important;
    padding:10px;
}
.cardlisting{
      background-color : #f8f9fa !important;
      padding:10px;
      
}
 .marg20{
   margin-bottom:20px;
 }
 .backcolor{
         background-color : #f8f9fa !important;
 }
 .wrap{
   word-wrap: break-word;
 }
</style>
