<template>
  <div id="app">
    <div id="nav">
      <ul>
        <li>
          <router-link to="/">Home | </router-link>
        </li>
        <li>  
          <router-link to="/inscription" v-if="cookie==false">Inscription | </router-link>
        </li>
        <li >
          <router-link to="/authentification" v-if="!cookie">Authentification | </router-link>
        </li>
        <li>
          <router-link to="/choixModeration" v-if="cookie">La sélection de la Modération | </router-link>
        </li>
        <li>
          <router-link to="/listing" v-if="cookie">Tous les Messages | </router-link>
        </li>
        <li>
          <router-link to="/creation" v-if="cookie">Créer un message | </router-link>
        </li>
        <li>
          <router-link to="/perso" v-if="cookie">Espace Perso | </router-link>
        </li>
        <li>
          <router-link to="/about">About | </router-link>
        </li>
        <li>
          <button type="button" class="btn btn-danger" @click="disconnect" v-if="cookie">Déconnexion </button>
        </li>
      </ul>
    </div>
    <router-view/>
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
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
