<template>
  <div class="container" :style="styleObject">
    <div class="busText">
      <i @click="goBack"></i>
      <div>名片上传</div>
    </div>
    <div class="footer">
      <div class="upload">
        <div class="btn btnActive" v-loading.fullscreen.lock="fullscreenLoading" @click="uplaodClick">确定上传</div>
        <div class="btn" @click="clearCheck">重新选择</div>
      </div>
      <div class="importantText">注：照片需清晰可见，不可重复，一次最多可传10张</div>
    </div>
    <div class="section">
      <el-upload
        action=this.$global_msg.baseUrl
        list-type="picture-card"
        multiple
        accept="image/*"
        :on-success="handleSuccess"
        :on-progress='uploaded'
        :limit="10"
        :http-request="uploadImg"
        :auto-upload="true"
      >
        <i class="el-icon-plus">
          <div class="el-icon-plus-size">选择名片</div>
        </i>
      </el-upload>
      <div class="imgList" v-for="(item,index) in urlList" :key="index">
        <div class="box" v-if="item.uid == uid">
          <el-progress type="circle" :percentage="uploadPercent"></el-progress>
        </div>
        <img v-if="item.percentage == 100" :src="item.url" alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  inject: ["reload"],
  data() {
    return {
      styleObject: {
        height: '667px'
      },
      user_id: "",
      type: 10,
      city_code: "028",
      paths: "",
      uploadPercent: 0,
      fullscreenLoading: false,
      urlList:'',  //图片List
      uid:null,    //图片唯一的标识id
    };
  },
  methods: {
    handleSuccess(response, file, fileList){
      // this.uploadPercent=100/
      // this.uid = 1 //随便一个值,上传成功时,进度条消失
      // console.log("图片上传成功")
      // console.log(response)
      // console.log(file)
    },
    uploaded(event, file, fileList){
      this.urlList = fileList
      this.uid = file.uid
    },
    goBack() {
      this.$router.go(-1);
    },
    // 确认提交
    uplaodClick() {
      var user_id = this.user_id;
      var paths = this.paths;
      var city_code = this.city_code;
      var url = this.$global_msg.upload;
      var obj = { user_id, paths, city_code };
      // console.log(this.uploadPercent)
      if (this.uploadPercent == 100) {
        this.axios.post(url, obj).then(res => {
          // console.log(res);
          var msg = res.data.msg;
          var status = res.data.status;
          this.fullscreenLoading = true;
          setTimeout(() => {
            this.fullscreenLoading = false;
            this.$toast(msg);
            this.reload();
          }, 2000);
        })
      } else if(this.uploadPercent == 0){
        this.$toast("请选择图片");
      }else{
        this.$toast("图片正在上传，请稍后");
      }
    },
    // 重新选择
    clearCheck() {
      this.reload();
    },
    async uploadImg(options) {
      var that = this;
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
          var obj = { user_id, base64, type };
          // 定义上传进度
          var progress = {
            // "Content-Type": "multipart/from-data",
            onUploadProgress: progressEvent => {
              // console.log(progressEvent)
              // console.log(progressEvent.lengthComputable);
              if (progressEvent.lengthComputable) {
                let val = parseInt(
                  ((progressEvent.loaded / progressEvent.total) * 100).toFixed(
                    0
                  )
                );
                // progressEvent.loaded 上传到服务器多少size
                // progressEvent.total 图片总的大小
                that.uploadPercent = val;
                // options.onProgress(val)
              }
            }
          };
          that.axios
            .post("/Tool/upload", obj, progress)
            .then(res => {
              // console.log(res.data);
              if (that.paths == null || that.paths == "") {
                that.paths = res.data.data;
              } else {
                that.paths = that.paths + "," + res.data.data;
              }
            })
            .catch(err => {});
        };
      };
    }
  },
  created() {
    this.user_id = JSON.parse(localStorage.getItem("user")).user.user_id;
  },
  mounted() {
    // 动态设置背景图的高度为浏览器可视区域高度
    // 首先在Virtual DOM渲染数据时，设置下demo的高度．
    this.styleObject.height = `${document.documentElement.clientWidth*0.3}px`; // 具体计算看需要
    // console.log(this.styleObject.height)
    // 然后监听window的resize事件．在浏览器窗口变化时再设置下背景图高度．
    const that = this;
    window.onresize = function temp() {
      that.styleObject.height = `${document.documentElement.clientWidth*0.4}px`;
    };
  }
};
</script>

<style scoped>
.container {
  width: 375px;
  height: 667px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
.busText {
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
.busText i {
  position: fixed;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  background: url("../assets/add/left.png") center no-repeat;
}
.busText div {
  flex: 1;
  text-align: center;
}
.section {
  height: 500px;
  overflow: auto;
  /* padding-top: 10px; */
}
.footer {
  width: 375px;
  height: 97px;
  /* position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%); */
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
.btn {
  width: 140px;
  height: 40px;
  line-height: 40px;
  color: rgba(51, 51, 51, 1);
  background: rgba(216, 216, 216, 1);
}
.btnActive {
  color: rgba(255, 255, 255, 1);
  background: rgba(18, 165, 137, 1);
}
</style>
<style>
.el-upload--picture-card {
  height: 100px !important;
  width: 100px !important;
  /* line-height: 110px !important; */
  margin: 9px !important;
}
.el-upload-list--picture-card .el-upload-list__item {
  height: 100px !important;
  width: 100px !important;
  margin: 9px !important;
}
.el-icon-plus .el-icon-plus-size{
  font-size: 14px;
  display: block;
}
</style>
