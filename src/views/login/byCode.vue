<template>
  <div id="login">
    <div class="title">
      <h3>SenseKeeper</h3>
      <p>用户系统</p>
    </div>
    <van-cell-group>
      <!-- <van-field v-model="phone" left-icon="shouji" :placeholder="errorMsg.phone" :error="errorPhone" clearable @input="checkPhone" /> -->
      <van-field :value="userLogin.phone" left-icon="shouji" disabled />
      <van-field v-model="sms" left-icon="yanzhengma" center clearable placeholder="请输入短信验证码" @input="checkSms">
        <van-button slot="button" size="small" type="primary" @click="sendSms" :disabled="disabledSms">{{sendSmsTxt}}</van-button>
      </van-field>
    </van-cell-group>
    <van-button size="large" type="primary" round :disabled="disabledLogin" @click="login" :loading="loading">登录</van-button>
  </div>
</template>
<script>
export default {
  name: "app",
  data() {
    return {
      sms: "",
      sendSmsTxt: "发送验证码",
      countDown: 60,
      disabledSms: false,
      disabledLogin: true,
      loading: false,
      userLogin: {
        id: 0,
        companyId: 0,
        isRegister: 0,
        isAdmin: null,
        phone: "",
        token: ""
      }
    };
  },
  created() {
    this.userLogin = JSON.parse(localStorage.userLogin);
  },
  mounted() {},
  methods: {
    checkSms() {
      if (this.sms) {
        this.disabledLogin = false;
      } else {
        this.disabledLogin = true;
      }
    },
    sendSms() {
      this.disabledSms = true;
      // 请求验证码
      this.$axios
        .get(`/h5/getCode?mobile=${this.userLogin.phone}`)
        .then(res => {
          if (res.data.code === 0) {
            // 拿到验证码
          } else {
            this.$toast.fail(res.data.desc);
          }
        })
        .catch(err => {
          console.log(err);
        });
        let timeId = setInterval(() => {
        this.countDown--;
        this.sendSmsTxt = "重新发送(" + this.countDown + ")";
        if (this.countDown <= 0) {
          clearInterval(timeId);
          this.countDown = 60;
          this.sendSmsTxt = "发送验证码";
          this.disabledSms = false;
        }
      }, 1000);
    },
    login() {
      this.loading = true;
      if (this.sms == "") {
        this.errorSms = true;
        this.loading = false;
        return;
      }
      // 验证验证码

      this.$axios
        .get(
          `/h5/checkCode?mobile=${this.userLogin.phone}&sms=${
            this.sms
          }`
        )
        .then(res => {
          this.loading = false;
          console.log(res);
          if (res.data.code === 0) {
            this.$toast.success({
              message: "验证通过",
              duration: 200
            });
            // 员工信息界面
            this.$router.push("/person");
          } else {
            this.$toast(res.data.desc);
          }
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
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
