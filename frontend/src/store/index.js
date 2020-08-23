import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // création d'un modele d'user dans la bibliothèque
    user: {
      username: 'Nc',
      userId: 'Nc',
      email: 'Nc',
      token: null,
      isAdmin: false
    },
    editOption: ""
  },
  mutations: {
    // on sauvegarde les infos des user dans les champs
    saveUserInfos(state, [username, userId, email, isAdmin]) {
        state.user.username = username,
          state.user.userId = userId,
          state.user.email = email,
          state.user.token = localStorage.getItem('token'),
          state.user.isAdmin = isAdmin
    },
    
    editStyle(state, value) {
      state.editOption = value
    }
  },
  actions: {
    // requête pour modifier les données de l'user
    getUserInfos(context) {
      axios
        .get("http://localhost:3000/api/user/perso", {
          // on verifie si l'user à une autorisation : TOKEN valide ...
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })
        .then(response => {
          console.log('réponse API',response);
          //... si oui on remplace les données précédentes par les nouvelles
          context.commit('saveUserInfos',[response.data.username, response.data.id, response.data.email, response.data.isAdmin])
        })
        .catch(error => {
          console.log('Erreur auth', error);
        });
    },
  
    changeEditStyle(context, value){
      context.commit('editStyle',value)
    }
  },
  modules: {
  }
})