<template>
    <div id="login">
        <div class="title">
            <h3>SenseKeeper</h3>
            <p>用户系统</p>
        </div>
        <van-cell-group>
            <van-field v-model="phone" left-icon="shouji" placeholder="请输入手机号" clearable @input="checkPhone" />
        </van-cell-group>
        <van-button size="large" type="primary" round :disabled="disabledLogin" @click="login" :loading="loading">登录</van-button>
    </div>
</template>
<script>
export default {
  name: "app",
  data() {
    return {
      phone: "",
      countDown: 60,
      disabledLogin: true,
      loading: false
    };
  },
  created() {},
  mounted() {},
  methods: {
    checkPhone() {
      let reg = /(^[0-9]{8}$)|(^[0-9]{10}$)|(^[0-9]{11}$)/;
        if (reg.test(this.phone)) {
          this.disabledLogin = false;
        }
    },
    login() {
      this.loading = true;

      setTimeout(() => {
      // 验证通过
      this.loading = false;
      this.$toast.success({
          message: "登录成功",
          duration: 200
      });
        
      }, 500);
      setTimeout(()=>{
        //   this.$router.push("/person");
      },1000)
    }
  }
};
</script>

<style lang="less" scoped>
#login {
  .title {
    padding: 50px 0;
  }
  .van-cell-group {
    padding: 0 20px;
    /deep/.van-field__body {
      padding-left: 12px;
    }
  }
  .van-button--large {
    margin-top: 20px;
    width: 75%;
    height: 40px;
    line-height: 38px;
  }
}
</style>
