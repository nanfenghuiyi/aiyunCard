<template>
  <div class="container">
    <div class="header">
      <i @click="goBack"></i>
      <div>名片上传</div>
    </div>
    <div class="userNews">
      <div class="userLogin">
        <div class="cardAll">名片信息总数：{{addListNum}} 张</div>
      </div>
      <div class="uploadCard" @click="getAdd">
        <img src="../assets/home/tianjia.png" alt />
        点击上传名片
      </div>
    </div>
    <div class="newsStyle">
      <div
        class="newsStyle-border"
        :class="{textActive:dataActive==true, flexActive:dataActive==false}"
        @click="allRecords"
      >全部</div>
      <!-- <div @click="newRecords">今天</div> -->
      <div :class="{textActive:dataActive==false}" @click="dataPopup" v-text="checkDate"></div>
    </div>
    <div class="imgNews">
      <ul v-infinite-scroll="load" infinite-scroll-disabled="disabled">
        <li v-for="(item,i) in addList" :key="i">
          <div class="new-card">
            <div class="new-time">
              <div></div>
              <span v-text="item.add_time"></span>
            </div>
            <div class="img-card" v-viewer>
              <img v-lazy="item.path" alt class="images" />
            </div>
          </div>
        </li>
      </ul>
      <div class="noneNews" v-if="loading">加载中</div>
      <div class="noneNews" v-if="noMore">暂无更多名片资料</div>
    </div>
    <!-- 日期选择 -->
    <div>
      <van-popup round v-model="dataShow">
        <div class="datatime">
          <p v-text="start" @click="checkStart" :class="{ activeDate:checkActive==true}"></p>至
          <p v-text="end" @click="checkEnd" :class="{ activeDate:checked==true}">结束日期</p>
        </div>
        <div v-if="check">
          <van-datetime-picker
            v-model="currentDate"
            type="date"
            :formatter="formatter"
            :min-date="minDate"
            :max-date="maxDate"
            @confirm="thisData"
            @cancel="endData"
            @change="startChange"
          />
        </div>
        <div v-else>
          <van-datetime-picker
            v-model="currentDate"
            type="date"
            :formatter="formatter"
            :min-date="minDate"
            :max-date="maxDate"
            @confirm="thisData"
            @cancel="endData"
            @change="endChange"
          />
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import login from "../components/Login";
import error from "../components/error";
import logout from "../components/logout";

