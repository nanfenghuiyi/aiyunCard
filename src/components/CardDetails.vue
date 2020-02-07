<template>
  <div class="container">
    <div class="newsStyle">
      <div
        class="newsStyle-border"
        :class="{textActive:dataActive==true, flexActive:dataActive==false}"
        @click="allRecords"
      >全部</div>
      <div class="newsStyle-border" 
        :class="{flexActive:dataActive==false}"
        @click="getStatistic"
      >统计</div>
      <div :class="{textActive:dataActive==false}" @click="dataPopup" v-text="checkDate"></div>
    </div>
    <div>名片信息： {{addListNum}}条</div>
    <div class="imgNews">
      <ul v-infinite-scroll="load" infinite-scroll-disabled="disabled" infinite-scroll-immediate="false" infinite-scroll-delay="10">
        <li v-for="(item,i) in addList" :key="i">
          <div class="new-card">
            <div class="new-time">
              <div></div>
              <span v-text="item.add_time"></span>
            </div>
            <div v-text="item.status_str"></div>
            <div class="img-card">
              <!-- <img v-lazy="item.path[0]" alt class="images" @click="imgShow(item.path)"/> -->
              <div class="demo-image__lazy" @click="imgShow(item.path)">
                <el-image :src="item.path[0]" lazy>
                  <div slot="placeholder" class="image-slot">
                    <i class="el-icon-loading"></i>
                  </div>
                </el-image>
              </div>
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
    <!-- 大图 -->
    <div>
      <van-image-preview
        v-model="bigShow"
        :images="path"
        @change="onChange"
        :show-indicators="true"
      >
      </van-image-preview>
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
      show: false,
      dataShow: false, // 时间选择页面
      dataActive: true, // 选中后的样式
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
      // 大图显示
      bigShow: false,
      path: [],
    };
  },
  components: {
    login,
    error,
    logout
  },
  methods: {
    // 统计跳转
    getStatistic() {
      if (JSON.parse(localStorage.getItem("user")) != null && JSON.parse(localStorage.getItem("user")).user != "") {
        this.$router.push({ path: "/Statistic", query: {id: "1"} });
      } else {
        this.$toast('请登录');
        this.$emit('cardChildFn', this.loginShow);
      }
    },
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
      } else {
        this.$toast('请登陆');
        this.$emit('cardChildFn', this.loginShow);
      }
    },
    allRecords() {
      this.newCheck = false;
      if (JSON.parse(localStorage.getItem("user")) != null && JSON.parse(localStorage.getItem("user")).user != "") {
        this.dataActive = true;
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
    // 获得当前的时间
    data() {
      var nowDate = new Date();
      var start =nowDate.getFullYear() +"-" +(nowDate.getMonth() + 1) +"-" +nowDate.getDate();
      var end =nowDate.getFullYear() +"-" +(nowDate.getMonth() + 1) +"-" +nowDate.getDate();
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
      // this.newCheck = true
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
      var url = this.$global_msg.records;
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
        if (res != null) {
          var data = res.data;
          // console.log(data)
          if (data.data == null || data.data.total == null) {
            this.addListNum = 0;
          } else {
            var list = data.data.records;
            this.listNum = list.length;
            this.count += this.listNum;
            if (index==1) {
              this.addList = this.addList.concat(list);
            }else {
              this.newList = this.newList.concat(list);
              this.addList = this.newList;
            }
            this.addListNum = data.data.total;
            this.loading = false;
          }
        }
      });
    },
    // 图片放大显示
    imgShow(path) {
      console.log(path)
      this.path = path
      // this.lineShow = false;
      this.bigShow = true;
    },
    onChange(index) {
      this.index = index;
    },
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
@import "../styles/details.css";

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
/* 时间选择器 */
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
/* 图片懒加载 */
.el-image {
  height: 100%;
  font-size: 34px;
}
.image-slot {
  margin-top: -10px;
}
..el-image__error{
  font-size: 12px;
}
.demo-image__lazy {
  height: 100%;
}
</style>
