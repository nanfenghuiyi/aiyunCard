import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './axios'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vant from 'vant'
import  'vant/lib/index.css'
import global_msg from "./js/global"

Vue.use(Vuex)
Vue.use(ElementUI)
Vue.use(Vant)

Vue.config.productionTip = false
Vue.prototype.$global_msg = global_msg

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