export default {
  inject: ["reload"],
  data() {
    return {
      title1: "登录账号",
      title2: "",
      loginStatus: true,
      show: false,
      dataShow: false, // 时间选择页面
      dataActive: true,
      message: "",
      page: 1,
      newPage: 1,
      page_size: 10,
      user_id: "",
      addList: [], // 数据列表
      newList: [], // 今日数据
      addListNum: 0, // 总张数
      newCheck: false,
      loading: false,
      listNum: "",
      checkDate: "筛选",
      currentDate: new Date(),
      minDate: new Date(2019, 0, 1), // 最小时间
      maxDate: new Date(new Date().getFullYear(), 12, 30), // 最大时间
      check: true,
      year: "",
      month: "",
      day: "",
      start: "", // 开始时间
      end: "", // 结束时间
      checkActive: true,
      checked: false
    };
  },
  components: {
    login,
    error,
    logout
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    getAdd() {
      if (JSON.parse(localStorage.getItem("user")) != null) {
        this.$router.push({ path: "/AddCard" });
      } else {
        this.$router.push({ path: "/Login" });
      }
    },
    load() {
      this.loading = true;
      setTimeout(() => {
        if (this.newCheck) {
          this.newPage++;
          this.newRecords();
        } else {
          this.page++;
          this.records();
        }
      }, 2000);
    },
    dataPopup() {
      if (JSON.parse(localStorage.getItem("user")) != null) {
        this.dataActive = false;
        this.dataShow = true;
        this.newList = [];
        // console.log(this.addList)
      } else {
        this.$router.push({ path: "/Login" });
      }
    },
    allRecords() {
      if (JSON.parse(localStorage.getItem("user")) != null) {
        this.dataActive = true;
        this.reload();
      } else {
        this.$router.push({ path: "/Login" });
        // this.loginShow = true;
      }
    },
    checkStart() {
      this.check = true;
      this.checked = false;
      this.checkActive = true;
    },
    checkEnd() {
      this.check = false;
      this.checked = true;
      this.checkActive = false;
    },
    data() {
      var nowDate = new Date();
      var start =
        nowDate.getFullYear() +
        "-" +
        (nowDate.getMonth() + 1) +
        "-" +
        nowDate.getDate();
      var end =
        nowDate.getFullYear() +
        "-" +
        (nowDate.getMonth() + 1) +
        "-" +
        nowDate.getDate();
      this.start = start;
      this.end = end;
    },
    formatter(type, value) {
      if (type === "year") {
        this.year = value;
        return value;
      } else if (type === "month") {
        this.month = value;
        return value;
      }
      this.day = value;
      return value;
    },
    // 时间确定
    thisData() {
      // console.log('确认时间')
      this.newRecords();
      this.checkDate = this.start + "至" + this.end;
      this.dataShow = false;
    },
    // 取消时间选择
    endData() {
      this.dataShow = false;
    },
    startChange() {
      this.start = this.year + "-" + this.month + "-" + this.day;
      var abc = new Date((this.end + " 00:00:00").replace(/-/g, "/")).getTime();
      var zxc = new Date(
        (this.start + " 00:00:00").replace(/-/g, "/")
      ).getTime();
      if (zxc > abc) {
        this.end = this.start;
      }
    },
    endChange() {
      this.end = this.year + "-" + this.month + "-" + this.day;
      var abc = new Date(this.end + " 00:00:00").getTime();
      var zxc = new Date(this.start + " 00:00:00").getTime();
      if (zxc > abc) {
        this.start = this.end;
      }
    },
    // 全部上传记录
    records() {
      this.loginStatus = JSON.parse(localStorage.getItem("user")).user.info;
      var phone = JSON.parse(localStorage.getItem("user")).user.phone;
      this.title2 = phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
      var url = this.$global_msg.records;
      var user_id = JSON.parse(localStorage.getItem("user")).user.user_id;
      var page = this.page;
      var page_size = this.page_size;
      var obj = { url, user_id, page, page_size };
      this.axios.post(url, obj).then(res => {
        var data = res.data;
        // console.log(data)
        if (data.data.total == null) {
          this.addListNum = 0;
        } else {
          var list = data.data.records;
          this.listNum = list.length;
          this.count += this.listNum;
          this.addList = this.addList.concat(list);
          this.addListNum = data.data.total;
          this.loading = false;
        }
      });
    },
    // 今天上传记录
    newRecords() {
      this.newCheck = true;
      var url = this.$global_msg.records;
      var user_id = JSON.parse(localStorage.getItem("user")).user.user_id;
      var page = this.newPage;
      var page_size = this.page_size;
      var start = this.start;
      var end = this.end;
      var obj = { user_id, page, page_size, start, end };
      this.axios.post(url, obj).then(res => {
        var data = res.data;
        // console.log(data)
        if (data.data.total == null) {
          this.addListNum = 0;
        } else {
          var list = data.data.records;
          this.listNum = list.length;
          this.count += this.listNum;
          this.newList = this.newList.concat(list);
          this.addList = this.newList;
          this.addListNum = data.data.total;
          this.loading = false;
          // console.log(this.addList)
        }
      });
    }
  },
  computed: {
    noMore() {
      return this.addList.length >= this.addListNum;
    },
    disabled() {
      return this.loading || this.noMore;
    }
  },
  created() {
    // console.log(JSON.parse(localStorage.getItem('user')))
    if (JSON.parse(localStorage.getItem("user")) != null) {
      this.records();
    }
    this.data();
  },
  mounted() {
    if (JSON.parse(localStorage.getItem("user")) != null) {
    }else {
      this.$router.push({path: '/'})
    }
  }
};
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
.header i {
  position: fixed;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  background: url("../assets/add/left.png") center no-repeat;
}
.header div {
  flex: 1;
  text-align: center;
}
.userNews {
  position: relative;
  width: 375px;
  height: 120px;
  background: rgba(18, 165, 137, 1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
}
.userLogin {
  position: absolute;
  left: 20px;
  top: 21px;
  display: flex;
  flex-direction: column;
}
.loginImg {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.login-img {
  width: 50px;
  height: 50px;
  background: rgba(202, 243, 235, 1);
  border-radius: 6px;
  border: 2px solid rgba(2, 131, 106, 1);
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}
.loginImg span {
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  line-height: 20px;
  margin-left: 10px;
}
.cardAll {
  text-align: left;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  line-height: 17px;
  margin-top: 22px;
}
.uploadCard {
  position: absolute;
  right: 20px;
  font-size: 11px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  line-height: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.uploadCard > img {
  width: 30px;
  height: 30px;
}
.newsStyle {
  display: flex;
  align-items: center;
  width: 375px;
  height: 40px;
  background: rgba(255, 255, 255, 1);
  margin: 0 auto;
  margin-bottom: 10px;
}
.newsStyle div {
  flex: 1;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(151, 151, 151, 1);
  line-height: 20px;
}
.flexActive {
  flex: 0.5 !important;
}
.textActive {
  color: rgba(18, 165, 137, 1) !important;
}

.newsStyle-border {
  border-right: 1px solid #979797;
}
.imgNews {
  overflow: auto;
  height: 435px;
  width: 375px;
  margin: 0 auto;
}
.imgNews > ul > li {
  width: 350px;
  height: 70px;
  line-height: 70px;
  margin: 0 auto;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border-bottom: 1px solid #000;
}
.new-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.new-time {
  display: flex;
  align-items: center;
  margin-left: 20px;
}
.new-time div {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(93, 179, 129, 1);
  margin-right: 14px;
}
.new-time span {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
}
.img-card {
  width: 50px;
  height: 50px;
  box-sizing: border-box;
  margin-right: 25px;
}
.img-card img {
  width: 50px;
  height: 50px;
}
.noneNews {
  text-align: center;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  line-height: 20px;
}
.big-imgCard {
  width: 273px;
}
.big-imgCard img {
  width: 100%;
}
.bigImg {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}
.bigImg img {
  width: 100%;
}
.datatime {
  width: 375px;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  padding-top: 30px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}
.datatime p {
  width: 150px;
  border-bottom: 1px solid #888;
}
.activeDate {
  color: #1989fa;
  border-bottom: 1px solid #1989fa !important;
}
</style>

<style>
/**
 *
 *所有组件样式修改
 *
 */
/* 弹出框 */
.van-popup--center.van-popup--round {
  border-radius: 6px !important;
}
.van-picker__cancel,
.van-picker__confirm {
  flex: 1;
  font-size: 0.5rem !important;
}

/* 图片查看器 */
.viewer-toolbar .viewer-one-to-one,
.viewer-prev,
.viewer-next,
.viewer-play,
.viewer-flip-horizontal,
.viewer-flip-vertical {
  display: none !important;
}
</style>
