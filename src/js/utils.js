/**
 * 图片压缩
 */

export const vagina = (path, callback) => {
  console.log('调用图片压缩===')
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
    img.onload = function () {
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
      /*第一个参数是创建的img对象；第二三个参数是左上角坐标，后面两个是画布区域宽高*/
      //压缩后的base64文件
      if (isJPG && isLt2M) {
        var base64 = canvas.toDataURL("image/jpeg");
      } else {
        var base64 = canvas.toDataURL("image/jpeg", quality);
      }
      callback(base64);
    }
  };
};