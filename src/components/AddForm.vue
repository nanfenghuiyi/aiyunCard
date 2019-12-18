<template>
  <div class="container" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="importantText">注：表格需清晰可见，不可重复提交，一次一张</div>
    <div class="section">
      <el-upload
        ref="upload"
        action=this.$global_msg.baseUrl
        list-type="picture-card"
        accept="image/*"
        :show-file-list="false"
        :on-change="handleChange"
        :http-request="uploadImg"
        :auto-upload="true"
        :class="{hide:hideUpload}"
      >
        <i class="el-icon-plus">
          <div class="el-icon-plus-size">选择图片</div>
        </i>
      </el-upload>
      <!-- 自定义图片 -->
      <div>
        <van-grid :border="true" :column-num="3" :gutter="1" :square="true">
          <van-grid-item v-for="(item, index) of imgList" :key="index">
            <van-image :src="item.path">
            </van-image>
            <van-icon @click='vanGrid(index)' name="close close-img" />
          </van-grid-item>
        </van-grid>
      </div>
    </div>
    <div class="section-from">
      <div class="section-from-title">表格信息补充 (信息缺少则需补充完整再提交)</div>
      <div>
        <div class="from-address-style" @click="getProvincesPopup">省市
          <div>
            <input type="text" v-model="setAddress" placeholder="选择车站所属省市" disabled>
            <i class="el-icon-arrow-down"></i>
          </div>
        </div>
        <div class="from-address-style">
          <el-dropdown trigger='click' @command="shiftsCommand">
              <span class="el-dropdown-link" v-text="shiftsShow[commandShifts]"></span>
              <i class="el-icon-arrow-down el-icon--right"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="0">始发站</el-dropdown-item>
                <el-dropdown-item command="1">终点站</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          <input v-if="stationShow" type="text" v-model="setStart" placeholder="请输入表格中车辆统一的始发站">
          <input v-else type="text" v-model="setEnd" placeholder="请输入表格中车辆统一的终点站">
        </div>
      </div>
    </div>
    <div class="btn" @click="uplaodClick">提交信息</div>
    <!-- 选择省市 -->
    <div>
      <div>
        <van-popup
          v-model="getProvincesShow"
          position="right"
          :style="{ height: '100%',width: '70%' }"
        >
          <ul v-for="(item, index) of provinceList" :key="index">
            <li data-index="index" @click="getProvinces(item.province,item.province_code)">{{item.province}}</li>
          </ul>
        </van-popup>
        <van-popup
          v-model="getCitiesShow"
          position="right"
          :style="{ height: '100%',width: '40%' }"
        >
          <ul v-for="(item, index) of citieList" :key="index">
            <li data-index="index" @click="getCities(item.city,item.code)">{{item.city}}</li>
          </ul>
        </van-popup>
      </div>
    </div>
  </div>
</template>

<script>
import SparkMD5 from 'spark-md5'

