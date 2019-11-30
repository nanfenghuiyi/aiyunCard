<template>
  <div class="container" :class="showBanner?'container-active':''">
    <div class="section">
      <div>
        <p class="section-text">车辆信息</p>
        <ul>
          <li class="section-car">
            <div>有无车牌</div>
            <el-dropdown @command="handleCommand" trigger='click'>
              <span class="el-dropdown-link" v-text="carPlateShow[commandCarPlate]"></span>
              <i class="el-icon-arrow-down el-icon--right"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="0">有车牌</el-dropdown-item>
                <el-dropdown-item command="1">无车牌</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <li class="section-car" v-if="commandCarPlate==0">
            <div>车牌号码</div>
            <div>
              <span is-link @click="plateShortPopup" v-text="plateShort"></span>
              <i class="el-icon-arrow-down"></i>
              <span
                class="section-car-center"
                is-link
                @click="plateletterPopup"
                v-text="plateletter"
              >
              </span>
              <i class="el-icon-arrow-down"></i>
            </div>
            <input
              class="section-car-input"
              type="text"
              v-model="plate_no"
              placeholder="输入车牌号码"
              maxlength="6"
            />
          </li>
        </ul>
      </div>
      <div>
        <p class="section-text">班次类型</p>
        <ul>
          <li class="section-car">
            <div>类型</div>
            <el-dropdown trigger='click' @command="shiftsCommand">
              <span class="el-dropdown-link" v-text="shiftsShow[commandShifts]"></span>
              <i class="el-icon-arrow-down el-icon--right"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="0">固定班次</el-dropdown-item>
                <el-dropdown-item command="1">流水班次</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <li class="section-car" @click="checkTime(1)" v-if="commandShifts==0">
            <div>出发时间</div>
            <div>
              <span class="span-style" v-text="goStartTime"></span>
              <i class="el-icon-arrow-down"></i>
            </div>
          </li>
          <li v-else-if="commandShifts==1" style="padding:0">
            <ul>
              <li class="section-car" @click="checkTime(2)">
                <div>开始时间</div>
                <div>
                  <!-- <input type="text" placeholder="选择时间" value="" style="width:80%;border:1px solid"> -->
                  <span class="span-style" v-text="goStartTime"></span>
                  <i class="el-icon-arrow-down"></i>
                </div>
              </li>
              <li class="section-car" @click="checkTime(3)">
                <div>截止时间</div>
                <div >
                  <span class="span-style" v-text="goEndTime"></span>
                  <i class="el-icon-arrow-down"></i>
                </div>
              </li>
              <li class="section-car" @click="checkViaTime()">
                <div>间隔时间</div>
                <div >
                  <span class="span-style" v-text="goViaTime"></span>
                  <i class="el-icon-arrow-down"></i>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div>
        <p class="section-text">起点-终点</p>
        <ul>
          <li class="section-car" @click="setStart">
            <div>起点</div>
            <div class="section-car-style">
              <span class="span-style car-style" v-text="checkStart"></span>
              <i class="el-icon-arrow-down"></i>
            </div>
          </li>
          <li class="section-car" @click="setEnd">
            <div>终点</div>
            <div class="section-car-style">
              <span class="span-style car-style" v-text="checkEnd"></span>
              <i class="el-icon-arrow-down"></i>
            </div>
          </li>
          <li class="section-car" @click="setVia">
            <div>途径点</div>
            <div class="section-car-style">
              <span class="span-style car-style" v-text="checkVia"></span>
              <i class="el-icon-arrow-down"></i>
            </div>
          </li>
        </ul>
      </div>
      <div>
        <p class="section-text">随车电话</p>
        <ul>
          <li class="section-car">
            <div>随车电话</div>
            <input type="text" v-model="phone" maxlength="11" placeholder="输入可联系到的随车号码" />
          </li>
        </ul>
      </div>
    </div>
    <div class="section-btn">
      <div class="btn" v-loading.fullscreen.lock="fullscreenLoading" @click="submitParams">提交信息</div>
    </div>
    <!-- 车牌简称 -->
    <div>
      <van-popup v-model="plateShortShow" position="right" :style="{ height: '100%',width: '40%' }">
        <ul v-for="(item, index) of plateShortList" :key="index">
          <li data-index="index" @click="checkPlateShort(index)">{{item}}</li>
        </ul>
      </van-popup>
    </div>
    <!-- 车牌首字母 -->
    <div>
      <van-popup
        v-model="plateletterShow"
        position="right"
        :style="{ height: '100%',width: '40%' }"
      >
        <ul v-for="(item, index) of plateletterList" :key="index">
          <li data-index="index" @click="checkPlateletter(index)">{{item}}</li>
        </ul>
      </van-popup>
    </div>
    <!-- 时间选择 -->
    <div>
      <van-popup v-model="timeShow" position="bottom" :style="{ height: '50%' }">
        <van-datetime-picker
          v-model="currentTime"
          type="time"
          @confirm="thisData"
          @cancel="endData"
        />
      </van-popup>
    </div>
    <!-- 间隔时间 -->
    <div>
      <van-popup v-model="viaTimeShow" position="bottom" :style="{ height: '50%' }">
        <van-picker
          show-toolbar
          title="间隔时间(分钟)"
          :columns="goViaTimeColumns"
          @cancel="onCancel"
          @confirm="onConfirm"
        />
      </van-popup>
    </div>
    <!-- 选择起点 -->
    <div style="height:100%">
      <van-popup
        v-model="startProvincesShow"
        position="right"
        :style="{ height: '100%',width: '70%' }"
      >
        <ul v-for="(item, index) of getProvinces" :key="index">
          <li data-index="index" @click="startProvinces(item.province,item.province_code)">{{item.province}}</li>
        </ul>
      </van-popup>
      <van-popup v-model="getCitiesShow" position="right" :style="{ height: '100%',width: '40%' }">
        <ul v-for="(item, index) of getCities" :key="index">
          <li data-index="index" @click="startCities(item.city,item.code)">{{item.city}}</li>
        </ul>
      </van-popup>
    </div>
    <!-- 选择终点 -->
    <div style="overflow-y:scroll;padding-bootom:20px">
      <van-popup
        v-model="endProvincesShow"
        position="right"
        :style="{ height: '100%',width: '70%' }"
      >
        <ul v-for="(item, index) of getEndProvinces" :key="index">
          <li data-index="index" @click="endProvinces(item.province,item.province_code)">{{item.province}}</li>
        </ul>
      </van-popup>
      <van-popup
        v-model="getEndCitiesShow"
        position="right"
        :style="{ height: '100%',width: '40%' }"
      >
        <ul v-for="(item, index) of getEndCities" :key="index">
          <li data-index="index" @click="endCities(item.city,item.code)">{{item.city}}</li>
        </ul>
      </van-popup>
    </div>
    <!-- 选择途经点 -->
    <div>
      <div>
        <van-popup
          v-model="viaProvincesShow"
          position="right"
          :style="{ height: '100%',width: '70%' }"
        >
          <ul v-for="(item, index) of getViaProvinces" :key="index">
            <li data-index="index" @click="viaProvinces(item.province,item.province_code)">{{item.province}}</li>
          </ul>
        </van-popup>
        <van-popup
          v-model="getViaCitiesShow"
          position="right"
          :style="{ height: '100%',width: '40%' }"
        >
          <ul v-for="(item, index) of getViaCities" :key="index">
            <li data-index="index" @click="viaCities(item.city,item.code)">{{item.city}}</li>
          </ul>
        </van-popup>
      </div>
    </div>
    <!-- 起点地图选择 -->
    <div>
      <van-popup
          v-model="mapShow"
          position="bottom"
        >
          <div class="test">
            <div class="map-container">{{city}}</div>
            <div class="myPageTop">
              <div>
                请输入详细地址
                <input class="mapInput" v-model="value" @input="changeInput()"/>
              </div>
              <div class="section-list" id="list">
                <ul>
                  <li v-for="(item, index) of tips" :key="index" @click="checkDetails(item)">
                    <div>{{item.name}}</div>
                    <div>{{item.district}}{{item.address == null ? item.address : ""}}</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </van-popup>
    </div>
  </div>
