// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios';
import VueAxios from 'vue-axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import 'bootstrap';
import { ValidationProvider, extend } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';
import { ValidationObserver } from 'vee-validate';
import { localize } from 'vee-validate';
import TW from 'vee-validate/dist/locale/zh_TW.json';


import App from './App'

import router from './router';
import './bus';
import currencyFilter  from './filters/currency';
Vue.config.productionTip = false
Vue.use(VueAxios, axios)

// Vue.prototype.$http = axios
Vue.component("Loading",Loading);

Vue.filter('currency', currencyFilter);
extend('required', required);
extend('email', email);
localize('zh_TW', TW);
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

axios.defaults.withCredentials = true;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router
})

router.beforeEach((to, from, next) => {

  if (to.meta.requiresAuth) {
    const api = `${process.env.APIPATH}/api/user/check`;
    axios.post(api).then((response) => {
      console.log(response.data)
      if(response.data.success)
      {
        next();
      }
      else
      {
        next({
          path:'/login'
        })
      }
    });
  } else {
    next();
  }

})