<template>
  <div class="container">
    <div class="header" v-text="title2"></div>
    <div class="section">
      <div class="btn btnActive" @click="logoutClick">退出登录</div>
      <div class="btn" @click="cancelClick">取消</div>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['reload'],
  data () {
    return {
      logoutMessage: {
        logoutShow: false
      },
      cancelMessage: false,
      title2:""
    }
  },
  methods: {
    logoutClick() {
      this.$emit('logoutChildFn', this.logoutMessage)
      var url = this.$global_msg.logout;
      var user_id = JSON.parse(localStorage.getItem('user')).user.user_id;
      var obj={user_id}
      // console.log(user_id)
      this.axios.post(url,obj)
      .then(res=>{
        // console.log(res)
        // localStorage.removeItem(key)
        // window.localStorage.clear()
        this.$store.commit('_removeStorage','user')
        this.reload()
      })
    },
    cancelClick() {
      this.$emit('cancelChildFn', this.cancelMessage)
    }
  },
  created () {
    var phone=JSON.parse(localStorage.getItem('user')).user.phone;
    this.title2 = phone.replace(/(\d{3})\d{4}(\d{4})/,"$1****$2")
  }
}
</script>

<style scoped>
.container{
  width:350px;
  height:200px;
  background:rgba(255,255,255,1);
  border-radius:6px;
}
.header{
  font-size:18px;
  font-weight:500;
  color:rgba(18,165,137,1);
  margin: 0 auto;
  padding: 30px 0 65px;
}
.section{
  display: flex;
  justify-content: space-around;
}
.btn{
  width:140px;
  height:40px;
  line-height: 40px;
  font-size:14px;
  color:rgba(51,51,51,1);
  background:rgba(216,216,216,1);
}
.btnActive{
  color:rgba(255,255,255,1);
  background:rgba(18,165,137,1);
}
</style>
