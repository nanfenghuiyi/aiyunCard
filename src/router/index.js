import Vue from 'vue'
import VueRouter from 'vue-router'
// import Checkupload from "../views/Checkupload.vue"
import Home from "../views/Home.vue"
import Upload from "../views/Upload.vue"
// import Login from "../views/Login.vue"
// import CardDetails from '../views/CardDetails.vue'
// import AddCard from "../views/AddCard.vue"
// import TextDetails from '../views/TextDetails.vue'
// import AddText from "../views/AddText.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    // component: resolve => require(['../views/Home.vue'], resolve)
  },
  {
    path: '/upload',
    name: 'upload',
    component: Upload,
    // component: resolve => require(['../views/Upload.vue'], resolve)
  },
]

const router = new VueRouter({
  routes
})

export default router
