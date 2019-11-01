<template>
  <div class="container">
    <div class="header">大巴车名片上传</div>
    <div class="userNews">
      <div class="userLogin">
        <div class="loginImg" v-if="loginStatus" @click="loginPopup">
          <div class="login-img">
            <img src="../assets/home/user.png" alt="">
          </div>
          <div>
            <span  v-text="title1"></span>
          </div>
        </div>
        <div class="loginImg" v-else @click="logoutPopup">
          <div class="login-img">
            <img src="../assets/home/user.png" alt="">
          </div>
          <div>
            <span v-text="title2"></span>
          </div>
        </div>
        <div class="cardAll">
          名片总数：{{addListNum}} 张
        </div>
      </div>
      <router-link to="/Add" class="uploadCard">
        <img src="../assets/home/tianjia.png" alt="">
        上传名片
      </router-link>
    </div>
    <div class="newsStyle">
      <div class="newsStyle-border textActive" @click="allRecords">全部</div>
      <div @click="newRecords">今天</div>
    </div>
    <div class="imgNews">
      <ul v-infinite-scroll="load"
      infinite-scroll-disabled="disabled">
        <li v-for="(item,i) in addList" :key="i">
          <div class="new-card">
            <div class="new-time">
              <div></div>
              <span v-text="item.add_time"></span>
            </div>
            <div class="img-card" @click="showPopup(item)">
              <img :src="item.path" alt="">
            </div>
          </div>
        </li>
      </ul>
      <div class="noneNews" v-if="loading">加载中</div>
      <div class="noneNews" v-if="noMore">暂无更多名片资料</div>
    </div>
    <!-- 图片查看 -->
    <div class="checkBig" v-show="bigShow" @click="bigHide">
      <div class="bigImg">
        <img :src="img" alt="">
      </div>
    </div>
    <!-- 登陆界面 -->
    <div>
      <van-popup round v-model="loginShow" >
        <login @errorChildFn="errorParentFn" @loginChildFn="loginParentFn"></login>
      </van-popup>
    </div>
    <!-- 找回密码 -->
    <div>
      <van-popup round v-model="errorShow" >
        <error></error>
      </van-popup>
    </div>
    <!-- 退出登录 -->
    <div>
      <van-popup round v-model="logoutShow" >
        <logout @logoutChildFn="logoutParentFn" @cancelChildFn="cancelParentFn"></logout>
      </van-popup>
    </div>
  </div>
</template>

<script>
import login from "../components/Login";
import error from "../components/error";
import logout from "../components/logout";

export default {
  inject: ['reload'],
  data () {
    return {
      title1:'登录账号',
      title2:'',
      loginStatus: true,
      show: false,
      loginShow: false, // 登录页面
      errorShow: false, // 忘记密码页面
      logoutShow: false, // 登出页面
      bigShow: false,
      message: "",
      page: 1,
      newPage: 1,
      page_size: 10,
      user_id:'',
      addList: [], // 数据列表
      newList: [], // 今日数据
      addListNum: 0, //总张数
      img:'', // 图片查看地址
      newCheck: false,
      loading: false,
      listNum: ''
    }
  },
  components: {
    login,
    error,
    logout
  },
  computed: {
    noMore () {
      return this.addList.length >= this.addListNum
    },
    disabled () {
      return this.loading || this.noMore
    }
  },
  methods: {
    bigHide(){
      this.bigShow = false
    },
    load () {
      this.loading = true
      setTimeout(() => {
        if(this.newCheck){
          this.newPage++
          this.newRecords()
        }else{
          this.page++
          this.records()
        }
      }, 2000)
    },
    showPopup(e) {
      // console.log(e)
      this.img=e.path
      this.show = true;
      this.bigShow = true
    },
    loginPopup() {
      this.loginShow = true;
    },
    errorPopup() {
      this.errorShow = true;
    },
    logoutPopup() {
      this.logoutShow = true;
    },
    loginParentFn(payload) {
      this.loginShow = payload.loginShow;
      this.title2 = payload.title;
      this.loginStatus = payload.loginStatus;
    },
    errorParentFn(payload) {
      this.loginShow = payload.loginShow;
      this.errorShow = payload.errorShow;
    },
    logoutParentFn(payload) {
      this.logoutShow = payload.logoutShow;
    },
    cancelParentFn(payload) {
      this.logoutShow = payload;
    },
    allRecords() {
      this.reload()
    },
    // 全部上传记录
    records(){
      this.loginStatus = JSON.parse(localStorage.getItem('user')).user.info;
      var phone=JSON.parse(localStorage.getItem('user')).user.phone;
      this.title2 = phone.replace(/(\d{3})\d{4}(\d{4})/,"$1****$2")
      var url=this.$global_msg.records;
      var user_id=JSON.parse(localStorage.getItem('user')).user.user_id
      var page = this.page;
      var page_size = this.page_size;
      var obj={url,user_id,page,page_size};
      this.axios.post(url,obj)
      .then(res=>{
        var data=res.data
        // console.log(data)
        if(data.data.total==null){
          this.addListNum = 0
        }else{
          var list=data.data.records
          this.listNum= list.length
          this.count += this.listNum
          this.addList=this.addList.concat(list)
          this.addListNum = data.data.total
          this.loading = false
        }
      })
    },
    // 今天上传记录
    newRecords() {
      this.newCheck = true
      var url = this.$global_msg.records;
      var user_id = JSON.parse(localStorage.getItem('user')).user.user_id;
      var page = this.newPage;
      var page_size = this.page_size;
      var nowDate = new Date();
      var start = nowDate.getFullYear()+'-'+(nowDate.getMonth() + 1)+'-'+nowDate.getDate()
      var end = nowDate.getFullYear()+'-'+(nowDate.getMonth() + 1)+'-'+(nowDate.getDate()+1)
      var obj={user_id, page, page_size, start, end};
      this.axios.post(url, obj)
      .then(res=>{
        var data=res.data
        // console.log(data)
        if(data.data.total==null){
          this.addListNum = 0
        }else{
          var list=data.data.records
          this.listNum= list.length
          this.count += this.listNum
          this.newList=this.newList.concat(list)
          this.addList=this.newList
          this.addListNum = data.data.total
          this.loading = false
        }
      })
    }
  },
  created () {
    // console.log(JSON.parse(localStorage.getItem('user')))
    if (JSON.parse(localStorage.getItem('user'))!=null) {
      this.records()
    };
  },
}
</script>

