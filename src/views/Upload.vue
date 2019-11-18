<template>
  <div class="container">
    <div class="header">
      <i @click="goBack"></i>
      <div>路线上传</div>
    </div>
    <!-- tab标签 -->
    <div class="section">
      <el-tabs v-model="activeName" type="card" :stretch="true">
        <el-tab-pane label="名片上传" name="first">
          <addcard class="tab-card"></addcard>
        </el-tab-pane>
        <el-tab-pane label="线路上传" name="second">
          <addtext @lineChildFn="lineParentFn"></addtext>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import addcard from "./AddCard"
import addtext from "./AddText"

export default {
  data () {
    return {
      activeName: 'first',
    }
  },
  components: {addcard,addtext},
  props: {},
  watch: {},
  computed: {},
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    lineParentFn() {
      this.activeName = 'second'
    }
  },
  created () {},
  mounted () {}
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
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
.section{
  margin-top: 44px;
}
.tab-card{
  height: 570px !important;
}
</style>

