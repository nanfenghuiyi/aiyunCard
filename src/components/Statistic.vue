<template>
  <div>
    <div class="header">
      <i @click="goBack"></i>
      <div v-text="title"></div>
    </div>
    <!-- tab标签 -->
    <div>
      <el-tabs v-model="activeName" :addable="false" type="card" :stretch="true" @tab-click="handleClick">
        <el-tab-pane label="名片统计" name="1">
        </el-tab-pane>
        <el-tab-pane label="表格统计" name="2">
        </el-tab-pane>
        <el-tab-pane label="线路统计" name="3">
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="header_title">
      <div class="mr-15">上传总数：{{all_card_count}} {{company}}</div>
      <div>有效总数：{{all_card_valid_count}} {{company}}</div>
    </div>
    <div class="section" id="section"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tableData"
      style="width: 100%"
    >
      <el-table :data="tableData" style="width: 100%" height="460">
        <el-table-column prop="date" label="时间" align="center" width="100"></el-table-column>
        <el-table-column prop="all_count" label="上传总数" align="center" width="65"></el-table-column>
        <el-table-column prop="valid_count" :label="valid_title" align="center" width="70"></el-table-column>
        <el-table-column prop="invalid_count" :label="invalid_title" align="center" width="70"></el-table-column>
        <el-table-column prop="settlement_count" :label="settlement_title" align="center" width="70"></el-table-column>
      </el-table>
      <div class="mt-1">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <div class="footer">数据显示每天0点前所统计的数据</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: '1',

      title: "名片上传统计",
      idData: "",
      url: "",
      page : 1,
      page_size : 10,
      user_id: "",
      all_card_count: 0, // 总数
      all_card_valid_count: 0, // 有效总数
      total: 1, // 总页数
      company: "张",
      valid_title: "有效张数",
      invalid_title: "无效张数",
      settlement_title: "结算张数",

      tableData: [],
      loading: false,
    };
  },
  methods: {
    // tabs
    handleClick(tab, event) {
      this.getParam(this.activeName)
    },
    // 返回事件
    goBack() {
      this.$router.go(-1);
    },
    // 获取数据
    getStatistic(index) {
      let url = this.url;
      let page = index;
      let page_size = this.page_size;
      let user_id = this.user_id;
      let obj ={page, page_size, user_id};
      this.axios.post(url, obj).then(res => {
        console.log(res)
        if (res != null) {
          var res = res.data.data;
          let all_count = res.all_count;
          this.all_card_count = all_count.all_card_count != null ? all_count.all_card_count : (all_count.all_text_count !=null ? all_count.all_text_count : "0");
          this.all_card_valid_count = all_count.all_card_valid_count != null ? all_count.all_card_valid_count : (all_count.all_text_valid_count !=null ? all_count.all_text_valid_count : "0");
          this.tableData = res.records;
          this.total = res.total;
          this.loading = false;
        }
      }).catch(err => {
        console.log(err);
        this.loading = false;
      })
    },
    // 获取传递的参数
    getParam(index) {
      this.loading = true;
      let id;
      if (index == 0) {
        this.idData = this.$route.query;
        id = this.idData.id;
      }else {
        id = index;
      }
      this.company = "条";
      this.valid_title = "有效条数";
      this.invalid_title = "无效条数";
      this.settlement_title = "结算条数";
      if (id == 1) {
        this.title = "名片上传统计";
        this.activeName = "1";
        this.company = "张";
        this.valid_title = "有效张数";
        this.invalid_title = "无效张数";
        this.settlement_title = "结算张数";
        this.url = this.$global_msg.cardStatistics;
      }else if (id == 2) {
        this.title = "表格上传统计";
        this.activeName = "2";
        this.url = this.$global_msg.textStatistics;
      }else if (id == 3) {
        this.title = "线路上传统计";
        this.activeName = "3";
        this.url = this.$global_msg.textStatistics;
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
      this.getParam(0);
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
.footer{
  text-align: center;
  font-size: 16px;
  margin-top: 5px;
}
</style>