<template>
  <div class="container">
    <div class="busText">
      <i @click="goBack"></i>
      <div>大巴车名片上传</div>
    </div>
    <div class="section">
      <el-upload
        action="http://118.190.203.67:8080"
        list-type="picture-card"
        multiple
        :limit="10"
        :http-request="uploadImg"
        :auto-upload="true"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
    </div>
    <div class="footer">
      <div class="importantText">注：照片需清晰可见，不可重复，一次最多可传10张</div>
      <div class="upload">
        <div class="btn btnActive" @click="uplaodClick">确定上传</div>
        <div class="btn" @click="clearCheck">重新选择</div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  inject: ['reload'],
  data() {
    return {
      user_id: "",
      type: 10,
      city_code: "028",
      paths: "",
      percentage: 0,
    };
  },
  methods: {
    goBack(){
      this.$router.go(-1)
    },
    // 确认提交
    uplaodClick() {
      var user_id=this.user_id;
      var paths=this.paths;
      var city_code=this.city_code;
      var url=this.$global_msg.upload;
      var obj={user_id,paths,city_code}
      // console.log(this.percentage)
      if(this.percentage==100){
        this.axios.post(url,obj).then(res=>{
          // console.log(res);
          var msg=res.data.msg;
          var status=res.data.status;
          this.$toast(msg);
          if(status==0){
            this.reload()
          }
        })
      }else {
        this.$toast("图片正在上传，请稍后");
      }
    },
    // 重新选择
    clearCheck() {
      this.reload()
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
      if (!isJPG) {
        this.$message.error("上传产品图片只能是 JPG/PNG/JPEG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传产品图片大小不能超过 1MB!");
      }
      // 创建一个HTML5的FileReader对象
      var reader = new FileReader();
      //创建一个img对象
      var img = new Image();
      let filename = options.filename;
      if (file) {
        reader.readAsDataURL(file);
      }
      if (isJPG && isLt2M) {
        reader.onload = e => {
          let base64Str = reader.result.split(",")[1];
          img.src = e.target.result;
          // base64地址图片加载完毕后执行
          img.onload = function() {
            // 缩放图片需要的canvas（也可以在DOM中直接定义canvas标签，这样就能把压缩完的图片不转base64也能直接显示出来）
            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");
            // 图片原始尺寸
            var originWidth = this.width;
            var originHeight = this.height;
            var scale = originWidth / originHeight;
            originHeight = originWidth / scale
            // 最大尺寸限制，可通过设置宽高来实现图片压缩程度
            var maxWidth = 300,
              maxHeight = 300;
            // 目标尺寸
            var targetWidth = originWidth,
              targetHeight = originHeight;
            // 图片尺寸超过最大尺寸的限制
            if (originWidth > maxWidth || originHeight > maxHeight) {
              if (originWidth / originHeight > maxWidth / maxHeight) {
                // 更改宽度，按照宽度限定尺寸
                targetWidth = maxWidth;
                targetHeight = Math.round(
                  maxWidth * (originHeight / originWidth)
                );
              } else {
                targetHeight = maxHeight;
                targetWidth = Math.round(
                  maxHeight * (originWidth / originHeight)
                );
              }
            }
            //对图片进行缩放
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            // 清除画布
            context.clearRect(0, 0, targetWidth, targetHeight);
            // 图片压缩
            context.drawImage(img, 0, 0, targetWidth, targetHeight);
            /*第一个参数是创建的img对象；第二三个参数是左上角坐标，后面两个是画布区域宽高*/
            //压缩后的base64文件
            var base64 = canvas.toDataURL("image/jpeg", 0.92);
            var user_id = that.user_id;
            var type = that.type;
            var obj = { user_id, base64, type };
            // 定义上传进度
            var progress={
              // "Content-Type": "multipart/from-data",
              onUploadProgress: progressEvent => {
                // console.log(progressEvent)
                // console.log(progressEvent.lengthComputable);
                if(progressEvent.lengthComputable) {
                  let val = parseInt(
                    (
                      (progressEvent.loaded / progressEvent.total)*100
                    ).toFixed(0)
                  );
                  // progressEvent.loaded 上传到服务器多少size
                  // progressEvent.total 图片总的大小
                  // console.log(val)
                  that.percentage = val;
                }
              }
            }
            that.axios.post("/Tool/upload", obj, progress)
            .then(res => {
              // console.log(res.data);
              if(that.paths==null||that.paths==''){
                that.paths=res.data.data
              }else {
                that.paths=that.paths+','+res.data.data
              };
            })
            .catch(err => {});
          };
        };
      }
    },
  },
  created() {
    this.user_id = JSON.parse(localStorage.getItem('user')).user.user_id;
  }
};
</script>

<style scoped>
.container{
  width: 375px;
  height: 667px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
.busText {
  width: 375px;
  height: 44px;
  line-height: 44px;
  background: rgba(255, 255, 255, 1);
  font-size: 16px;
  color: rgba(51, 51, 51, 1);
  display: flex;
  margin: 0 auto
}
.busText i{
  width: 40px;
  height: 40px;
  background: url('../assets/add/left.png') center no-repeat;
}
.busText div{
  flex: 1
}
.busText div{
  text-align: center
}
.section{
  padding-top: 10px;
}
.footer {
  width: 375px;
  height: 97px;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}
.importantText {
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
  line-height: 110px !important;
  margin: 9px !important;
}
.el-upload-list--picture-card .el-upload-list__item {
  height: 100px !important;
  width: 100px !important;
  margin: 9px !important;
}
</style>
