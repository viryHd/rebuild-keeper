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
      } else {
        this.disabledLogin = true;
      }
    },
    login() {
      this.loading = true;
      this.$axios
        .get(`/h5/user/mobile?mobile=${this.phone}`)
        .then(res => {
          this.loading = false;
          if (res.data.code === 402) {
            this.$dialog
              .alert({
                message: "该手机号未与公司员工绑定，请联系管理员绑定手机号！"
              })
              .then(() => {
                return;
              });
          } else if (res.data.code === 0) {
            this.$store.state.userLogin = res.data.data;
            this.$store.state.userLogin.phone = this.phone;
            localStorage.setItem('userLogin', JSON.stringify(this.$store.state.userLogin));
            if (res.data.data.isRegister) {
              this.$toast.success({
                message: "跳转头像验证",
                duration: 200
              });
              this.$router.push("/loginByPic");
            } else {
              this.$dialog
                .confirm({
                  message: "该员工未完善头像信息，请使用验证码登录！",
                  confirmButtonText: "跳转"
                })
                .then(() => {
                  // on confirm
                  this.$router.push("/loginByCode");
                })
                .catch(() => {
                  // on cancel
                  return;
                });
            }
          }
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
          this.$toast.fail('服务器繁忙');
        });
    }
  }
};
</script>

<style lang="less" scoped>
#login {
  .title {
    padding: 30px 0;
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
