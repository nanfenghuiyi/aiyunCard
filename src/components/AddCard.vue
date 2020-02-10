<template>
  <div class="container">
    <div class="footer">
      <div class="upload">
        <div class="btn btnActive" v-loading.fullscreen.lock="fullscreenLoading" @click="uplaodClick">确定上传</div>
        <div class="btn" @click="clearCheck">重新选择</div>
      </div>
      <div class="importantText">注：照片需清晰可见，不可重复，一张名片的正反面对应上传</div>
    </div>
    <!-- 正面照 -->
    <div class="section">
      <el-upload
        ref="upload"
        action=this.$global_msg.baseUrl
        list-type="picture-card"
        accept="image/*"
        :show-file-list="false"
        :on-change="handleChange"
        :http-request="positiveUpload"
        :auto-upload="true"
        :class="{hide:hideUpload}"
      >
        <i class="el-icon-plus">
          <div class="el-icon-plus-size">选择名片正面</div>
        </i>
      </el-upload>
      <!-- 自定义图片 -->
      <div class="custom-img" v-if="imgListShow">
        <!-- <van-grid :border="true" :column-num="2" :gutter="0" :square="true">
          <van-grid-item v-for="(item, index) of imgList" :key="index">
          <van-grid-item v-if="imgListShow">
            <van-image :src="imgList.path">
            </van-image>
            <van-icon @click='vanGrid(1)' name="close close-img" />
          </van-grid-item>
        </van-grid> -->
        <van-image :src="imgList.path">
        </van-image>
        <van-icon @click='vanGrid(1)' name="close close-img" />
      </div>
    </div>
    <!-- 反面照 -->
    <div class="section">
      <el-upload
        ref="upload"
        action=this.$global_msg.baseUrl
        list-type="picture-card"
        accept="image/*"
        :show-file-list="false"
        :on-change="handleChange"
        :http-request="isPositiveUpload"
        :auto-upload="true"
        :class="{hide:isHideUpload}"
      >
        <i class="el-icon-plus">
          <div class="el-icon-plus-size">选择名片反面或车牌号码</div>
        </i>
      </el-upload>
      <!-- 自定义图片 -->
      <div class="custom-img custom-img-top" v-if="isImgListShow">
        <!-- <van-grid :border="true" :column-num="2" :gutter="0" :square="true">
          <van-grid-item v-for="(item, index) of isImgList" :key="index">
          <van-grid-item v-if="isImgListShow">
            <van-image :src="isImgList.path">
            </van-image>
            <van-icon @click='vanGrid(2)' name="close close-img" />
          </van-grid-item>
        </van-grid> -->
        <van-image :src="isImgList.path">
        </van-image>
        <van-icon @click='vanGrid(2)' name="close close-img" />
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
      imgList: [],
      isImgList: [],
      imgListShow: false,
      isImgListShow: false,
      user_id: '',
      md5_sign: '',
      type: 10,
      base64: '',
      city_code: "028",
      fullscreenLoading: false,
      base: '',
      uid:null,    //图片唯一的标识id
      hideUpload: false, // 到达最大数量隐藏
      isHideUpload: false, // 到达最大数量隐藏
      uploadPercent: 0, // 上传成功的张数
      tempFileNum: 0, // 上传的张数
    };
  },
  methods: {
    handleChange(file,fileList) {
      // 选择的图片达到指定数量，阻止添加图片
      // this.hideUpload = this.imgList.length >= this.maxlimit;
    },
    // 确认提交
    uplaodClick() {
      console.log('uplaodClick===确认提交')
      this.fullscreenLoading = true;
      var user_id = this.user_id;
      var paths = [].concat(this.imgList);
        paths = paths.concat(this.isImgList);
        console.log(paths)
      if (paths != null && paths.length ==2) {
        var paths = [].concat(this.imgList);
        paths = paths.concat(this.isImgList);
        var city_code = this.city_code;
        var url = this.$global_msg.upload;
        var obj = { user_id, paths, city_code };
        console.log('uplaodClick===',obj)
        console.log(this.uploadPercent,'====',this.imgList.length)
        if (this.uploadPercent == 2) {
          this.axios.post(url, obj).then(res => {
            // console.log(res);
            var msg = res.data.msg;
            var status = res.data.status;
            // if (status==1) {
            // 显示上传按钮
            this.hideUpload = false;
            this.isHideUpload = false;
            this.$toast(msg);
            // 列表清空
            this.clearCheck();
            this.fullscreenLoading = false;
          })
        } else if(this.uploadPercent == 0){
          this.fullscreenLoading = false;
          this.$toast("请选择图片");
        }else{
          this.clearCheck();
          this.fullscreenLoading = false;
          this.$toast("名片上传异常，请重试");
        }
      }else {
        this.fullscreenLoading = false;
        this.$toast("请选择名片正面和反面");
      }
    },
    // 图片移除
    vanGrid(index){
      // this.imgList.splice(index,1)
      this.uploadPercent--;
      this.tempFileNum--;
      if (index == 1) {
        this.imgList = [];
        this.hideUpload = false;
        this.imgListShow = false;
      }else if (index == 2) {
        this.isImgList = [];
        this.isHideUpload = false;
        this.isImgListShow = false;
      }
      // this.isHideUpload = false;
    },
    // 重新选择
    clearCheck() {
      this.uploadPercent = 0;
      this.tempFileNum = 0;
      this.imgList = []; // 清除列表中的地址
      this.isImgList = [];
      this.hideUpload = false;
      this.isHideUpload = false;
      this.imgListShow = false;
      this.isImgListShow = false;
      this.$refs.upload.clearFiles();
    },
    // 正面图片
    async positiveUpload(options) {
      this.uploadImg(options, 1);
    },
    // 反面图片
    async isPositiveUpload(options) {
      this.uploadImg(options, 2);
    },
    /**
     * 图片压缩打包
     */
    uploadImg(options, index) {
      var that = this;
      that.fullscreenLoading = true;
      // 获取文件对象
      let file = options.file;
      //判断图片类型
      if (file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/JPG") {
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
      if (options.file) {
        reader.readAsDataURL(options.file);
      }
      reader.onload = e => {
        // console.log('转换后===',that.md5_sign)
        let base64Str = reader.result.split(",")[1];
        img.src = e.target.result;
        var spark = new SparkMD5(); //创建md5对象（基于SparkMD5）
        that.md5_sign = spark.appendBinary(img.src).end();
        console.log(that.md5_sign)
        if (that.imgList.md5_sign == that.md5_sign) {
          that.$toast('请勿选择重复图片');
          that.fullscreenLoading = false;
          return
        }
        // base64地址图片加载完毕后执行
        img.onload = function() {
          var _this = this;
          // 图片压缩
          that.picCompress(_this, that, img, isJPG, isLt2M);
          var user_id = that.user_id;
          var type = that.type;
          var md5_sign = that.md5_sign;
          var base64 = that.base64;
          var obj = { user_id, base64, md5_sign, type };
          // console.log(obj)
          that.tempFileNum++;
          // 定义上传进度
          var progress = {
            onUploadProgress: progressEvent => {
              if (progressEvent.lengthComputable) {
                let val = parseInt(
                  ((progressEvent.loaded / progressEvent.total) * 100).toFixed(0)
                );
                if(val==100) {// 上传进度
                  that.uploadPercent++;
                }else {
                  console.log("上传进度未完成");
                }
                /* if (that.uploadPercent == that.tempFileNum) {
                  that.$toast('图片加载完成')
                } */
              }
            }
          };
          // 上传本地
          that.localUpload(that, obj, progress, index)
        };
      };
    },
    /**
     * 图片压缩
     */
    picCompress(_this, that, img, isJPG, isLt2M) {
      // 默认按比例压缩
          var w = _this.width,
            h = _this.height,
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
          // 在canvas绘制前填充白色背景
          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          // 图片压缩
          ctx.drawImage(img, 0, 0, w, h);
          /*第一个参数是创建的img对象；第二三个参数是左上角坐标，后面两个是画布区域宽高*/
          //压缩后的base64文件
          if (isJPG && isLt2M) {
            that.base64 = canvas.toDataURL("image/jpeg");
          } else {
            that.base64 = canvas.toDataURL("image/jpeg", quality);
          }
    },
    /**
     * 上传本地
     */
    localUpload(that, obj, progress, index) {
      that.axios.post("/Tool/upload", obj, progress)
        .then(res => {
          console.log('/Tool/upload===',res.data);
          that.$toast('图片加载完成')
          var data = res.data;
          if (data.status == 0) {
            that.uploadPercent--;
            that.tempFileNum--;
            that.fullscreenLoading = false;
            that.$toast(data.msg)
          }else{
            if (index==1) {
              that.imgList = data.data;
              that.hideUpload = true;
              that.imgListShow = true;
            }else {
              that.isImgList = data.data;
              that.isHideUpload = true;
              that.isImgListShow = true;
            }
          }
          console.log("323=== ",  that.uploadPercent);
          that.fullscreenLoading = false;
        })
        .catch(err => {
          that.fullscreenLoading = false;
          console.log(err)
        });
    }
  },
  created() {
    if (JSON.parse(localStorage.getItem("user")) != null && JSON.parse(localStorage.getItem("user")).user.user_id != null) {
      this.user_id = JSON.parse(localStorage.getItem("user")).user.user_id;
    }
  },
  mounted() {
  }
};
</script>

<style scoped>
.container {
  width: 375px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
/* .section {
  height: 500px;
  overflow: auto;
  padding-top: 10px;
} */
.footer {
  width: 375px;
  height: 97px;
  /* position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%); */
}
.importantText {
  padding: 10px 19px;
  font-size: 12px;
  color: rgba(18, 165, 137, 1);
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
/* 自定义图片 */
.custom-img{
  width: 300px;
  height: 180px;
  position: relative;
  left: 50%;
  transform: translateX(-50%)
}
.custom-img-top{
  margin-top: 30px;
}
.van-grid-item--square{
  margin: 0 auto;
}
.van-image{
  width: 100%;
  height: 180px;
}
.van-icon{
  font-size: 18px;
}
.close-img{
  position: absolute;
  top: -10px;
  right: -10px;
}
</style>
<style>
/* 上传组件 */
.el-upload--picture-card {
  height: 180px !important;
  width: 300px !important;
  line-height: 200px !important;
  margin: 10px !important;
}
/* .el-upload-list--picture-card .el-upload-list__item {
  height: 180px !important;
  width: 300px !important;
  margin: 9px !important;
} */
.el-icon-plus .el-icon-plus-size{
  font-size: 14px;
  display: block;
}
</style>
