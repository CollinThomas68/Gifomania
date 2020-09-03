import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import moment from 'moment'
import VueMoment from 'vue-moment'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/bootstrap-vue'
import VueCookies from 'vue-cookies'
import JwPagination from 'jw-vue-pagination';

require('moment/locale/fr');
moment.locale('fr');
Vue.component('jw-pagination', JwPagination);
Vue.use(VueCookies);



Vue.use(VueMoment,{moment});
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
