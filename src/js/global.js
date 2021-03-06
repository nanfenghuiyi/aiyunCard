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
const lineRecords= '/web/ThirdReportBusLine/records'

// 上报名片带数据
const lineCardUpload = '/Web/ThirdUploadWithData/upload'

// 上报名片带数据的记录
const lineCardRecords = '/Web/ThirdUploadWithData/records'

// 获取省市信息
const getCodeByFullNameForAmap = '/Tool/getCodeByFullNameForAmap'

// 名片统计列表
const cardStatistics = '/Web/BusUploadStatistics/cardStatistics'

// '表格'和文字上传统计列表
const textStatistics = '/Web/BusUploadStatistics/textStatistics'


if (window.location.host == 'card.a56999.com') {
  baseUrl = 'https://aybapi.a56999.com'
} else {
  baseUrl = 'http://sit.aybapi.a56999.com'
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
  lineRecords,
  lineCardUpload,
  lineCardRecords,
  getCodeByFullNameForAmap,
  cardStatistics,
  textStatistics

}