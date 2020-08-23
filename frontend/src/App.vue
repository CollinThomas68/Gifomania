<template>
  <div id="app">
    <div id="nav">
      <ul>
        <li>
          <router-link to="/">Home | </router-link>
        </li>
        <li>  
          <router-link to="/inscription">Inscription | </router-link>
        </li>
        <li >
          <router-link to="/authentification">Authentification | </router-link>
        </li>
        <li>
          <router-link to="/listing">Tous les Messages | </router-link>
        </li>
        <li>
          <router-link to="/creation">Créer un message | </router-link>
        </li>
        <li>
          <router-link to="/about">About | </router-link>
        </li>
        <li>
          <button type="button" class="btn btn-danger" @click="disconnect">Déconnexion 👋</button>
        </li>
      </ul>
    </div>
    <router-view/>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["user"])
  },
  methods: {
    disconnect() {
      // Pour se déconnecter, On vide le localStorage, on actualise la page et on redirige vers la page d'authentification
      localStorage.clear();
     
      this.$router.push({ path: '/inscription', })

        
           
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
