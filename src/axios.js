import Vue from "vue";
import axios from "axios";
import global from "./js/global";


// 发送请求保存session信息
axios.defaults.withCredentials = false
// 设置请求路径
axios.defaults.baseURL = global.baseUrl;
// axios.defaults.baseURL = "http://118.190.203.67:8080"  // 测试
// axios.defaults.baseURL = "https://aybapi.a56999.com"  // 正式
// 设置请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.responseType = 'json'

Vue.prototype.axios = axios