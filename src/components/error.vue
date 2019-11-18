<template>
  <div class="container" >
    <div class="header">找回密码</div>
    <div class="section">
      <div>若忘记密码，需找回或修改密码，请与本平台工作人员联系，谢谢合作！</div>
      <div>联系方式：13299266911</div>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['reload'],
  data () {
    return {
      errorMessage: {
        loginShow: false,
        errorShow: true
      }
    }
  },
  methods: {
    errorClick() {
      this.$emit('errorChildFn', this.errorMessage)
    }
  },
}
</script>

<style scoped>
.container{
  width:350px;
  height:200px;
  background:rgba(255,255,255,1);
  border-radius:6px;
  margin: 0 auto;
}
.header{
  font-size:18px;
  font-weight:500;
  color:rgba(18,165,137,1);
  margin: 30px auto;
}
.section{
  text-align: left;
  width:272px;
  height:66px;
  font-size:16px;
  color:rgba(51,51,51,1);
  margin: 0 auto;
}
</style>

<style>
.container[data-v-26084dc2]{
  height: 0 !important;
}
</style>