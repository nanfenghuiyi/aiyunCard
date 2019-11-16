const login ='/Web/ThirdUploader/login' //登录接口
// { phone, pwd, captcha, token }

//登出接口
const logout='/Web/ThirdUploader/logout'
// { user_id }

// 上传记录
const records='/Web/ThirdUploader/records'
// { user_id, page = 1, page_size = 20 }

// 提交上传
const upload='/Web/ThirdUploader/upload'
// { user_id, paths, city_code }

// 图形验证码
const captcha ='/Web/ThirdUploader/captcha'

// 文件上传
const fileUpload ='/Tool/upload'
// { user_id, base64, type = 10 }

// 当前地址
let baseUrl = ''

// 省获取
const getProvinces = "/Tool/getProvinces"
const getCities = "/Tool/getCities"

// 路线详情
const detail = 'web/ThirdReportBusLine/detail'

// 上报的记录
const lineRecords= 'web/ThirdReportBusLine/records'




if (window.location.host == 'card.a56999.com') {
  baseUrl = 'https://aybapi.a56999.com'
} else {
  baseUrl = 'http://118.190.203.67:8080'
}

export default {
  login,
  logout,
  records,
  upload,
  captcha,
  fileUpload,
  baseUrl,
  getProvinces,
  getCities,
  detail,
  lineRecords
}