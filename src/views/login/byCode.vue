<template>
    <div id="login">
        <div class="title">
            <h3>SenseKeeper</h3>
            <p>用户系统</p>
        </div>
        <van-cell-group>
            <van-field v-model="phone" left-icon="shouji" :placeholder="errorMsg.phone" :error="errorPhone" clearable @input="checkPhone" />
            <van-field v-model="sms" left-icon="yanzhengma" center clearable :placeholder="errorMsg.sms" :error="errorSms" @input="checkSms">
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
      phone: "",
      sms: "",
      sendSmsTxt: "发送验证码",
      countDown: 60,
      errorPhone: false,
      errorSms: false,
      disabledSms: true,
      disabledLogin: true,
      errorMsg: {
        phone: "请输入手机号",
        sms: "请输入短信验证码"
      },
      checkLogin: {
        phone: "12345678",
        sms: "1234"
      },
      loading: false
    };
  },
  created() {},
  mounted() {},
  methods: {
    checkPhone() {
      let reg = /(^[0-9]{8}$)|(^[0-9]{10}$)|(^[0-9]{11}$)/;
      if (this.phone != "") {
        this.errorPhone = false;
        if (reg.test(this.phone)) {
          this.disabledSms = false;
          this.disabledLogin = false;
        } else {
          this.disabledSms = true;
          this.disabledLogin = true;
        }
      }
    },
    checkSms() {
      if (this.sms != "") {
        this.errorSms = false;
        this.errorMsg.sms = "请输入短信验证码";
      }
    },
    sendSms() {
      this.disabledSms = true;
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
      // 请求验证码
      //   this.$axios.post();
    },
    login() {
      this.loading = true;
      if (this.sms == "") {
        this.errorSms = true;
        this.loading = false;
        return;
      }
      if (
        this.phone != this.checkLogin.phone ||
        this.sms != this.checkLogin.sms
      ) {
        this.sms = "";
        this.errorMsg.sms = "验证码错误";
        this.errorSms = true;
        this.loading = false;
        return;
      }

      setTimeout(() => {
      // 验证通过
      this.loading = false;
      this.$toast.success({
          message: "登录成功",
          duration: 200
      });
        
      }, 500);
      setTimeout(()=>{
          this.$router.push("/person");
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
