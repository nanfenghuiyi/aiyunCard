<template>
  <div>
    <div class="header">
      <i @click="goBack"></i>
      <div v-text="title"></div>
    </div>
    <div class="header_title">
      <div class="mr-15">上传总数：159条</div>
      <div>有效总数：130条</div>
    </div>
    <div class="section" id="section">
      <el-table :data="tableData" style="width: 100%" height="520">
        <el-table-column prop="date" label="时间" align="center" width="100"></el-table-column>
        <el-table-column prop="name" label="总数" align="center" width="65"></el-table-column>
        <el-table-column prop="province" label="有效" align="center" width="70"></el-table-column>
        <el-table-column prop="city" label="无效" align="center" width="70"></el-table-column>
        <el-table-column prop="address" label="结算" align="center" width="70"></el-table-column>
      </el-table>
      <div class="mt-1">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="1000">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "名片上传统计",
      idData: "",
      url: "",
      page : 1,
      page_size : 20,
      user_id: "",

      tableData: [
        {
          date: "2016-05-07",
          name: "16",
          province: "20",
          city: "43",
          address: "34",
        }
      ]
    };
  },
  methods: {
    // 返回事件
    goBack() {
      this.$router.go(-1);
    },
    // 获取数据
    getStatistic(index) {
      var url = this.url;
      var page = index;
      var page_size = this.page_size;
      var obj ={user_id: this.user_id}
      this.axios.post(url, obj).then(res => {
        console.log(res)
      })
    },
    // 获取传递的参数
    getParam() {
      this.idData = this.$route.query;
      let id = this.idData.id;
      console.log(id)
      if (id.id == 1) {
        this.title = "名片上传统计";
      }else if (id.id == 2) {
        this.title = "表格上传统计";
      }else if (id.id == 3) {
        this.title = "线路上传统计";
      }
      this.getStatistic(1);
    },
    // 分页
    handleCurrentChange(val) {
      this.getStatistic(val);
      console.log(val);
    }
  },
  mounted() {
    // 状态控制
    if (JSON.parse(localStorage.getItem("user")) != null && JSON.parse(localStorage.getItem("user")).user != null && JSON.parse(localStorage.getItem("user")).user.user_id != null) {
      this.user_id = JSON.parse(localStorage.getItem("user")).user.user_id;
      // 获取传递的参数
      this.getParam();
    }else {
      this.$router.push({path: '/'})
    }
  }
};
</script>

<style>
.header {
  width: 100%;
  height: 44px;
  line-height: 44px;
  z-index: 99;
  background: rgba(255, 255, 255, 1);
  font-size: 16px;
  color: rgba(51, 51, 51, 1);
  display: flex;
  margin: 0 auto;
}
.header i {
  position: absolute;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  background: url("../assets/add/left.png") center no-repeat;
}
.header div {
  flex: 1;
  text-align: center;
}
.header_title{
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size:14px;
  display: flex;
  justify-content: center;
}
.mr-15{
  margin-right: 15%;
}
.mt-1{
  margin-top: 10px;
}
.section{
  text-align: center;
}
</style>