</template>

<script>


export default {
  inject: ["reload"],
  data() {
    return {
      showBanner: true,
      phone: "",
      line_type: 0,
      start_time: "",
      end_time: '',
      period: '',
      plate_for_short: '',
      plate_for_alpha: '',
      plate_no: '',
      province: '',
      pro_code: '',
      city: '',
      city_code: '',
      type: '',
      start: null,
      end: null,
      pass_points: [],
      intervals: [], // 时间间隔数组
      spaces: [], // 距离数数组
      points: [],
      cityStartDetails: "",
      cityEndDetails: "",
      cityViaDetails: "",
      carPlateShow: ["有车牌", "无车牌"],
      shiftsShow: ["固定班次", "流水班次"],
      commandCarPlate: 0,
      commandShifts: 0,
      plateShort: "选择",
      plateShortShow: false,
      plateShortList: ["京","津","沪","渝","黑","吉","辽","甘","陕","贵","云","川","晋","冀","青","鲁","豫","苏","皖","浙","闽","赣","湘","鄂","粤","琼","蒙","新","藏","宁","桂","港","澳"
      ], // 车牌简称
      plateletter: "选择",
      plateletterShow: false,
      plateletterList: ["A","B","C","D","E","F","G","H","J","K","L","M","N","P","Q","R","S","T","U","V","W","X","Y","Z"
      ], // 车牌首字母
      timeShow: false,
      viaTimeShow: false,
      currentTime: "00:00",
      goStartTime: "选择时间", // 出发时间
      goEndTime: "选择时间", // 终点时间
      goViaTime: "选择时间", // 间隔时间
      goViaTimeColumns: [], //间隔时间数组
      timeNum:'',
      // 起点
      startProvincesShow: false,
      getProvinces: [],
      startProvince: "",
      getCitiesShow: false,
      getCities: [],
      startCode: "",
      startCity: "",
      checkStart: "选择起点",
      checkEnd: "选择终点",
      checkVia: "选择途经点",
      // 终点
      endProvincesShow: false,
      getEndProvinces: [],
      endProvince: "",
      getEndCitiesShow: false,
      getEndCities: [],
      endCity: "",
      endCode: "",
      // 途经点
      viaProvincesShow: false,
      getViaProvinces: [],
      viaProvince: "",
      getViaCitiesShow: false,
      getViaCities: [],
      viaCity: "",
      viaCode: "",
      // 地址选择
      startPoint: null,
      endPoint: null,
      valPopint : [],
      pointList : [],
      // 地图
      mapShow: false,
      value: '',
      tips: [],
      query: '',
      data:'',
      fullscreenLoading: false, // 加载中
    };
  },
  methods: {
    handleCommand(command) {
      this.commandCarPlate = command;
      this.plate_for_short = '';
      this.plate_for_alpha = '';
      this.plate_no = '';
      this.plateShort = '选择'
      this.plateletter = '选择'
      // this.line_type = command;
      // console.log(this.line_type)
    },
    shiftsCommand(command) {
      this.commandShifts = command;
      this.start_time = '';
      this.goStartTime = '选择时间';
      this.end_time = '';
      this.goEndTime = '选择时间';
      this.period = '';
      this.goViaTime = '选择时间';
      if (command == 0) {
        this.line_type = 1;
      } else if (command == 1) {
        this.line_type = 2;
      }
      // console.log(this.line_type)
    },
    plateShortPopup() {
      this.plateShortShow = true;
    },
    plateletterPopup() {
      this.plateletterShow = true;
    },
    checkPlateShort(index) {
      this.plateShort = this.plateShortList[index];
      this.plate_for_short = this.plateShort;
      this.plateShortShow = false;
    },
    checkPlateletter(index) {
      this.plateletter = this.plateletterList[index];
      this.plate_for_alpha = this.plateletter;
      this.plateletterShow = false;
    },
    // 时间选择
    checkTime(e) {
      this.timeShow = true;
      this.timeNum = e;
    },
    thisData(value) {
      var nowDate=new Date
      var year=nowDate.getFullYear()
      var month=nowDate.getMonth()
      var day=nowDate.getDay()
      if (this.timeNum==1 || this.timeNum==2) {
        this.start_time = (new Date((year+ '/' + month + '/' + day + ' ' + value + ":00")).getTime())/1000;
        this.goStartTime = value;
      }else if (this.timeNum==3) {
        this.end_time = (new Date((year+ '/' + month + '/' + day + ' ' + value + ":00")).getTime())/1000;
        this.goEndTime = value;
      } 
      this.timeShow = false;
    },
    endData() {
      // console.log('取消按钮')
      this.timeShow = false;
    },
    // 间隔时间确认
    checkViaTime(){
      this.viaTimeShow = true;
    },
    onConfirm(event) {
      this.period = event;
      this.goViaTime = event + '分钟';
      this.viaTimeShow = false
    },

    onCancel() {
      this.viaTimeShow = false
    },
    // 获得省
    getTheProvinces() {
      var url = this.$global_msg.getProvinces;
      this.axios.post(url, []).then(res => {
        var data = res.data;
        // console.log(data)
        this.getProvinces = data.data;
        for (var i in this.getProvinces) {
          if (this.getProvinces[i]['province'] == '台湾省' || this.getProvinces[i]['province'] == '香港特别行政区' || this.getProvinces[i]['province'] == '澳门特别行政区') {
            this.getProvinces.splice(i, 1);
          }
        }
        this.getEndProvinces = data.data;
        this.getViaProvinces = data.data;
      });
    },
    // 获得城市
    // 设置起点
    setStart() {
      this.startProvincesShow = true;
      this.getTheProvinces();
      this.type = 0;
    },
    startProvinces(e,c) {
      this.getCities = [];
      this.getCitiesShow = true;
      this.startProvince =  e;
      this.pro_code = c;
      var url = this.$global_msg.getCities;
      var obj = { pro_code: c };
      this.axios.post(url, obj).then(res => {
        var data = res.data;
        // console.log(data);
        if(data.status==0 && data.data == null) {
          var i = {city:e};
          this.getCities = this.getCities.concat(i);
        }else{
          // this.getCities = data.data;
          // 直辖市限制
          // console.log(data.data[0].code)
          if (data.data.length<3) {
            var i = {city:e ,code:data.data[0].code};
            this.getCities = this.getCities.concat(i);
          }else{
            this.getCities = data.data;
          }
        }
      });
    },
    startCities(e, c) {
      this.showBanner = false;
      this.startCity = e;
      this.startCode = c;
      this.getCitiesShow = false;
      this.startProvincesShow = false;
      this.province =  this.startProvince;
      this.pro_code = this.pro_code;
      this.city = this.startCity;
      this.city_code = this.startCode;
      this.mapShow = true;
    },
    // 设置终点
    setEnd() {
      this.endProvincesShow = true;
      this.getTheProvinces();
      this.type = 1
    },
    endProvinces(e,c) {
      this.getEndCities = []
      this.getEndCitiesShow = true;
      this.endProvince = e;
      this.pro_code = c;
      var url = this.$global_msg.getCities;
      var obj = { pro_code: c };
      this.axios.post(url, obj).then(res => {
        var data = res.data;
        // console.log(data.data)
        if(data.status==0 && data.data == null ) {
          var i = {city:e};
          ;
          this.getEndCities = this.getEndCities.concat(i);
        }else{
          // 直辖市限制
          if (data.data.length<3) {
            var i = {city:e ,code:data.data[0].code};
            this.getEndCities = this.getEndCities.concat(i);
            // console.log(111)
          }else{
            this.getEndCities = data.data;
          }
        }
      });
    },
    endCities(e, c) {
      this.endCity = e;
      this.endCode = c;
      this.getEndCitiesShow = false;
      this.endProvincesShow = false;
      this.mapEndShow = true;
      this.province = this.endProvince,
      this.city = this.endCity,
      this.city_code = this.endCode,
      this.mapShow = true;
    },
    // 设置途经点
    setVia() {
      this.viaProvincesShow = true;
      this.getTheProvinces();
      this.type = 2
    },
    viaProvinces(e,c) {
      this.getViaCities = []
      this.getViaCitiesShow = true;
      this.viaProvincesShow = false;
      this.viaProvince = e;
      this.pro_code = c;
      var url = this.$global_msg.getCities;
      var obj = { pro_code: c };
      this.axios.post(url, obj).then(res => {
        // console.log(res)
        var data = res.data;
        if(data.status==0 && data.data == null) {
          var i = {city:e};
          ;
          this.getViaCities = this.getViaCities.concat(i);
          // console.log('viaProvinces====',this.getViaCities)
        }else{
           // 直辖市限制
          if (data.data.length<3) {
            var i = {city:e ,code:data.data[0].code};
            this.getViaCities = this.getViaCities.concat(i);
            console.log(111)
          }else{
            this.getViaCities = data.data;
          }
        }
      });
    },
    viaCities(e, c) {
      this.viaCity = e;
      this.viaCode = c;
      this.getViaCitiesShow = false;
      this.ViaProvincesShow = false;
      this.mapViaShow = true;
      this.province = this.viaProvince;
      this.city = this.viaCity;
      this.city_code = this.viaCode;
      this.mapShow = true;
    },
    // 地图选择
    changeInput(){
      // console.log(this.value);
      this.getSerachAddress()
    },
    // 地址获取
    getSerachAddress() {
      var that=this
      // 实例化Autocomplete
      console.log(that.city)
      var autoOptions = {
        //city 限定城市，默认全国
        city: that.city,
        output: "list"
      };
      var autoComplete = new AMap.Autocomplete(autoOptions);
      autoComplete.search(that.value, function(status, res) {
        // 搜索成功时，result即是对应的匹配数据
        // console.log("getSerachAddress===", res);
        that.tips = res.tips;
        for (var i in that.tips) {
          // console.log(typeof(that.tips[i]['address']))
          if (that.tips[i]['address'] == null || that.tips[i]['address'].length == 0 || typeof(that.tips[i]['address']) === undefined || that.tips[i]['district'] == '') {
            that.tips.splice(i, 1);
          }
        }
      });
    },
    // 地址选择
    checkDetails(item) {
      this.showBanner = false;
      var data = {};
      data.province = this.province;
      data.pro_code = this.pro_code;
      data.city = this.city;
      data.city_code = this.city_code;
      data.dist = item.district;
      data.ad_code = item.adcode;
      data.name = item.name;
      data.address = item.address.length != 0 ? item.address : item.province;
      data.latitude = item.location.lat;
      data.longitude = item.location.lng;
      // console.log('checkDetails=====',data);
      this.getCitiesShow = false;
      this.startProvincesShow = false;
      this.getendCitiesShow = false;
      this.endProvincesShow = false;
      this.getViaCitiesShow = false;
      this.ViaProvincesShow = false;
      this.mapShow = false;
      this.value = '';
      this.tips = [];
      var str = (data.city == [] ? data.province : data.city)+"-"+data.name;
      // console.log(str)
      if(this.type == 0) {
        this.checkStart = str;
        this.start = data
        // console.log(data);
      }else if (this.type == 1) {
        this.checkEnd = str;
        // console.log('checkEnd====',this.checkEnd)
        this.end = data
      }else if (this.type == 2) {
        this.checkVia = str;
        this.pass_points = [data]
        // console.log('pass_points=====',this.pass_points);
      }
    },

    //点击提交按钮，检测参数完整性
    submitParams() {
      this.points = [];
      this.intervals = [];
      this.spaces = [];
      // 车牌
      if (this.commandCarPlate==0) {
        if (this.plate_for_short == '') {
          this.$toast("车牌简称不能为空");
          return;
        }
        if (this.plate_for_alpha == '') {
          this.$toast("车牌字母不能为空");
          return;
        }
        if (this.plate_no == '') {
          this.$toast("车牌编号不能为空");
          return;
        }
      }
      // 班次
      if(this.line_type!=2){
        if (this.start_time == '') {
          this.$toast("出发时间不能为空");
          return;
        }
      }else if(this.line_type==2){
        if (this.start_time == '') {
          this.$toast("开始时间不能为空");
          return;
        }
        if (this.end_time == '') {
          this.$toast("截止时间不能为空");
          return;
        }
        if (this.period == '') {
          this.$toast("间隔时间不能为空");
          return;
        }
      };
      if (this.start != null) {
        this.points.push(this.start);
      } else {
        //提示
        this.$toast("起点不能为空");
        return;
      }
      //存在途径点的话就加进来计算时间距离
      if (this.pass_points.length) {
        for(var i in this.points){
          this.points.push(this.pass_points[i]);
        }
      }
      if (this.end != null) {
        this.points.push(this.end);
      } else {
        //提示
        this.$toast("终点不能为空");
        return;
      }
      var reg1=/^[1][0-9]{10}$/;
      //验证
      if(this.phone != "" && reg1.test(this.phone)){
        this.getDriving(this.points, 0);
      } else {
        //提示
        this.$toast("手机号码格式错误");
        // console.log(this.points)
        return;
      }
      
    },
    // 提交信息
    uplaodClick() {
      var that = this;
      // var user_id = JSON.parse(localStorage.getItem("user_id"));
      var uplaodObj = {
        user_id: JSON.parse(localStorage.getItem("user")).user.user_id,
        line_type: this.line_type,
        start_time: this.start_time,
        city_code: this.city_code,
        start_time: this.start_time,
        end_time: this.end_time,
        period: this.period,
        plate_for_short: this.plate_for_short,
        plate_for_alpha: this.plate_for_alpha,
        plate_no: this.plate_no,
        start: this.start,
        end: this.end,
        phone: this.phone,
        intervals: this.intervals,
        spaces: this.spaces,
        pass_points: this.pass_points
      };
      // console.log("uplaodObj", uplaodObj);
      var url='Web/ThirdReportBusLine/report';
      this.axios.post(url, uplaodObj)
      .then(res=>{
        // console.log(res);
        var data=res.data;
        if(res.status==200 && data.status==1){
          this.fullscreenLoading = false;
          this.$toast(data.msg)
          this.line_type = 0;
          this.start_time = '';
          this.city_code = '';
          this.start_time = '';
          this.end_time = '';
          this.period = '';
          this.plate_for_short = '';
          this.plate_for_alpha = '';
          this.plate_no = '';
          this.start = null;
          this.end = null;
          this.phone = ''
          this.intervals = [];
          this.spaces = [];
          this.pass_points = [];
          this.plateShort = '选择';
          this.plateletter = '选择';
          this.goStartTime = '选择时间';
          this.goEndTime = '选择时间';
          this.goViaTime = '选择时间';
          this.checkStart = '选择起点';
          this.checkEnd = '选择起点';
          this.checkVia = '选择起点';
          this.phone = '';
          this.commandShifts = 0;
          this.commandCarPlate = 0;
        }else{
          this.fullscreenLoading = false;
          this.$toast(data.msg)
        }
      })
    },
    // 路线规划
    getDriving(points, i) {
      this.fullscreenLoading = true;
      // console.log(points.length);
      var that=this
      if (i != points.length - 1) {
        // console.log("111111", points,points.length);
        var driving = new AMap.Driving({
          // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
          policy: AMap.DrivingPolicy.LEAST_TIME
        });
        var startLngLat = [points[i].longitude, points[i].latitude];
        var endLngLat = [points[i+1].longitude, points[i+1].latitude];
        driving.search(startLngLat, endLngLat, function(status, result) {
          // 未出错时，result即是对应的路线规划方案
          // console.log(result);
            if(result && result.routes && result.routes.length>0){
            that.intervals.push(result.routes[0].distance)
            that.spaces.push(result.routes[0].time)
            that.getDriving(points, i+1);
              // console.log(that.intervals)
                // console.log(that.spaces)
            }else{
              this.$toast('路线规划失败，请稍后再试')
            }
        });
      } else {
        this.uplaodClick();
      }
    },
  },
  created() {
    var point = this.$store.state.point;
    if(point!=null && point.data!=null){
      var str = data.name+"-"+(data.city == [] ? data.province : data.city);
      if(point.type == 0) {
        this.checkStart = str;
        this.startPoint = point.data;
        // console.log("data====", point.data);
      }else if (point.type == 1) {
        this.checkEnd = str;
        this.endPoint = point.data;
      }else if (point.type == 2) {
        this.checkVia = str;
        this.valPopint.push(point.data);
      }
    } 
  },
  mounted() {
    AMap.plugin("AMap.Driving", function() {})
    AMap.plugin("AMap.Autocomplete", function() {})
    for (var i = 0; i <= 300; i++) {
      if(i % 5 ==0){
        this.goViaTimeColumns.push(i);
      }
    }
  }
};
</script>

