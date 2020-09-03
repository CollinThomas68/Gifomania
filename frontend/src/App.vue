<template>
<div id="app">
     <header>
      <h1><img alt="Vue logo" class="logo" src="./assets/images/icon-left-font3.png"></h1>
    </header>
  <b-navbar toggleable="md" type="light"  variant="light">
    <b-navbar-brand ><img alt="navbar logo" src="./assets/images/iconmini.png"></b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"  class="white"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        
        <b-nav-item router-link to="/inscription" v-if="!cookie">S'inscrire</b-nav-item>
        <b-nav-item router-link to="/" v-if="!cookie">Se connecter</b-nav-item>
        <b-nav-item router-link to="/listing" v-if="cookie"> Tous les Messages</b-nav-item>
        <b-nav-item router-link to="/choixModeration" v-if="cookie"> La sélection</b-nav-item>
        <b-nav-item router-link to="/creation" v-if="cookie"> Créer un message</b-nav-item>
        <b-nav-item router-link to="/perso" v-if="cookie"> Mon profil</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-button class="btn btn-danger" @click="disconnect" v-if="cookie"> Déconnexion </b-button>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
   <router-view/>
       <footer>
      <ul class="list-inline">
        <li class="list-inline-item"><a class="social-icon text-xs-center" target="_blank" href="/#"><img src="./assets/images/facebookicon.jpg" alt="Logo Facebook"/></a></li>
        <li class="list-inline-item">&middot;</li>
        <li class="list-inline-item"><a class="social-icon text-xs-center" target="_blank" href="/#"><img src="./assets/images/twitter.png" alt="Logo twitter"/></a></li>
        <li class="list-inline-item">&middot;</li>
        <li class="list-inline-item"><a class="social-icon text-xs-center" href="/about"><b>A propos</b></a></li>
        <li class="list-inline-item">&middot;</li>
        <li class="list-inline-item"><a href="mailto:moderation@groupomania.fr" title="Nous contacter"><b>Contactez-nous</b></a></li>
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
.logo{
  width:300px;
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
  height: 40px;
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