<style scoped>
.header{
  font-size: 16px;
  width: 375px;
  height: 44px;
  line-height: 44px;
  background: rgba(255,255,255,1);
  margin: 0 auto;
}
.userNews{
  position: relative;
  width: 375px;
  height: 120px;
  background: rgba(18,165,137,1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
}
.userLogin{
  position: absolute;
  left: 20px;
  top: 21px;
  display: flex;
  flex-direction:column
}
.loginImg{
  display: flex;
  flex-direction: row;
  align-items: center;
}
.login-img{
  width:50px;
  height:50px;
  background:rgba(202,243,235,1);
  border-radius:6px;
  border:2px solid rgba(2,131,106,1);
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}
.loginImg span{
  font-size:14px;
  font-family:PingFangSC-Medium,PingFang SC;
  font-weight:500;
  color:rgba(255,255,255,1);
  line-height:20px;
  margin-left: 10px;
}
.cardAll{
  text-align: left;
  font-size:12px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(255,255,255,1);
  line-height:17px;
  margin-top: 22px;
}
.uploadCard{
  position: absolute;
  right: 20px;
  font-size:11px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(255,255,255,1);
  line-height:16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.uploadCard>img{
  width: 30px;
  height: 30px;
}
.newsStyle{
  display: flex;
  align-items: center;
  width:375px;
  height:40px;
  background:rgba(255,255,255,1);
  margin: 0 auto;
  margin-bottom: 10px;
}
.newsStyle div{
  flex: 1;
  font-size:14px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(151,151,151,1);
  line-height:20px;
}
.textActive{
  color:rgba(51,51,51,1);
}
.newsStyle-border{
  border-right: 1px solid #979797
}
.imgNews{
  overflow: auto;
  height: 435px;
}
.imgNews>ul>li{
  width:350px;
  height:70px;
  line-height: 70px;
  margin: 0 auto;
  margin-bottom: 10px;
  background:rgba(255,255,255,1);
  border-radius:4px;
}
.new-card{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.new-time{
  display: flex;
  align-items: center;
  margin-left: 20px;
}
.new-time div{
  width:7px;
  height:7px;
  border-radius: 50%;
  background:rgba(93,179,129,1);
  margin-right: 14px;
}
.new-time span{
  font-size:14px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(51,51,51,1);
}
.img-card{
  width:50px;
  height:50px;
  box-sizing: border-box;
  margin-right: 25px;
}
.img-card img{
  width:50px;
  height:50px;
}
.noneNews{
  text-align: center;
  font-size:14px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(153,153,153,1);
  line-height:20px;
}
.big-imgCard{
  width:273px;
}
.big-imgCard img{
  width:100%;
}
.checkBig{
  width: 375px;
  height: 667px;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background:rgba(51,51,51,0.8);
}
.bigImg{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center
}
.bigImg img{
  width: 100%;
}
</style>

<style>
.van-popup--center.van-popup--round {
  border-radius: 6px !important;
}
</style>
