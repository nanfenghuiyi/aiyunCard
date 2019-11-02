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
import 'lib-flexible'
// 图片浏览组件
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
// 懒加载
import VueLazyload from "vue-lazyload"

Vue.use(Vuex)
Vue.use(ElementUI)
Vue.use(Vant)
Vue.use(Viewer)

// 或者添加VueLazyload 选项
Vue.use(VueLazyload, {
  loading: "/src/assets/loading.png"
})


Vue.config.productionTip = false
Vue.prototype.$global_msg = global_msg

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
