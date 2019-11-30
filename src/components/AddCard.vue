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
        multiple
        accept="image/*"
        :on-success="handleSuccess"
        :on-progress='uploaded'
        :on-change="handleChange"
        :on-remove="handleRemove"
        :limit="maxlimit"
        :http-request="uploadImg"
        :auto-upload="true"
        :class="{hide:hideUpload}"
      >
        <i class="el-icon-plus">
          <div class="el-icon-plus-size">选择名片</div>
        </i>
      </el-upload>
    </div>
  </div>
</template>

<script>

export default {
  inject: ["reload"],
  data() {
    return {
      user_id: "",
      type: 10,
      city_code: "028",
      paths: "",
      fullscreenLoading: false,
      base: '',
      uid:null,    //图片唯一的标识id
      maxlimit: 10, // 最大上传数量
      hideUpload: false, // 到达最大数量隐藏
      // urlLists: [],
      tempFiles: [],
      uploadPercent: 0, // 上传成功的张数
      tempFileNum: 0, // 上传的张数
    };
  },
  methods: {
    handleSuccess(response, file, fileList){
      // console.log('handleSuccess===',file)
      // this.urlLists.push(file.url)
    },
    uploaded(event, file, fileList){
      this.urlList = fileList
      this.uid = file.uid
    },
    handleChange(file,fileList) {
      // 选择的图片达到指定数量，阻止添加图片
      this.hideUpload = fileList.length >= this.maxlimit;
      // console.log('handleChange===',file)
      // file.url= this.base
    },
    // 图片移除后
    handleRemove(file,fileList) {
      for(var i = 0 ; i < this.tempFiles.length; i++) {
        var arr = this.tempFiles[i].split(',');
        if (arr[0] == file.uid) {
          this.tempFiles.splice(i,1);
        }
      }
      this.uploadPercent--;
      this.tempFileNum--;
      // 选择的图片小于指定数量，允许添加图片
      this.hideUpload = fileList.length >= this.maxlimit;
    },
    // 确认提交
    uplaodClick() {
      var user_id = this.user_id;
      this.paths = '';
      // console.log(this.tempFiles);
      if (this.tempFiles.length>0) {
        for(var i = 0 ; i < this.tempFiles.length; i++) {
            var arr = this.tempFiles[i].split(',');
            if (i == (this.tempFiles.length - 1)) {
              this.paths += (arr[1])
            } else {
              this.paths += (arr[1] + ',')
            }
          }
        }
        var paths = this.paths;
        var city_code = this.city_code;
        var url = this.$global_msg.upload;
        var obj = { user_id, paths, city_code };
        // console.log(this.uploadPercent,'====',this.tempFiles.length)
        if (this.uploadPercent == this.tempFiles.length) {
          this.fullscreenLoading = false;
          this.axios.post(url, obj).then(res => {
            // console.log(res);
            var msg = res.data.msg;
            var status = res.data.status;
            // 显示上传按钮
            this.hideUpload = false;
            this.$toast(msg);
            this.tempFiles = [];
            this.tempFileNum = 0;
            this.uploadPercent = 0;
            this.$refs.upload.clearFiles();
          })
        } else if(this.uploadPercent == 0){
          this.$toast("请选择图片");
        }else{
          // console.log(this.uploadPercent,'====',this.tempFiles.length)
          this.$toast("图片正在上传，请稍后");
      }
    },
    // 重新选择
    clearCheck() {
      this.tempFiles = []; // 清除列表中的地址
      this.uploadPercent = 0;
      this.tempFileNum = 0;
      // this.urlLists = []; // 列表清空
      this.$refs.upload.clearFiles()
      this.hideUpload = false;
    },
    // 图片压缩打包
    async uploadImg(options) {
      var that = this;
      that.fullscreenLoading = true;
      // 获取文件对象
      let file = options.file;
      // console.log(file)
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
          var obj = { user_id, base64, type };
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
              // console.log(res)
              // console.log(file.uid);
              that.tempFiles.push(file.uid + ',' + res.data.data);
              // console.log(that.tempFiles);
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