export default {
  inject: ["reload"],
  data() {
    return {
      province: '',
      city: '',
      code: '',
      start: '',	// 起点地址字符串
      end: '', // 起点地址字符串
      type: 10,
      paths: '',
      setAddress: '', // 省市
      setStart: '', // s始发站
      setEnd: '', // s终点站
      imgList: [],
      md5_sign: '',
      uploadPercent: 0,
      fullscreenLoading: false,
      uid: null,    // 图片唯一的标识id
      hideUpload: false, // 到达最大数量隐藏
      provinceList: [], // 省列表
      citieList: [],  // 城市列表
      // 车站类型
      shiftsShow: ['始发站','终点站'],
      commandShifts: 0,
      stationShow: true,
      // 省市弹窗
      getProvincesShow: false,
      getCitiesShow: false,
    };
  },
  methods: {
    shiftsCommand(command) {
      this.setStart = '';
      this.setEnd = '';
      this.commandShifts = command;
      if (this.commandShifts == 0) {
        this.stationShow = true;
      }else {
        this.stationShow = false;
      }
    },
    handleChange(file,fileList) {
      console.log(this.imgList)
      // this.hideUpload = fileList.length >= this.maxlimit;
    },
    // 确认提交
    uplaodClick() {
      if(this.imgList != null && this.imgList.length != 0){
      }else {
        this.$toast('图片不能为空')
        return
      }
      if(this.setAddress == ''){
        this.$toast('省市不能为空')
        return
      }
      if (this.commandShifts == 0) {
        if(this.setStart == ''){
          this.$toast('始发站不能为空')
          return
        }
      }else{
        if(this.setEnd == ''){
          this.$toast('始发站不能为空')
          return
        }
      }
      var user_id = JSON.parse(localStorage.getItem("user")).user.user_id;
      var path = this.imgList[0];
      var url = this.$global_msg.lineCardUpload;
      var obj = {};
      if (this.commandShifts == 0) {
        var start = this.setAddress + '-' + this.setStart;
        obj = { user_id, path, start};
      }else {
        var end = this.setAddress + '-' + this.setEnd;
        obj = { user_id, path, end};
      }
      // console.log(obj)
      if (this.uploadPercent == 100) {
        this.axios.post(url, obj).then(res => {
          // console.log(res);
          var msg = res.data.msg;
          var status = res.data.status;
          // 显示上传按钮
          this.hideUpload = false;
          this.$toast(msg);
          // 完成后清空
          this.$refs.upload.clearFiles();
          this.imgList = [];
          this.start = '';
          this.setAddress = ''; 
          this.setStart = ''; 
          this.setEnd = ''; 
        })
      } else if(this.uploadPercent == 0){
        this.$toast("请选择图片");
      }else{
        this.fullscreenLoading = false;
        this.$toast("图片正在上传，请稍后");
      }
    },
    // 图片移除
    vanGrid(index){
      this.imgList.splice(index,1)
      this.hideUpload = false;
    },
    async uploadImg(options) {
      var that = this;
      that.fullscreenLoading = true;
      // 获取文件对象
      let file = options.file;
      //判断图片类型
      if (
        file.type == "image/jpeg" ||
        file.type == "image/png" ||
        file.type == "image/JPG"
      ) {
        var isJPG = true;
      } else {
        isJPG = false;
      }
      // 判断图片大小
      const isLt2M = file.size / 1024 / 1024 < 1;
      // console.log(file.size / 1024 / 1024);
      if (!isJPG) {
        this.$message.error("上传产品图片只能是 JPG/PNG/JPEG 格式!");
        that.fullscreenLoading = false;
        return
      }
      // 创建一个HTML5的FileReader对象
      var reader = new FileReader();
      //创建一个img对象
      var img = new Image();
      let filename = options.filename;
      if (file) {
        reader.readAsDataURL(file);
      }
      reader.onload = e => {
        let base64Str = reader.result.split(",")[1];
        img.src = e.target.result;
        var spark = new SparkMD5(); //创建md5对象（基于SparkMD5）
        that.md5_sign = spark.appendBinary(img.src).end();
        for (var i = 0; i < that.imgList.length; i++) {
          if (that.imgList[i].md5_sign == that.md5_sign) {
            that.$toast('请勿选择重复图片');
            that.fullscreenLoading = false;
            return
          }
        }
        // base64地址图片加载完毕后执行
        img.onload = function() {
          // 默认按比例压缩
          var w = this.width,
            h = this.height,
            scale = w / h;
          h = w / scale;
          var quality = 0.1; // 默认图片质量为0.7
          //生成canvas
          var canvas = document.createElement("canvas");
          var ctx = canvas.getContext("2d");
          // 创建属性节点
          var anw = document.createAttribute("width");
          anw.nodeValue = w;
          var anh = document.createAttribute("height");
          anh.nodeValue = h;
          canvas.setAttributeNode(anw);
          canvas.setAttributeNode(anh);
          // 清除画布
          ctx.clearRect(0, 0, w, h);
          // 图片压缩
          ctx.drawImage(img, 0, 0, w, h);
          /*第一个参数是创建的img对象；第二三个参数是左上角坐标，后面两个是画布区域宽高*/
          //压缩后的base64文件
          if (isJPG && isLt2M) {
            var base64 = canvas.toDataURL("image/jpeg");
          } else {
            var base64 = canvas.toDataURL("image/jpeg", 0.1);
          }
          // console.log(base64.length / 1024 / 1024);
          // var base64 = canvas.toDataURL("image/jpeg", 0.1);
          var user_id = that.user_id;
          var type = that.type;
          var md5_sign = that.md5_sign
          var obj = { user_id, base64, md5_sign, type };
          // 定义上传进度
          var progress = {
            // "Content-Type": "multipart/from-data",
            onUploadProgress: progressEvent => {
              // console.log(progressEvent)
              // console.log(progressEvent.lengthComputable);
              if (progressEvent.lengthComputable) {
                let val = parseInt(
                  ((progressEvent.loaded / progressEvent.total) * 100).toFixed(0)
                );
                // progressEvent.loaded 上传到服务器多少size
                // progressEvent.total 图片总的大小
                that.uploadPercent = val;
                // options.onProgress(val)
              }
            }
          };
          // console.log(obj)
          that.axios
            .post("/Tool/upload", obj, progress)
            .then(res => {
              // 单张上传
              // that.paths = res.data.data;
              // that.imgList = {path:res.data.data, md5:that.md5_sign};
              var data = res.data;
              // console.log(data)
              if (data.status == 0) {
                this.imgList = [];
                that.fullscreenLoading = false;
                that.$toast(data.msg);
                that.hideUpload = false;
              }else{
                that.fullscreenLoading = false;
                that.imgList.push(data.data);
                that.hideUpload = true;
              }
            })
            .catch(err => {});
        };
      };
    },
    // 获得省
    getProvincesPopup() {
      this.getProvincesShow = true;
      var url = this.$global_msg.getProvinces;
      this.axios.post(url, []).then(res => {
        // console.log(res)
        var data = res.data;
        // console.log(data.data)
        this.provinceList = data.data;
        for (var i in this.provinceList) {
          if (this.provinceList[i]['province'] == '台湾省' || this.provinceList[i]['province'] == '香港特别行政区' || this.provinceList[i]['province'] == '澳门特别行政区') {
            this.provinceList.splice(i, 1);
          }
        }
      })
    },
    // 获取市
    getProvinces(province, pro_code) {
      this.province = province;
      // console.log(this.province)
      this.getCitiesShow = true;
      var url = this.$global_msg.getCities;
      var obj = { pro_code: pro_code };
      this.axios.post(url, obj).then(res => {
        var data = res.data;
        // console.log(data);
        this.citieList = data.data;
      });
    },
    // 选择城市
    getCities(city, code) {
      // console.log(city)
      // console.log(code)
      this.city = city;
      this.code = code;
      this.getProvincesShow = false;
      this.getCitiesShow = false;
      this.setAddress = this.province + '-' + this.city;
    }
  },
  created() {
    if (JSON.parse(localStorage.getItem("user")) != null && JSON.parse(localStorage.getItem("user")).user.user_id != null) {
      this.user_id = JSON.parse(localStorage.getItem("user")).user.user_id;
    }
  },
  mounted() {}
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
input{
  width: 250px;
  text-align: right;
  border: none;
}
.container {
  width: 375px;
  height: 580px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
.section {
  margin-top: 10px;
  height: 150px;
  /* padding-top: 10px; */
}
.importantText {
  padding-top: 10px;
  font-size: 12px;
  color: rgba(153, 153, 153, 1);
}
.upload {
  padding-top: 20px;
  display: flex;
  justify-content: space-around;
}
.section-from{
  margin-top: 60px;
}
.section-from-title{
  font-size: 16px;
  margin-bottom: 11px;
}
.from-address-style{
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #F1F2F3;
  background: #fff;
  padding: 15px 20px;
}
.btn {
  width: 350px;
  height: 50px;
  line-height: 50px;
  font-size: 18px;
  color: rgba(255, 255, 255, 1);
  background: rgba(72,78,97,1);
  margin: 50px auto 0;
}
/* 自定义图片 */
.van-grid-item--square{
  margin: 0 auto;
}
.van-image{
  height: 100%;
}
.van-icon{
  font-size: 18px;
}
.close-img{
  position: absolute;
  top: 0px;
  right: 0px;
}
</style>

<style>
.hide .el-upload--picture-card {
	display: none;
}
</style>