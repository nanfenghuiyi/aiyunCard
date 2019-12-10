<template>
  <div class="container">
    <div class="footer">
      <div class="upload">
        <div class="btn btnActive" v-loading.fullscreen.lock="fullscreenLoading" @click="uplaodClick">确定上传</div>
        <div class="btn" @click="clearCheck">重新选择</div>
      </div>
      <div class="importantText">注：照片需清晰可见，不可重复，一次最多可传10张</div>
    </div>
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
          <div class="el-icon-plus-size">选择名片</div>
        </i>
      </el-upload>
      <!-- 自定义图片 -->
      <div>
        <van-grid :border="true" :column-num="3" :gutter="10" :square="true">
          <van-grid-item v-for="(item, index) of imgList" :key="index">
            <van-image :src="item.path">
            </van-image>
            <van-icon @click='vanGrid(index)' name="close close-img" />
          </van-grid-item>
        </van-grid>
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
      user_id: '',
      md5_sign: '',
      type: 10,
      city_code: "028",
      paths: '',
      fullscreenLoading: false,
      base: '',
      uid:null,    //图片唯一的标识id
      maxlimit: 9, // 最大上传数量
      hideUpload: false, // 到达最大数量隐藏
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
      var user_id = this.user_id;
      this.paths = '';
      if (this.imgList.length>0) {
        var paths = this.imgList;
        var city_code = this.city_code;
        var url = this.$global_msg.upload;
        var obj = { user_id, paths, city_code };
        // console.log(this.uploadPercent,'====',this.imgList.length)
        if (this.uploadPercent == this.imgList.length) {
          this.fullscreenLoading = false;
          this.axios.post(url, obj).then(res => {
            // console.log(res);
            var msg = res.data.msg;
            var status = res.data.status;
            // if (status==1) {
              // 显示上传按钮
              this.hideUpload = false;
              this.$toast(msg);
              this.imgList = [];
              this.tempFileNum = 0;
              this.uploadPercent = 0;
              this.$refs.upload.clearFiles();
          })
        } else if(this.uploadPercent == 0){
          this.$toast("请选择图片");
        }else{
          this.fullscreenLoading = false;
          this.$toast("图片正在上传，请稍后");
        }
      }else {
        this.$toast("请选择图片");
      }
    },
    // 图片移除
    vanGrid(index){
      this.imgList.splice(index,1)
      this.uploadPercent--;
      this.tempFileNum--;
      this.hideUpload = this.imgList.length >= this.maxlimit;
    },
    // 重新选择
    clearCheck() {
      this.imgList = []; // 清除列表中的地址
      this.uploadPercent = 0;
      this.tempFileNum = 0;
      this.$refs.upload.clearFiles();
      this.hideUpload = false;
    },
    // 图片压缩打包
    async uploadImg(options) {
      // console.log(options)
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
        // console.log('转换后===',that.md5_sign)
        let base64Str = reader.result.split(",")[1];
        img.src = e.target.result;
        var spark = new SparkMD5(); //创建md5对象（基于SparkMD5）
        that.md5_sign = spark.appendBinary(img.src).end()
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
          
          // 在canvas绘制前填充白色背景
          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          // 图片压缩
          ctx.drawImage(img, 0, 0, w, h);
          // ctx.drawImage(img, 0, 0, canvas.width, canvas.height,0,0,canvas.width, canvas.height);
          /*第一个参数是创建的img对象；第二三个参数是左上角坐标，后面两个是画布区域宽高*/
          //压缩后的base64文件
          if (isJPG && isLt2M) {
            var base64 = canvas.toDataURL("image/jpeg");
          } else {
            var base64 = canvas.toDataURL("image/jpeg", quality);
          }
          // console.log(base64)
          var user_id = that.user_id;
          var type = that.type;
          var md5_sign = that.md5_sign
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
                // progressEvent.loaded 上传到服务器多少size
                // progressEvent.total 图片总的大小
                // that.uploadPercent = val;
                if(val==100) {
                  that.uploadPercent++
                }
                if (that.uploadPercent == that.tempFileNum) {
                  that.fullscreenLoading = false;
                  that.$toast('图片加载完成，请确认上传')
                }
                // console.log(that.uploadPercent,'====',that.tempFileNum)
                // console.log(that.uploadPercent)
                // options.onProgress(val)
              }
            }
          };
          that.axios.post("/Tool/upload", obj, progress)
            .then(res => {
              // console.log('/Tool/upload===',res.data)
              var data = res.data;
              if (data.status == 0) {
                that.uploadPercent--;
                that.tempFileNum--;
                that.fullscreenLoading = false;
                that.$toast(data.msg)
              }else{
                // that.fullscreenLoading = false;
                that.imgList.push(data.data);
                that.hideUpload = that.imgList.length >= that.maxlimit;
              }
            })
            .catch(err => {
              console.log(err)
            });
        };
      };
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
.section {
  /* height: 500px; */
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
/* 自定义图片 */
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
/* 上传组件 */
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
