<template>
  <div class="container">
    <div class="header">
      <div>信息上传</div>
    </div>
    <div class="loginImg" @click="isLogin">
      <div class="login-img">
        <img src="../assets/home/user.png" alt />
      </div>
      <div class="login-phone">
        <span v-text="title"></span>
      </div>
    </div>
    <div class="btn" @click="goAddCard">名片上传入口</div>
    <div class="btn" @click="goAddText">路线上传入口</div>
    <!-- 退出登录 -->
    <div>
      <van-popup round v-model="logoutShow">
        <logout @logoutChildFn="logoutParentFn" @cancelChildFn="cancelParentFn"></logout>
      </van-popup>
    </div>
  </div>
</template>

<script>
import logout from "../components/logout"

export default {
  data () {
    return {
      title: '登录账号',
      logoutShow: false,
    }
  },
  components: {logout},
  props: {},
  watch: {},
  computed: {},
  methods: {
    goAddCard() {
      if (JSON.parse(localStorage.getItem("user")) != null) {
        this.$router.push({ path: "/CardDetails" });
      }else {
        this.$router.push({path: '/Login'})
      }
    },
    goAddText() {
      if (JSON.parse(localStorage.getItem("user")) != null) {
        this.$router.push({ path: "/TextDetails" });
      }else {
        this.$router.push({path: '/Login'})
      }
    },
    // 登录状态选择
    isLogin() {
      if (JSON.parse(localStorage.getItem("user")) != null) {
        this.logoutShow = true;
      }else {
        this.$router.push({path: '/Login'})
      }
    },
    // 登出
    logoutParentFn(payload) {
      this.logoutShow = payload.logoutShow;
    },
    cancelParentFn(payload) {
      this.logoutShow = payload;
    },
  },
  created () {},
  mounted () {
    if (JSON.parse(localStorage.getItem("user")) != null) {
      var phone = JSON.parse(localStorage.getItem("user")).user.phone;
      this.title = phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
    }
    if (JSON.parse(localStorage.getItem("user")) != null) {
    }else {
      this.$router.push({path: '/'})
    }
  }
}
</script>

<style scoped>
.header {
  position: relative;
  width: 375px;
  height: 44px;
  line-height: 44px;
  background: rgba(255, 255, 255, 1);
  font-size: 16px;
  color: rgba(51, 51, 51, 1);
  display: flex;
  margin: 0 auto;
}
.header div {
  flex: 1;
  text-align: center;
}
.loginImg {
  text-align: center
}
.login-img {
  width: 50px;
  height: 50px;
  background: rgba(202, 243, 235, 1);
  border-radius: 6px;
  border: 2px solid rgba(2, 131, 106, 1);
  box-sizing: border-box;
  margin: 0 auto;
  margin-top: 130px;
}
.login-phone{
  font-size:18px;
  color: #12A589;
  margin-top: 15px;
}
.btn{
  width: 300px;
  height: 50px;
  line-height: 50px;
  border: 1px solid #12A589;
  box-sizing: border-box;
  font-size:16px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(255,255,255,1);
  background:rgba(18,165,137,1);
  margin: 0 auto;
  margin-top: 40px;
}
</style>
