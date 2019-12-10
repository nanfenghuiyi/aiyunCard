<template>
  <div class="container">
    <div class="newsStyle">
      <div
        class="newsStyle-border"
        :class="{textActive:dataActive==true, flexActive:dataActive==false}"
        @click="allRecords"
      >全部</div>
      <div :class="{textActive:dataActive==false}" @click="dataPopup" v-text="checkDate"></div>
    </div>
    <div>表格信息： {{addListNum}}条</div>
    <div class="imgNews">
      <ul v-infinite-scroll="load" infinite-scroll-disabled="disabled" infinite-scroll-immediate="false" infinite-scroll-delay="10">
        <li v-for="(item,i) in addList" :key="i">
          <div class="new-card">
            <div class="new-time">
              <div></div>
              <span v-text="item.add_time"></span>
            </div>
            <div class="img-card" @click="textImgPopup(item.path,item.start,item.end)">
              <img v-lazy="item.path" alt class="images" />
            </div>
          </div>
        </li>
      </ul>
      <div class="noneNews" v-if="loading">加载中</div>
      <div class="noneNews" v-if="noMore">暂无更多表格资料</div>
    </div>
    <!-- 日期选择 -->
    <div>
      <van-popup round v-model="dataShow">
        <div class="datatime">
          <p v-text="start" @click="checkStart" :class="{ activeDate:checkActive==true}"></p>至
          <p v-text="end" @click="checkEnd" :class="{ activeDate:checkActive==false}">结束日期</p>
        </div>
        <div>
          <!-- 开始时间 -->
          <van-datetime-picker
            v-if="check"
            v-model="currentDate"
            type="date"
            :formatter="formatter"
            :min-date="minDate"
            :max-date="maxDate"
            @confirm="thisData"
            @cancel="endData"
            @change="startChange"
          />
          <!-- 结束时间 -->
          <van-datetime-picker
            v-else
            v-model="currentDate1"
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
    <!-- 信息查看 -->
    <div>
      <van-popup v-model="textImgShow" style="width:80%;heigth:90%">
        <div class="news-form-header">表格信息</div>
        <div class="news-form-img" >
          <img :src="thisPath" alt="" v-viewer @click="imgShow">
        </div>
        <div class="news-form-section">
          <div>信息补充：</div>
          <div class="form-section-first">
            <div v-text="textAddress[addressIndex]"></div>
            <div class="form-section-address" v-text="address"></div>
          </div>
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
      currentDate1: new Date(),
      minDate: new Date(2019, 0, 1), // 最小时间
      maxDate: new Date(new Date().getFullYear(), 12, 30), // 最大时间
      check: true,
      year: "",
      month: "",
      day: "",
      start: "", // 开始时间
      end: "", // 结束时间
      checkActive: true,
      loginShow: true, // 登陆组件显示
      textImgShow: false, // 信息查看
      thisPath: '', // 当前图片URL
      textAddress: ['始发站', '终点站'],
      addressIndex: 0,
      address: '', // 车站
    };
  },
  components: {
    login,
    error,
    logout
  },
  methods: {
    load() {
      this.loading = true;
      if (this.newCheck) {
        this.page++;
        this.records(2);
      } else {
        this.page++;
        this.records(1);
      }
    },
    dataPopup() {
      if (JSON.parse(localStorage.getItem("user")) != null && JSON.parse(localStorage.getItem("user")).user != "") {
        this.dataShow = true;
        // console.log('登录提示===')
      } else {
        // console.log('未登录提示===')
        this.$toast('请登陆');
        this.$emit('cardChildFn', this.loginShow);
      }
    },
    allRecords() {
      this.newCheck = false;
      if (JSON.parse(localStorage.getItem("user")) != null && JSON.parse(localStorage.getItem("user")).user != "") {
        this.dataActive = true;
        this.addList = [];
        this.checkDate = '筛选';
        this.page = 1;
        this.addList = [];
        this.records(1);
      } else {
        this.$toast('请登陆');
        this.$emit('cardChildFn', this.loginShow);
      }
    },
    checkStart() {
      this.check = true;
      this.checkActive = true;
    },
    checkEnd() {
      this.check = false;
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
      this.page = 1;
      this.newCheck = true;
      this.dataActive = false;
      this.addList = [];
      this.newList = [];
      this.records(2);
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
    // 上传记录
    records(index){
      var url = this.$global_msg.lineCardRecords;
      // var user_id = JSON.parse(localStorage.getItem("user")).user.user_id;
      var user_id = this.user_id;
      var page = this.page;
      var page_size = this.page_size;
      var start = this.start;
      var end = this.end;
      var obj1 = { url, user_id, page, page_size };
      var obj2 = { user_id, page, page_size, start, end };
      var obj = '';
      if (index==1) {
        obj = obj1
      }else {
        obj = obj2
      }
      // console.log(obj)
      this.axios.post(url, obj).then(res => {
        var data = res.data;
        console.log(data)
        if (data.data.total == null) {
          this.addListNum = 0;
        } else {
          var list = data.data.records;
          this.listNum = list.length;
          this.count += this.listNum;
          if (index==1) {
            this.addList = this.addList.concat(list);
            // console.log('全部列表===',this.addList)
          }else {
            // console.log(this.newList)
            this.newList = this.newList.concat(list);
            this.addList = this.newList;
            // console.log('时间筛选===',this.addList)
          }
          this.addListNum = data.data.total;
          this.loading = false;
        }
      });
    },
    // 信息查看
    textImgPopup(path, start, end) {
      // console.log(url)
      this.textImgShow = true;
      this.thisPath = path;
      if(start != ''){
        this.address = start;
        this.addressIndex = 0;
      }else if(end != ''){
        this.address = end;
        this.addressIndex = 1;
      }
    },
    imgShow(){
      this.textImgShow = false;
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
  mounted() {
    if (JSON.parse(localStorage.getItem("user")) != null && JSON.parse(localStorage.getItem("user")).user != null && JSON.parse(localStorage.getItem("user")).user.user_id != null) {
      this.user_id = JSON.parse(localStorage.getItem("user")).user.user_id;
      this.records(1);
    }
    this.data();
  }
};
</script>

<style scoped>
/*  */
.newsStyle {
  display: flex;
  align-items: center;
  width: 375px;
  height: 40px;
  background: rgba(255, 255, 255, 1);
  margin: 0 auto;
  margin-bottom: 4px;
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
  margin-top: 4px;
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
/* *** */
/*  */
.new-card {
  /* height: 50px; */
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
/* *** */
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
/*  */
.noneNews {
  text-align: center;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  line-height: 20px;
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
/* *** */
/* 信息查看 */
.news-form-header{
  font-size:16px;
  padding: 14px 0 6px;
}
.news-form-img{
  width: 233px;
  height: 310px;
  margin: 0 auto;
}
.news-form-img img{
  width: 233px;
  height: 310px;
}
.news-form-section{
  font-size: 14px;
  text-align: left;
  margin: 16px 10px 10px;
}
.form-section-first{
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
.form-section-address{
  width: 200px;
  text-align: right;
  /* text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap; */
}
</style>
