<template>
  <div class="container">
    <div class="header">登录账号</div>
    <div class="section-style">
      <div class="code">+86</div>
      <input type="number" placeholder="请输出手机号码" v-model="phone">
    </div>
    <div class="section-style">
      <div class="checkText">验证码</div>
      <div class="inputImg">
        <input class="captcha" type="text" placeholder="请输入图形验证码" v-model="captcha">
        <div class="checkImg" @click="changeImgCode">
          <img :src="imgCode" alt="">
        </div>
      </div>
    </div>
    <div class="section-style">
      <div class="code padw">密码</div>
      <div class="inputImg">
        <input :type="check.type" placeholder="请设置密码" v-model="pwd">
        <div class="pwdShow" @click="changeCheck">
          <img :src="check.src" alt="">
        </div>
      </div>
    </div>
    <div class="forgetPwd" @click="errorClick">
      忘记密码？
    </div>
    <div class="btn" @click="login">登陆</div>
  </div>
</template>

<script>
import Vue from "vue"

export default {
  inject: ['reload'],
  data () {
    return {
      phone:'',
      captcha:'',
      pwd:'',
      imgCode: '',//验证码地址
      token:'',//验证码token
      user_id:'',//登录token
      status:'',
      check:{
        type: "password",
        src: require("../assets/login/hide.png")
      },
      message: {title:'', loginStatus:'', loginShow: false},
      errorMessage: {loginShow: false,errorShow: true,}
    }
  },
  methods: {
    login() {
      // this.$emit('loginChildFn', this.message);
      var phone = this.phone;
      var pwd = this.pwd;
      var captcha = this.captcha;
      var token = this.token;
      var reg1=/^[1][0-9]{10}$/;
      //验证
      if(!reg1.test(phone)){
        this.$toast("手机号码格式错误");
        return;
      };
      // 发送请求
      var url=this.$global_msg.login;
      var obj={phone,pwd,captcha,token};
      this.axios.post(url,obj)
      .then(res=>{
        console.log(res)
        var data=res.data;
        this.status=data.status;
        console.log(data)
        var msg=data.msg
        if(data.status===1){
          // commit 方法 提交给 store 数据 将数据提交给缓存进行设置
          this.$store.commit('_setStorage',{user:{user_id:data.data.user_id,info:false,phone:this.phone}})
          this.reload()
        }else{
          this.$toast(msg);
        }
      })
    },
    changeCheck() {
      this.check.type=this.check.type==='password'?'text':'password';
      this.check.src=this.check.src===require("../assets/login/hide.png")?require("../assets/login/show.png"):require("../assets/login/hide.png");
    },
    // 点击图片修改图片src
    changeImgCode() {
      var url=this.$global_msg.captcha;
      this.axios.post(url)
      .then(result=>{
        var data = result.data.data;
        this.imgCode = data.base64;
        this.token = data.token;
      })
    },
    errorClick() {
      this.$emit('errorChildFn', this.errorMessage);
    }
  },
  created () {
    this.changeImgCode()
    // console.log(localStorage.getItem('user'))
  },
}
</script>

<style scoped>
input{
  width: 80%;
  border: none;
  padding-left: 9px;
  font-size:16px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(153,153,153,1);
}
.container{
  width:350px;
  height:406px;
  background:rgba(255,255,255,1);
  border-radius:6px;
  margin: 0 auto;
}
.header{
  padding: 30px 0;
  font-size:18px;
  font-family:PingFangSC-Medium,PingFang SC;
  font-weight:500;
  color:rgba(18,165,137,1);
}
.section-style{
  width: 300px;
  height: 49px;
  border-top: 1px solid #12A589;
  border-bottom: 1px solid #12A589;
  margin: 0 auto;
  display: flex;
  align-items: center;
}
.code{
  width: 46px;
  height: 50px;
  line-height: 50px;
  font-size:16px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(51,51,51,1);
  border-right:1px solid #12A589;
  box-sizing: border-box;
}
.padw{
  border-right: none
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
  margin-top: 30px;
}
.inputImg{
  display: flex;
  flex: 1;
}
.captcha{
  width: 60%;
}
.checkText{
  width: 48px;
  height: 50px;
  line-height: 50px;
}
.checkImg{
  width: 80px;
  height: 40px;
  background:rgba(216,216,216,1);
}
.checkImg img{
  width: 100%;
  height: 100%;
  display: block;
}
.pwdShow{
  margin-right: 10px;
}
.forgetPwd{
  text-align: right;
  margin-top: 14px;
  margin-right: 25px;
  font-size:14px;
  color:rgba(153,153,153,1);
}
</style>