<style scoped>
ul {
  background: #fff;
}
li {
  padding: 15px 20px;
  font-size: 14px;
  border-bottom: 1px solid #e6e6e6;
}
input {
  border: none;
}
.container {
  width: 100%;
  max-width: 1000px;
  height: 100%;
  position: relative;
  overflow: scroll;
  margin: 0 auto;
}
.section {
  width: 100%;
  text-align: left;
  font-size: 16px;
  overflow: auto;
}
.section-text {
  padding: 10px 20px;
  background:rgba(241,242,243,1);
}
.section-car-center {
  margin-left: 20px;
}
.section-car-input {
  width: 30%;
}
.section-car {
  display: flex;
  justify-content: space-between;
}
.section-btn{
  background:rgba(241,242,243,1);
  padding: 30px 0;
}
.btn {
  width: 340px;
  height: 50px;
  line-height: 50px;
  font-size: 18px;
  color: rgba(255, 255, 255, 1);
  background: rgba(72, 78, 97, 1);
  margin: 0 auto;
}
.span-style {
  margin-right: 5px;
}
.section-car-style{
  display: flex;
}
.car-style{
  display: block;
  text-align: right;
  width: 250px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
/* 地图 */
.map-container{
  font-size: 16px;
  padding-top: 15px;
}
.myPageTop {
  font-size: 16px;
  margin-top: 10px;
}
.section-list{
  width: 100%;
  height: 430px;
  overflow-y: scroll;
  z-index: 999;
  margin-top: 10px;
  border-top: 1px solid #eee;
}
.section-list li{
  padding: 10px ;
  background: #fff;
  border-bottom: 1px solid #eee
}
.mapInput{
  border: 1px solid #000
}
</style>

<style>
html,body {
  /* height: 100%; */
  width: 100%;
}
</style>
