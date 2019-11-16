import Vue from 'vue'
import VueRouter from 'vue-router'
import Checkupload from "../views/Checkupload.vue";
import Login from "../views/Login.vue"
import CardDetails from '../views/CardDetails.vue'
import AddCard from "../views/AddCard.vue"
import TextDetails from '../views/TextDetails.vue'
import AddText from "../views/AddText.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'checkupload',
    component: Checkupload,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/carddetails',
    name: 'carddetails',
    component: CardDetails,
  },
  {
    path: '/addcard',
    name: 'addcard',
    component: AddCard,
  },
  {
    path: '/textdetails',
    name: 'textdetails',
    component: TextDetails,
  },
  {
    path: '/addtext',
    name: 'addtext',
    component: AddText,
  }
]

const router = new VueRouter({
  routes
})

export default router
