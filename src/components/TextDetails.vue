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
    <div>线路信息： {{addListNum}}条</div>
    <div class="imgNews">
      <ul v-infinite-scroll="onload" infinite-scroll-disabled="disabled" infinite-scroll-immediate="false" infinite-scroll-delay="10">
        <li v-for="(item,i) in addList" :key="i">
          <div class="new-card">
            <div class="new-time">
              <div></div>
              <span v-text="item.add_time"></span>
            </div>
            <div @click="lineDetail(item.id)">
              <ul class="bus-line-ul">
                <li v-text="item.full_plate"></li>
                <li class="bus-line">
                  <div class="text-details-span" v-text="item.start_name"></div>
                  <div>—</div>
                  <div class="text-details-span" v-text="item.dest_name"></div>
                </li>
                <li v-text="item.phone"></li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
      <div class="noneNews" v-if="loading">加载中</div>
      <div class="noneNews" v-if="noMore">暂无更多路线资料</div>
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
    <!-- 路线详情 -->
    <div>
      <van-popup v-model="lineShow" style="width:80%">
        <div class="bus-section">
          <div class="bus-details">车辆信息</div>
          <div>
            <ul>
              <li class="bus-details-style">
                <div>车牌</div>
                <div v-text="full_plate"></div>
              </li>
              <li class="bus-details-style">
                <div>类型</div>
                <div v-text="is_flow"></div>
              </li>
              <li class="bus-details-style">
                <div>开始时间</div>
                <div v-text="start_time"></div>
              </li>
              <li>
                <ul v-if="is_time">
                  <li class="bus-details-style">
                    <div>截止时间</div>
                    <div v-text="end_time"></div>
                  </li>
                  <li class="bus-details-style">
                    <div>间隔时间</div>
                    <div v-text="period"></div>
                  </li>
                </ul>
              </li>
              <li class="bus-details-style">
                <div>起点</div>
                <div v-text="start_name"></div>
              </li>
              <li class="bus-details-style">
                <div>终点</div>
                <div v-text="dest_name"></div>
              </li>
              <li class="bus-details-style">
                <div>途径点</div>
                <div v-text="pass_points_name"></div>
              </li>
              <li class="bus-details-style">
                <div>随车电话</div>
                <div v-text="phone"></div>
              </li>
            </ul>
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
      full_plate: '',
      is_flow: '',
      start_time: '',
      end_time: '',
      period: '',
      start_name: '',
      pass_points_name: '',
      dest_name: '',
      phone: '',
      busPlate: '',
      busStartLine: '',
      busEndLine: '',
      busPhone: '',
      loginStatus: true,
      show: false,
      dataShow: false, // 时间选择页面
      dataActive: true,
      lineShow: false, // 路线详情
      is_time: true, // 是否显示截止时间
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
        this.$router.push({ path: "/Statistic", query: {id: "3"} });
      } else {
        this.$toast('请登录');
        this.$emit('cardChildFn', this.loginShow);
      }
    },
    onload() {
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
        this.$emit('cardChildFn', this.loginShow);
        this.$toast('请登陆')
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
      var url = this.$global_msg.lineRecords;
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
        // console.log(data)
        if (data.data.total == null) {
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
      });
    },
    // 详情记录
    lineDetail(e) {
      // console.log(e)
      this.full_plate = '';
      this.is_flow = '';
      this.start_time = '';
      this.end_time = '';
      this.period = '';
      this.start_name = '';
      this.pass_points_name = '';
      this.dest_name = '';
      this.phone = '';
      this.lineShow = true;
      var url = this.$global_msg.detail;
      var user_id = JSON.parse(localStorage.getItem("user")).user.user_id;
      var obj = {user_id:user_id, id:e}
      this.axios.post(url,obj)
      .then(res=>{
        // console.log(res)
        var data = res.data.data;
        // console.log(data);
        this.full_plate = data.full_plate!=''?data.full_plate:'无';
        this.is_time = data.is_flow==2 ? true : false;
        this.is_flow = data.is_flow==2 ? '流水班次' : '固定班次';
        this.start_time = data.start_time;
        this.end_time = data.end_time;
        this.period = data.period+'分钟';
        this.start_name = data.start_name;
        if(data.pass_points.length ==1 ){
          this.pass_points_name = data.pass_points[0].pass_name
        }else if(data.pass_points.length > 1){
          for (var name of data.pass_points) {
            this.pass_points_name=this.pass_points_name+'-'+name.pass_name
          };
        }else {
          this.pass_points_name = '无';
        }
        this.dest_name = data.dest_name != null ? data.dest_name : '无';
        this.phone = data.phone != null ? data.phone : '无';
      })
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
