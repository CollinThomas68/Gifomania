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
</div>
</template>
<!--<template>
  <div id="app">
    <div class="container">
    <div class="row">
    <nav class="col navbar navbar-expand-lg justify-content align-items-center">
      <router-link to="/">Groupomania | </router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarContent">
      <span class="navbar-toggler-icon"></span>
      </button>
      <div id="navbarContent" class="collapse navbar-collapse">
      <ul class="navbar-nav">
        <li class="nav-item active">
          <router-link to="/">Home | </router-link>
        </li>
        <li v-if="!cookie" class="nav-item">  
          <router-link to="/inscription"> Inscription | </router-link>
        </li>
        <li v-if="!cookie" class="nav-item">
          <router-link to="/authentification"> Authentification | </router-link>
        </li>
        <li v-if="cookie" class="nav-item">
          <router-link to="/choixModeration"> La sélection de la Modération | </router-link>
        </li>
        <li v-if="cookie" class="nav-item">
          <router-link to="/listing"> Tous les Messages | </router-link>
        </li>
        <li v-if="cookie" class="nav-item">
          <router-link to="/creation"> Créer un message | </router-link>
        </li>
        <li v-if="cookie" class="nav-item">
          <router-link to="/perso" > Espace Perso | </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/about"> About | </router-link>
        </li>
        <li v-if="cookie" class="nav-item">
          <button type="button" class="btn btn-danger" @click="disconnect" v-if="cookie"> Déconnexion </button>
        </li>
      </ul>
      </div>
    </nav>
    </div></div>
    <router-view/>
  </div>
</template>
-->
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
}

nav {
  //padding: 30px;

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


</style>
