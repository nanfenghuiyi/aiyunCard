<template>
  <div class="container">
    <div class="container-header">
      <div class="header-user" @click="isLogin">
        <div class="header-login">
        <div class="login-img">
          <img src="../assets/home/user.png" alt />
        </div>
        <div class="login-phone">
          <span v-text="title"></span>
        </div>
      </div>
      <div>
        <div class="uploadCard" @click="getAdd">
          <img src="../assets/home/tianjia.png" alt />
          点击上传线路
        </div>
      </div>
      </div>
      <!-- <div class="user-news">
        <div class="cardAll">名片信息： {{numCard}}条</div>
        <div>线路信息： {{numLine}}条</div>
      </div> -->
    </div>
    <!-- tab标签 -->
    <div>
      <el-tabs v-model="activeName" type="card" :stretch="true" @tab-click="handleClick">
        <el-tab-pane label="名片信息" name="first">
          <carddetails @addListNumChildFn="addListNumParentFn"></carddetails>
        </el-tab-pane>
        <el-tab-pane label="路线信息" name="second">
          <textdetails></textdetails>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 登录窗口 -->
    <div>
      <van-popup round v-model="loginShow">
        <login @errorChildFn="errorParentFn"></login>
      </van-popup>
    </div>
    <!-- 登出窗口 -->
    <div>
      <van-popup round v-model="logoutShow">
        <logout @logoutChildFn="logoutParentFn" @cancelChildFn="cancelParentFn"></logout>
      </van-popup>
    </div>
    <!-- 忘记密码 -->
    <div>
      <van-popup round v-model="errorShow">
        <error></error>
      </van-popup>
    </div>
  </div>
</template>

<script>
import carddetails from "./CardDetails"
import textdetails from "./TextDetails"
import login from "../components/Login"
import logout from "../components/logout"
import error from "../components/error"

export default {
  data () {
    return {
      title: '登录账号',
      activeName: 'first',
      loginShow: false,
      logoutShow: false,
      errorShow: false,
      numCard: 0,
      numLine: 0,
    }
  },
  components: {carddetails,textdetails,login,logout,error},
  props: {},
  watch: {},
  computed: {},
  methods: {
    // tabs
    handleClick(tab, event) {
      if (JSON.parse(localStorage.getItem("user")) == null) {
        this.loginShow = true;
      }
    },
    isLogin() {
      if (JSON.parse(localStorage.getItem("user")) != null) {
        this.logoutShow = true;
        // this.loginShow = true;
      }else {
        this.loginShow = true;
        // this.logoutShow = true;
      }
    },
    // 登出
    logoutParentFn(payload) {
      this.logoutShow = payload.logoutShow;
    },
    cancelParentFn(payload) {
      this.logoutShow = payload;
      // console.log(payload)
    },
    // 忘记密码
    errorParentFn(payload) {
      // console.log(payload)
      this.errorShow = true
    },
    getAdd() {
      if (JSON.parse(localStorage.getItem("user")) != null) {
        this.$router.push({ path: "/Upload" });
      } else {
        this.$toast('请登录')
        this.loginShow = true;
      }
    },
    // 获取名片信息
    addListNumParentFn(payload) {
      console.log(payload)
      console.log('addListNumParentFn====',11111)
    },
  },
  mounted () {
    if (JSON.parse(localStorage.getItem("user")) != null) {
      var phone = JSON.parse(localStorage.getItem("user")).user.phone;
      this.title = phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
    }
  }
}
</script>

<style scoped>
.container{
  /* width: 100%; */
  max-width: 1000px;
}
.container-header{
  width: 100%;
  height: 120px;
  background: rgba(18, 165, 137, 1);
}
.header-user{
  display: flex;
  justify-content: space-between;
}
.header-login{
  display: flex;
  justify-content: left;
  margin-left: 20px;
  margin-top: 30px;
}
.login-img {
  width: 50px;
  height: 50px;
  background: rgba(202, 243, 235, 1);
  border-radius: 6px;
  border: 2px solid rgba(2, 131, 106, 1);
  box-sizing: border-box;
  margin: 0 auto;
}
.login-img>img{
  margin-top: 3px;
}
.login-phone{
  font-size:18px;
  color: #fff;
  margin-top: 15px;
  margin-left: 10px;
}
.uploadCard {
  font-size: 11px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  line-height: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 36px;
  margin-right: 20px;
}
.uploadCard > img {
  width: 30px;
  height: 30px;
}
.user-news{
  display: flex;
  font-size:12px;
  color: #fff;
  margin-top: 10px;
  margin-left: 20px;
}
.cardAll{
  margin-right: 30px;
}
</style>

<style>
/* tab */
.el-tabs__header{
  margin : 0 !important;
}
.el-tabs__item.is-active,.el-tabs__item:hover{
  color: #fff !important;
  background: rgba(18, 165, 137, 1) !important;
}
</style>